import http from 'http';

export default function (options) {
  return new Promise(resolve => {
    http.get(options, res => {
      resolve(res);
    });
  });
}
