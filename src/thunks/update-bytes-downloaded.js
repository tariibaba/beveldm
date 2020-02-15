export default function updateBytesDownloadedThunk(id, bytesDownloaded) {
  return async (_dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    download.bytesDownloaded = bytesDownloaded;     // State mutation for performance reasons

    return Promise.resolve();
  };
}
