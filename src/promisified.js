import http from 'http';
import https from 'https';
import fs from 'fs';

export function fsExistsPromise(path) {
  return new Promise(resolve => {
    fs.exists(path, exists => resolve(exists));
  });
}

export function httpGetPromise(url, options) {
  return new Promise(resolve => {
    const protocol = new URL(url).protocol === 'http:' ? http : https;
    protocol.get(url, options, res => resolve(res));
  });
}
