import nattyFetch from 'natty-fetch';
import NattyFetchPluginOffline from '../src/natty-fetch-plugin-offline';
import { DRIVERS } from 'a-storage';

const { _event } = nattyFetch;

const offlinePlugin = NattyFetchPluginOffline({
  driver: DRIVERS.SESSIONSTORAGE,
  offlineEnv: ['2g', '3g', '4g', 'unknown', 'none'],
  getEnvType() {
    return Promise.resolve('wifi');
  }
});

const context = nattyFetch.context({
  withCredentials: false,
  data: {
    __token: '__token',
  },
});
context.create({
  successGET: {
    url: 'http://dip.alibaba-inc.com/api/v2/services/schema/mock/45931',
    method: 'GET',
    data: {
      foo: 'bar'
    },
    plugins: [
      offlinePlugin,
    ]
  },
  successJSONP: {
    url: 'http://dip.alibaba-inc.com/api/v2/services/schema/mock/45931',
    jsonp: true,
    data: {
      foo: 'bar2'
    },
    plugins: [
      offlinePlugin,
    ]
  },
  successPOST: {
    url: 'http://dip.alibaba-inc.com/api/v2/services/schema/mock/45931',
    method: 'POST',
    data: {
      foo: 'bar2'
    },
    plugins: [
      offlinePlugin,
    ]
  },
  failReq: {
    url: './mock/fail.json',
    method: 'GET',
    data: {
      foo: 'bar'
    },
    plugins: [
      offlinePlugin,
    ]
  }
});

// context.api.successGET({
//   test: '123'
// }).then(res => {
//   console.info(res);
// });
// context.api.successJSONP({
//   test: '123'
// }).then(res => {
//   console.info(res);
// });
// context.api.successPOST({
//   test: '456'
// }).then(res => {
//   console.info(res);
// });

const APIS = ['successGET', 'successJSONP', 'successPOST'];
console.log(context);

const run = () => {
  var param = {
    key: document.querySelector('#param').value,
  };
  for (let apiName of APIS) {
    context.api[apiName](param)
      .then(res => {
        let dl = document.querySelector(`[data-api=${apiName}]`);
        dl.querySelector('code').innerHTML = JSON.stringify(res);
      });
  }
};

const clear = () => {
  for (let apiName of APIS) {
    let dl = document.querySelector(`[data-api=${apiName}]`);
    dl.querySelector('code').innerHTML = '';
  }
};

const clearStorage = () => {
  for (let apiName of APIS) {
    context.api[apiName].storage.clear();
  }
}

document.querySelector('#J_Run').addEventListener('click', e => {
  run();
}, false);
document.querySelector('#J_Clear').addEventListener('click', e => {
  clear();
}, false);
document.querySelector('#J_ClearStorage').addEventListener('click', e => {
  clearStorage();
}, false);



