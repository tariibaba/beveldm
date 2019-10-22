import http from 'http';
import https from 'https';

export function httpGetPromise(url, options) {
  return new Promise(resolve => {
    const protocol = new URL(url).protocol === 'http:' ? http : https;
    protocol.get(url, options, res => resolve(res));
  });
}
