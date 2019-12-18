import { ipcRenderer } from 'electron';
import sumBy from 'sum-by';

export default function setTaskbarProgress(downloads) {
  const activeDownloads = downloads.filter(
    download =>
      download.status === 'notstarted' ||
      download.status === 'progressing' ||
      download.status === 'paused' ||
      download.status === 'gettinginfo'
  );
  const activeDownloadsBytesDownloaded = sumBy(
    activeDownloads,
    download => download.bytesDownloaded
  );
  const activeDownloadsSize = sumBy(activeDownloads, download => download.size);
  const activeDownloadsProgress =
    activeDownloadsBytesDownloaded / activeDownloadsSize || 0;    // assign 0 if NaN

  const downloadsIsOnlyGettingInfo =
    activeDownloads.length > 0 &&
    activeDownloads.every(download => download.status === 'gettinginfo');

  if (downloadsIsOnlyGettingInfo) {
    ipcRenderer.send('set-progress-indeterminate');
  } else {
    ipcRenderer.send('set-progress', activeDownloadsProgress);
  }

  // If there's just one active download and it's complete
  if (activeDownloadsProgress === 1) {
    ipcRenderer.send('clear-progress');
  }
}
