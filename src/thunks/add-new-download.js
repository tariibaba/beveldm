import path from 'path';
import { addNewDownload } from '../actions';
import { httpGetPromise } from '../promisified';
import pathExists from 'path-exists';
import { PARTIAL_DOWNLOAD_EXTENSION } from '../constants';
import contentDipositionFilename from 'content-disposition-filename';

export default function thunkAddNewDownload(url, dirname) {
  return async (dispatch, getState) => {
    const res = await httpGetPromise(url);
    const downloads = getState().downloads;
    dispatch(
      addNewDownload(
        url,
        dirname,
        await getAvailableFileName(
          dirname,
          getFileName(url, res.headers),
          downloads
        ),
        getFileSize(res.headers)
      )
    );
  };
}

async function getAvailableFileName(dirname, filename, downloads) {
  const extension = path.extname(filename);
  const nameWithoutExtension = filename.replace(extension, '');
  let availableWithoutExtension;
  let suffix = 0;
  let availableFilename = filename;
  let fullPath = path.resolve(dirname, availableFilename);
  let partialDownloadFullPath = path.resolve(dirname, nameWithoutExtension);

  while (
    (await pathExists(fullPath)) ||
    (await pathExists(partialDownloadFullPath))
  ) {
    suffix++;
    availableWithoutExtension = `${nameWithoutExtension} (${suffix})`;
    availableFilename = availableWithoutExtension + extension;
    fullPath = path.resolve(dirname, availableFilename);
    partialDownloadFullPath = path.resolve(
      dirname,
      availableWithoutExtension + PARTIAL_DOWNLOAD_EXTENSION
    );
  }

  downloads.forEach(download => {
    const downloadPath = path.resolve(download.dirname, download.filename);
    if (downloadPath === fullPath || downloadPath === partialDownloadFullPath) {
      suffix++;
      availableWithoutExtension = `${nameWithoutExtension} (${suffix})`;
      availableFilename = availableWithoutExtension + extension;
      fullPath = path.resolve(dirname, availableFilename);
      partialDownloadFullPath = path.resolve(
        dirname,
        availableWithoutExtension + PARTIAL_DOWNLOAD_EXTENSION
      );
    }
  });
  return availableFilename;
}

function getFileName(url, headers) {
  if (headers['content-disposition'])
    return contentDipositionFilename(headers['content-disposition']);
  else {
    const urlobj = new URL(url);
    return path.basename(urlobj.origin + urlobj.pathname);
  }
}

function getFileSize(headers) {
  return parseInt(headers['content-length']);
}
