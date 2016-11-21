import nattyFetch from 'natty-fetch';
import assign from 'object-assign';
import md5 from 'md5';
import { getNetworkType } from './util';
import Storage, { DRIVERS } from 'a-storage';
const { appendQueryString, extend, param, NULL, TRUE, FALSE } = nattyFetch._util;
const { jsonp, ajax, _event } = nattyFetch;

const pluginMethods = {
  getStorageKey(param) {
    return md5(JSON.stringify(param));
  },
  pollingEnvType(apiInstance, config, defer) {
    apiInstance.pollingTimer && clearTimeout(apiInstance.pollingTimer);
    apiInstance.pollingTimer = setTimeout(() =>{
      apiInstance.offlinePlugin.isOffline()
        .then(offline => {
          if (!offline) {
            apiInstance.reqQueue.forEach(vars => {
              this.makeRequest(apiInstance, vars, config, defer);
            });
          } else {
            this.pollingEnvType(apiInstance, config, defer);
          }
        });

    }, apiInstance.pollingInterval);
  },
  makeRequest(apiInstance, vars, config, defer) {
    const key = this.getStorageKey(assign({}, vars.mark, apiInstance.dynamicParams));

    apiInstance.offlinePlugin.isOffline()
      .then(offline => {
        if (offline) {
          if (apiInstance.autoResendRequest) {
            apiInstance.reqQueue.push(vars);
            this.pollingEnvType(apiInstance, config, defer);
          }
          apiInstance.offlinePlugin.storage.getItem(key)
            .then(content => {
              defer.resolve(JSON.parse(content));
            })
            .catch(error => defer.reject(error));
        } else {
          if (config.jsonp) {
            this.sendJSONP.call(apiInstance, vars, config, key, defer);
          } else {
            this.sendAjax.call(apiInstance, vars, config, key, defer);
          }
        }
      });
  },
  sendAjax(vars, config, key, defer) {
    const t = this;
    const url = config.mock ? config.mockUrl: config.url;

    t.api._requester = ajax({
      traditional: config.traditional,
      urlStamp: config.urlStamp,
      mark: vars.mark,
      useMark: config.mark,
      log: config.log,
      url,
      method: config.method,
      data: vars.data,
      header: config.header,
      withCredentials: config.withCredentials,
      accept: 'json',
      success(response) {
        pluginMethods.processResponse.call(t, vars, config, defer, response, key);
      },
      error(status) {
        // 如果跨域使用了自定义的header，且服务端没有配置允许对应的header，此处status为0，目前无法处理。
        const error = {
          status,
          message: `Error(status ${status}) in request for ${vars.mark._api}(${url})`
        };

        defer.reject(error);
        _event.fire('g.reject', [error, config]);
        _event.fire(t.api.contextId + '.reject', [error, config]);
      },
      complete(/*status, xhr*/) {
        if (vars.retryTime === undefined || vars.retryTime === config.retry) {
          t.api.pending = FALSE;
          t.api._requester = NULL;
        }
      }
    });
  },
  sendJSONP(vars, config, key, defer) {
    const t = this;
    const url = config.mock ? config.mockUrl: config.url;

    return jsonp({
      traditional: config.traditional,
      log: config.log,
      mark: vars.mark,
      useMark: config.mark,
      url,
      data: vars.data,
      urlStamp: config.urlStamp,
      flag: config.jsonpFlag,
      callbackName: config.jsonpCallbackName,
      success(response) {
        pluginMethods.processResponse.call(t, vars, config, defer, response, key);
      },
      error() {
        let error = {
            message: `Not accessable JSONP in request for ${vars.mark._api}(${url})`
        };

        defer.reject(error);
        _event.fire('g.reject', [error, config]);
        _event.fire(t.api.contextId + '.reject', [error, config]);
      },
      complete() {
        if (vars.retryTime === undefined || vars.retryTime === config.retry) {
          t.api.pending = FALSE;
          t.api._requester = NULL;
        }
      }
    });
  },
  processResponse(vars, config, defer, response, key) {
    const t = this;
    // 调用 didFetch 钩子函数
    config.didFetch(vars, config);

    // 非标准格式数据的预处理
    response = config.fit(response, vars);
    // console.log(vars, config, defer, response);

    if (response.success) {
      // 数据处理
      let content = config.process(response.content, vars);
      

      let resolveDefer = () => {
        defer.resolve(content);
        _event.fire('g.resolve', [content, config], config);
        _event.fire(t.api.contextId + '.resolve', [content, config], config);
      };

      // 不再支持内置 storageUseable 配置
      // TODO: 文档中说明
      resolveDefer();
      t.offlinePlugin.storage.setItem(key, JSON.stringify(content));
    } else {
      let error = extend({
        message: '`success` is false, ' + t._path
      }, response.error);
      // NOTE response是只读的对象!!!
      defer.reject(error);
      _event.fire('g.reject', [error, config]);
      _event.fire(t.api.contextId + '.reject', [error, config]);
    }
  }
};

const defaultPluginConfig = {
  driver: DRIVERS.LOCALSTORAGE,
  offlineEnv: ['2g', '3g', 'unknown', 'none'],
  getEnvType: getNetworkType,
  autoResendRequest: false,
  pollingInterval: 1e3 * 10,
};

const NattyFetchPluginOffline = (config = {}) => {
  config = assign(defaultPluginConfig, config);
  const { driver, offlineEnv, getEnvType, autoResendRequest, pollingInterval } = config;
  const storage = Storage({
    driver,
  });

  const isOffline = () => {
    return new Promise(resolve => {
      getEnvType()
        .then(env => {
          resolve(offlineEnv.indexOf(env) !== -1);
        });
    });
  };

  const plugin = apiInstance => {
    apiInstance.offlinePlugin = plugin;
    apiInstance.autoResendRequest = autoResendRequest;
    if (autoResendRequest) {
      apiInstance.reqQueue = [];
      apiInstance.pollingInterval = pollingInterval;
    }
    let _makeVars = apiInstance.makeVars.bind(apiInstance);
    // 重新构造内置的 makeVars 以获得动态参数
    apiInstance.makeVars = data => {
      apiInstance.dynamicParams = data;
      return _makeVars(data);
    }; 
    apiInstance.config.customRequest = (vars, config, defer) => {
      pluginMethods.makeRequest(apiInstance, vars, config, defer);
    }
    apiInstance.api.storage = storage;
  };

  plugin.isOffline = isOffline;
  plugin.storage = storage;

  return plugin;
};

export default NattyFetchPluginOffline;