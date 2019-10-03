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
          size: action.size
        }
      ]
    default:
      return state;
  }
}