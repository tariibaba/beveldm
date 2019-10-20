import C from '../actions';

export function downloads(state = [], action) {
  switch (action.type) {
    case C.ADD_NEW_DOWNLOAD:
      return [
        ...state,
        {
          id: action.id,
          url: action.url,
          filename: action.filename,
          dirname: action.dirname,
          size: action.size,
          status: action.status,
          bytesDownloaded: action.bytesDownloaded
        }
      ];
    case C.START_DOWNLOAD:
      return state.map(download => {
        if (download.id === action.id) {
          return {
            ...download,
            res: action.res,
            status: action.status,
            resumable: action.resumable
          };
        } else return download;
      });
    case C.UPDATE_BYTES_DOWNLOADED:
      return state.map(download => {
        if (download.id === action.id) {
          return {
            ...download,
            bytesDownloaded: action.bytesDownloaded
          };
        } else return download;
      });
    case C.PAUSE_DOWNLOAD:
      return state.map(download => {
        if (download.id === action.id) {
          return {
            ...download,
            status: action.status
          };
        } else return download;
      });
    case C.RESUME_DOWNLOAD:
      return state.map(download => {
        if (download.id === action.id) {
          return {
            ...download,
            res: action.res,
            status: action.status
          };
        } else return download;
      });
    case C.COMPLETE_DOWNLOAD:
      return state.map(download => {
        if (download.id === action.id) {
          return {
            ...download,
            status: action.status
          };
        } else return download;
      });
    default:
      return state;
  }
}
