function isOnline() {
  return new Promise((resolve, reject) => {
    dd.device.connection.getNetworkType({
      onSuccess: data => {
        if (data.result === 'none') {
          resolve(false);
        } else {
          resolve(data.result);
        }
      },
      onFail: err => {
        reject(err);
      },
    })
  })
}

function removeStaticParam(currentParam, staticParam, filterKey) {
    let ret = {}, needFilterKey = filterKey && Array.isArray(filterKey) && filterKey.length > 0;
    Object.keys(currentParam).forEach((key) => {
        if (!staticParam.hasOwnProperty(key)) {
            if (!needFilterKey || filterKey.indexOf(key) !== -1) {
                ret[key] = currentParam[key];
            }
        }
    });
    return ret;
}

export { 
  isOnline,
  removeStaticParam,
};