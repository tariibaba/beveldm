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
            return download;
          } else {
            download = {
              ...download,
              bytesDownloaded: download.size
            };
          }
        } else if (
          download.status !== 'notstarted' &&
          download.status !== 'canceled'
        ) {
          if (!(await pathExists(partialPath))) {
            download = {
              ...download,
              status: 'removed'
            };
            return download;
          }
        }

        const stat = pify(fs.stat);
        if (download.status === 'paused') {
          const partialPath = getPartialDownloadPath(download);
          download = {
            ...download,
            bytesDownloaded: (await stat(partialPath)).size
          };
        } else if (download.status === 'canceled') {
          if (await pathExists(partialPath)) {
            download = {
              ...download,
              bytesDownloaded: (await stat(partialPath)).size
            };
          } else {
            download = {
              ...download,
              bytesDownloaded: 0
            };
          }
        } else if (download.status === 'notstarted') {
          download = {
            ...download,
            bytesDownloaded: 0
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
