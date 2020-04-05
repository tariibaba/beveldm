export default function updateBytesDownloadedThunk(id, bytesDownloaded) {
  return async (_dispatch, getState) => {
    getState().downloads.byId[id].bytesDownloaded = bytesDownloaded;
  };
}
