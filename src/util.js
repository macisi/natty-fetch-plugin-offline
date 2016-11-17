/**
 * 获取设备所处网络环境
 * @return promise
 */
export function getNetworkType() {
  return new Promise(resolve => {
    dd.device.connection.getNetworkType({
      onSuccess(data) {
        resolve(data.result);
      },
      onFail(err) {
        resolve('unknown');
      },
    });
  });
}