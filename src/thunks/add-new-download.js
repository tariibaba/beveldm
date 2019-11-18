import { addNewDownload } from '../actions';
import request from 'request';
import { getFilename, getFileSize, getAvailableFilename } from './helpers';

export default function thunkAddNewDownload(url, dirname) {
  return async (dispatch, getState) => {
    const res = await new Promise(async resolve =>
      request.get(url).on('response', res => resolve(res))
    );
    const downloads = getState().downloads;
    const filename = getFilename(url, res.headers);
    dispatch(
      addNewDownload(
        url,
        dirname,
        filename,
        await getAvailableFilename(dirname, filename, downloads),
        getFileSize(res.headers)
      )
    );
  };
}
