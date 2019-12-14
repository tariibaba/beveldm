import Store from 'electron-store';
import fs from 'fs';
import { getDownloadPath, getPartialDownloadPath } from './helpers';
import pify from 'pify';
import pathExists from 'path-exists';

export default function loadState() {
  return async (_dispatch, getState) => {
    const store = new Store();

    let savedDownloads = store.get('downloads') || [];
    savedDownloads = await Promise.all(
      savedDownloads.map(async download => {
        const path = getDownloadPath(download);
        const partialPath = getPartialDownloadPath(download);

        if (download.status === 'complete') {
          if (!(await pathExists(path))) {
            download = {
              ...download,
              status: 'removed'
            };
          }
        } else if (
          !(await pathExists(partialPath)) &&
          download.status !== 'notstarted' &&
          download.status !== 'canceled'
        ) {
          download = {
            ...download,
            status: 'removed'
          };
        } else if (download.status === 'canceled') {
          if (!(await pathExists(partialPath))) {
            download = {
              ...download,
              bytesDownloaded: 0
            };
          }
        } else if (download.status === 'paused') {
          const stat = pify(fs.stat);
          download = {
            ...download,
            bytesDownloaded: (await stat(partialPath)).size
          };
        }

        return download;
      })
    );

    getState().downloads = savedDownloads;
    getState().settings = store.get('settings') || {};

    return Promise.resolve();
  };
}
