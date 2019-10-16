import http from 'http';
import fs from 'fs';

export function fsExistsPromise(path) {
  return new Promise(resolve => {
    fs.exists(path, exists => resolve(exists));
  });
}

export function httpGetPromise(options) {
  return new Promise(resolve => {
    http.get(options, res => resolve(res));
  });
}
