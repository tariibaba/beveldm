import C from '../actions';
import { v4 } from 'uuid';

export function downloads(state = [], action) {
  switch (action.type) {
    case C.ADD_NEW_DOWNLOAD:
      return [
        ...state,
        {
          id: v4(),
          url: action.url,
          filename: action.filename,
          size: action.size,
          status: action.status
        }
      ];
    case C.START_DOWNLOAD:
      return state.map(download => {
        if (download.id === action.id) {
          return {
            ...download,
            res: action.res,
            status: action.status
          };
        } else return download;
      });
    default:
      return state;
  }
}
