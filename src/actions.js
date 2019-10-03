import { v4 } from 'uuid';

const ADD_NEW_DOWNLOAD = 'ADD_NEW_DOWNLOAD';
const START_DOWNLOAD = 'START_DOWNLOAD';

const C = { ADD_NEW_DOWNLOAD, START_DOWNLOAD };

export function addNewDownload(url, filename, size) {
  return {
    type: ADD_NEW_DOWNLOAD,
    id: v4(),
    url,
    filename,
    size,
    status: 'notstarted'
  };
}

export function startDownload(id, res) {
  return {
    type: START_DOWNLOAD,
    id,
    res,
    status: 'started'
  };
}

export default C;
