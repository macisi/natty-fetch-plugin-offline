# natty-fetch-plugin-offline

[![npm](https://img.shields.io/npm/v/natty-fetch-plugin-offline.svg)](https://www.npmjs.com/package/natty-fetch-plugin-offline)
[![npm](https://img.shields.io/npm/dm/natty-fetch-plugin-offline.svg)](https://www.npmjs.com/package/natty-fetch-plugin-offline)

The offline plugin for natty-fetch.

install width npm:

```sh
npm install --save natty-fetch-plugin-offline
```

## Configuration

Typical Usage:

```js
import nattyFetch from 'natty-fetch';
import NattyFetchPluginOffline from 'natty-fetch-plugin-offline';
import { DRIVERS } from 'a-storage';

const offlinePlugin = NattyFetchPluginOffline({
  driver: DRIVERS.SESSIONSTORAGE,
});

const context = nattyFetch.context();
context.create({
  foo: {
    url: 'foo.json',
    method: 'GET',
    plugin: [
      offlinePlugin,
    ]
  }
});
```

### driver

- Select the usage of particular driver, which is defined in [a-storage](https://github.com/macisi/a-storage).
- type: String
- default: `LOCALSTORAGE`
- available drivers:

  driver | description
  --- | ---
  `MEMORY` | Use JavaScript Object
  `LOCALSTORAGE` | Use native localStorage
  `SESSIONSTORAGE` | Use native sessionStorage
  `DOMAINSTORAGE` | domainStorage provide by dingtalk

### offlineEnv

- Define the offline environment. When the page or device is in the offline environment, the request will response with the data which is stored in the local storage.
- type: Array
- default: `['2g', '3g', 'unknown', 'none']`


### getEnvType

- Define the method which get the environment type. Always return the promise object that can be resolved.
- type: Function
- default: built-in function
- example: 

  ```js
  getEnvType() {
    return Promise.resolve('4g');
  }
  ```

### autoResendRequest

- Save the request sent in offline, and resend it when the network is online.
- type: Boolean
- default: false

### pollingInterval

- Used with `autoResendRequest` set `true`, the plugin will polling the network status at intervals.
- type: Number
- default: 1e3 * 10

## HOW TO

>> How to clear stored data in the local storage manually?

When used with this plugin, this context object will add a property named `storage` which is the instance of [a-storage](https://github.com/macisi/a-storage). You can clear the storage data with it.
```js
const context = nattyFetch.context();
context.create({
  ...,
  foo: {
    plugin: [ offlinePlugin ]
  }
});
context.foo.storage.clear();

```