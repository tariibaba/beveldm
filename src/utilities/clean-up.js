import deleteFile from './delete-file';
import getDownloadPath from './get-download-path';
import Timeout from 'await-timeout';

export default async function cleanUp(state) {
  Object.values(state.downloads.byId).forEach(cleanUpDownload);
  await new Timeout().set(50);
}

function cleanUpDownload(download) {
  if (download.status === 'progressing') {
    download.res.destroy();
    download.status = 'paused';
  }

  if (!download.show && download.status !== 'complete') {
    deleteFile(getDownloadPath(download));
  }

  return download;
}
