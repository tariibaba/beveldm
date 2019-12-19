import path from 'path';

export default function getDownloadPath(download) {
  return path.join(download.dirname, download.availableFilename);
}
