import nattyFetch from 'natty-fetch';
import nattyFetchPluginOffline from '../src/natty-fetch-plugin-offline';

const context = nattyFetch.context();
context.create({
  successReq: {
    url: './mock/success.json',
    method: 'GET',
    data: {
      foo: 'bar'
    },
    plugins: [
      nattyFetchPluginOffline.offlinePlugin,
    ]
  },
  failReq: {
    url: './mock/fail.json',
    method: 'GET',
    data: {
      foo: 'bar'
    },
    plugins: [
      nattyFetchPluginOffline.offlinePlugin,
    ]
  }
});

context.api.successReq({
  test: '123'
}).then(res => {
  console.log(res);
});
context.api.failReq({
  test: '456'
}).then(res => {
  console.log(res);
});

