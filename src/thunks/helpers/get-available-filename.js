import path from 'path';
import pathExists from 'path-exists';
import getDownloadPath from './get-download-path';

export default async function getAvailableFilename(
  id,
  dirname,
  filename,
  downloads
) {
  const extension = path.extname(filename);
  const nameWithoutExtension = filename.replace(extension, '');
  let availableWithoutExtension;
  let suffix = 0;
  let availableFilename = filename;
  let fullPath = path.resolve(dirname, availableFilename);

  while (await pathExists(fullPath)) {
    suffix++;
    availableWithoutExtension = `${nameWithoutExtension} (${suffix})`;
    availableFilename = availableWithoutExtension + extension;
    fullPath = path.resolve(dirname, availableFilename);
  }

  for (const download of downloads) {
    if (
      (download.status === 'gettinginfo' && download.id !== id) ||
      (download.status !== 'gettinginfo' &&
        getDownloadPath(download) === fullPath)
    ) {
      suffix++;
    }
    availableWithoutExtension =
      suffix > 0 ? `${nameWithoutExtension} (${suffix})` : nameWithoutExtension;
    availableFilename = availableWithoutExtension + extension;
    fullPath = path.resolve(dirname, availableFilename);
  }

  return availableFilename;
}
