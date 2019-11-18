import path from 'path';
import pathExists from 'path-exists';
import { PARTIAL_DOWNLOAD_EXTENSION } from '../../constants';

export default async function getAvailableFilename(
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
