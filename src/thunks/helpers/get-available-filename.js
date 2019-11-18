import path from 'path';
import pathExists from 'path-exists';

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

  while (await pathExists(fullPath)) {
    suffix++;
    availableWithoutExtension = `${nameWithoutExtension} (${suffix})`;
    availableFilename = availableWithoutExtension + extension;
    fullPath = path.resolve(dirname, availableFilename);
  }

  downloads.forEach(download => {
    const downloadPath = path.resolve(download.dirname, download.filename);
    if (downloadPath === fullPath) {
      suffix++;
      availableWithoutExtension = `${nameWithoutExtension} (${suffix})`;
      availableFilename = availableWithoutExtension + extension;
      fullPath = path.resolve(dirname, availableFilename);
    }
  });

  return availableFilename;
}
