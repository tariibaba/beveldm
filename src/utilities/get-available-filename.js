import path from 'path';
import getDownloadPath from './get-download-path';
import pify from 'pify';
import fs from 'fs';

export default async function getAvailableFilename(
  dirname,
  filename,
  downloads
) {
  const extension = path.extname(filename);
  const nameWithoutExtension = filename.replace(extension, '');
  let suffix = 0;
  let availableFilename = filename;
  let fullPath = path.join(dirname, availableFilename);
  const filesInDir = await pify(fs.readdir)(dirname);

  const downloadWithFullPathExists = fullPath =>
    downloads
      .filter(download => download.status !== 'gettinginfo')
      .some(download => fullPath === getDownloadPath(download));

  while (
    filesInDir.includes(availableFilename) ||
    downloadWithFullPathExists(fullPath)
  ) {
    availableFilename = `${nameWithoutExtension} (${++suffix})${extension}`;
    fullPath = path.join(dirname, availableFilename);
  }

  return availableFilename;
}
