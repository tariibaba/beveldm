import { v4 } from 'uuid';

const ADD_NEW_DOWNLOAD = 'ADD_NEW_DOWNLOAD';

const C = { ADD_NEW_DOWNLOAD };

export function addNewDownload(url, filename, size) {
  return {
    type: ADD_NEW_DOWNLOAD,
    id: v4(),
    url,
    filename,
    size
  };
}

export default C;
