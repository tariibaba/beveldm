import { ipcRenderer } from 'electron';
import sumBy from 'sum-by';

let formerTaskbarProgress = 0;
export default async function setTaskbarProgress(downloads) {
  const activeDownloads = downloads.filter(
    download =>
      download.status === 'notstarted' ||
      download.status === 'progressing' ||
      download.status === 'paused' ||
      download.status === 'gettinginfo'
  );
  const activeDownloadsBytesDownloaded = sumBy(
    activeDownloads,
    download => download.bytesDownloadedShown
  );
  const activeDownloadsSize = sumBy(activeDownloads, download => download.size);
  const activeDownloadsProgress =
    activeDownloadsBytesDownloaded / activeDownloadsSize || 0; // assign 0 if NaN

  const downloadsIsOnlyGettingInfo =
    activeDownloads.length > 0 &&
    activeDownloads.every(download => download.status === 'gettinginfo');

  if (downloadsIsOnlyGettingInfo) {
    ipcRenderer.send('set-progress-indeterminate');
  } else {
    moveProgressBar(formerTaskbarProgress, activeDownloadsProgress, 500).then(
      () => {
        if (activeDownloadsProgress === 1) ipcRenderer.send('clear-progress');
      }
    );
    formerTaskbarProgress = activeDownloadsProgress;
  }
}

function moveProgressBar(from, to, duration) {
  let lastFrameEndTime = Date.now();
  const diff = to - from;
  let curr = from;

  const nextFrame = () => {
    const scaledDeltaTime = (Date.now() - lastFrameEndTime) / duration;
    curr += diff * scaledDeltaTime;
    if (curr > to) curr = to;
    ipcRenderer.send('set-progress', curr);

    return curr < to;
  };

  return new Promise(resolve => {
    const animate = () => {
      if (nextFrame()) requestAnimationFrame(animate);
      else resolve();
      lastFrameEndTime = Date.now();
    };

    requestAnimationFrame(animate);
  });
}
