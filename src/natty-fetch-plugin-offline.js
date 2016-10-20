import nattyFetch from 'natty-fetch';
import localforage from 'localforage';
import assign from 'object-assign';
import { isOnline, removeStaticParam } from './util';
const { appendQueryString, extend, param, _event } = nattyFetch._util;
const { jsonp, ajax } = nattyFetch;

const localStore = {};

let offlinePlugin = (apiInstance) => {
  apiInstance.config.customRequest = (vars, config, defer) => {

    let storeName = apiInstance._path.replace(/\W/g, '_');
    let store = localStore[storeName];
    if (!store) {
      store = localStore[storeName] = localforage.createInstance({
        name: storeName,
      });
    }
    let key = param(removeStaticParam(vars.data, config.data));

    const _baseConfig = {
      traditional: config.traditional,
      cache: config.cache,
      mark: vars.mark,
      log: config.log,
      url: config.mock ? config.mockUrl: config.url,
      data: vars.data,
      // methods
      success(responese) {
        apiInstance.processResponse(vars, config, defer, responese);
        store.setItem(key, responese);
      },
      complete() {
        if (vars.retryTime === undefined || vars.retryTime === config.retry) {
            apiInstance.api.pending = false;
            apiInstance.api._requester = null;
        }
      },
    };
    let _config;
    if (config.jsonp) {
      _config = assign(_baseConfig, {
        flag: config.jsonpFlag,
        callbackName: config.jsonpCallbackName,
        error() {
          let error = {
              message: 'Not Accessable JSONP: ' + vars.mark.__api
          };

          defer.reject(error);
          _event.fire('g.reject', [error, config]);
          _event.fire(t.api.contextId + '.reject', [error, config]);
        }
      });
    } else {
      _config = assign(_baseConfig, {
        header: config.header,
        withCredentials: config.withCredentials,
        accept: 'json',
        error(status) {
          let message;
          switch (status) {
            case 404:
              message = 'Not Found';
              break;
            case 500:
              message = 'Internal Server Error';
              break;
            default:
              message = 'Unknown Server Error';
              break;
          }

          let error = {
            status,
            message: message + ': ' + vars.mark.__api
          };

          defer.reject(error);
          _event.fire('g.reject', [error, config]);
          _event.fire(t.api.contextId + '.reject', [error, config]);
        }
      });
    }

    let _makeAjaxRequest = () => {
      if (config.jsonp) {
        jsonp(_config);
      } else {
        ajax(_config);
      }
    };

    isOnline().then(online => {
      if (online) {
        // device is online
        _makeAjaxRequest();
      } else {
        // device is offline
        store.getItem(key)
          .then(data => {
            apiInstance.processResponse(vars, config, defer, data)
          });
      }
    }).catch(() => {
      // cannot get network status
      // still send request
      _makeAjaxRequest();
    });

  };
};

let plugin = {
  offlinePlugin,
};

nattyFetch.plugin.offline = plugin;

export default plugin;