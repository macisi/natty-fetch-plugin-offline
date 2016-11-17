import nattyFetch from 'natty-fetch';
import NattyFetchPluginOffline from '../src/natty-fetch-plugin-offline';
import { DRIVERS } from 'a-storage';

const offlinePlugin = NattyFetchPluginOffline({
  driver: DRIVERS.SESSIONSTORAGE,
  getEnvType() {
    return Promise.resolve('4g');
  }
});

const context = nattyFetch.context({
  withCredentials: false,
  data: {
    __token: '__token',
  },
});
context.create({
  successGet: {
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

console.log(context);
context.api.successGet({
  test: '123'
}).then(res => {
  console.info(res);
});
context.api.successJSONP({
  test: '123'
}).then(res => {
  console.info(res);
});
context.api.successPOST({
  test: '456'
}).then(res => {
  console.info(res);
});
context.api.failReq({
  test: '456'
}).then(res => {
  console.info(res);
});

