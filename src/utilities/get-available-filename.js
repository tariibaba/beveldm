import path from 'path';
import pathExists from 'path-exists';
import getDownloadPath from './get-download-path'

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

  while (true) {
    const noDownloadWithFullPath = downloads
      .filter(download => download.status !== 'gettinginfo')
      // eslint-disable-next-line no-loop-func
      .every(download => getDownloadPath(download) !== fullPath);
    if (!(await pathExists(fullPath)) && noDownloadWithFullPath) {
      break;
    }
    suffix++;
    availableFilename = `${nameWithoutExtension} (${suffix})${extension}`;
    fullPath = path.join(dirname, availableFilename);
  }

  return availableFilename;
}
