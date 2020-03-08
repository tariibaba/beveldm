import Store from 'electron-store';
import fs from 'fs';
import { getDownloadPath, getPartialDownloadPath } from '../utilities';
import pify from 'pify';
import pathExists from 'path-exists';
import setTaskbarProgress from '../utilities/set-taskbar-progress';

export default function loadState() {
  return async (_dispatch, getState) => {
    const store = new Store();

    let savedDownloads = store.get('downloads') || [];
    savedDownloads = await Promise.all(savedDownloads.map(fillMissingProps));

    getState().downloads = savedDownloads;
    setTaskbarProgress(savedDownloads);

    getState().settings = store.get('settings') || {};
    getState().downloadGroup = store.get('downloadGroup') || 'all';

    return Promise.resolve();
  };
}

async function fillMissingProps(savedDownload) {
  const path = getDownloadPath(savedDownload);
  const partialPath = getPartialDownloadPath(savedDownload);
  let downloadWithRequiredProps = savedDownload;

  if (savedDownload.status === 'complete') {
    if (!(await pathExists(path))) {
      downloadWithRequiredProps = {
        ...savedDownload,
        status: 'removed'
      };
    }
  } else if (
    !(await pathExists(partialPath)) &&
    savedDownload.status !== 'notstarted' &&
    savedDownload.status !== 'canceled'
  ) {
    downloadWithRequiredProps = {
      ...savedDownload,
      status: 'removed'
    };
  } else if (savedDownload.status === 'canceled') {
    if (!(await pathExists(partialPath))) {
      downloadWithRequiredProps = {
        ...savedDownload,
        bytesDownloaded: 0
      };
    }
  } else if (savedDownload.status === 'paused') {
    const stat = pify(fs.stat);
    const partialFileSize = (await stat(partialPath)).size;
    downloadWithRequiredProps = {
      ...savedDownload,
      bytesDownloaded: partialFileSize
    };
  }

  downloadWithRequiredProps = {
    ...downloadWithRequiredProps,
    bytesDownloadedShown: downloadWithRequiredProps.bytesDownloaded,
    speed: 0
  };

  return downloadWithRequiredProps;
}
