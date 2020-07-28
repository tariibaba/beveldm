import ytdl from 'ytdl-core';
import downloadErrorThunk from './download-error';

export default function makeYouTubeRequest(id, url) {
  return (dispatch, getState) => {
    const download = getState().downloads.byId[id];

    return new Promise((resolve) => {
      ytdl(url, { format: download.format })
        .on('response', (res) => {
          if (res.statusCode === 403) {
            dispatch(downloadErrorThunk(id, 'EFORBIDDEN'));
          }
          resolve(res);
        })
        .on('error', (err) => {
          dispatch(downloadErrorThunk(id, err.code));
        });
    });
  };
}
