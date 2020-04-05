import { ipcRenderer } from 'electron';
import sumBy from 'sum-by';

export default function setTaskbarProgress(downloads) {
  const statusFilter = ['notstarted', 'progressing', 'paused', 'gettinginfo'];
  const activeDownloads = Object.values(downloads.byId).filter((download) =>
    statusFilter.includes(download.status)
  );

  const activeDownloadsBytesDownloaded = sumBy(
    activeDownloads,
    (download) => download.bytesDownloaded
  );
  const activeDownloadsSize = sumBy(
    activeDownloads,
    (download) => download.size
  );
  const activeDownloadsProgress =
    activeDownloadsBytesDownloaded / activeDownloadsSize || 0;

  const downloadsIsOnlyGettingInfo =
    activeDownloads.length > 0 &&
    activeDownloads.every((download) => download.status === 'gettinginfo');

  if (downloadsIsOnlyGettingInfo) {
    ipcRenderer.send('set-progress-indeterminate');
  } else ipcRenderer.send('set-progress', activeDownloadsProgress);

  // If there's just one active download and it's complete
  if (activeDownloadsProgress === 1) ipcRenderer.send('clear-progress');
}
