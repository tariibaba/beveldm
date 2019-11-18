import { updateBytesDownloaded } from '../actions';
import thunkCompleteDownload from './complete-download';

export default function thunkDownloadFile(id, res, fileStream) {
  return async (dispatch, getState) => {
    let download;
    res
      .on('data', chunk => {
        res.pause();
        download = getState().downloads.find(download => download.id === id);
        fileStream.write(chunk, err => {
          if (err) throw err;
          const received = download.bytesDownloaded + chunk.length;
          dispatch(updateBytesDownloaded(id, received));
          if (received === download.size) dispatch(thunkCompleteDownload(id));
          if (download.status !== 'paused') res.resume();
        });
      })
      .on('end', () => {
        fileStream.close();
      });
  };
}
