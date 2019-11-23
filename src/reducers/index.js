import C from '../actions';

export function downloads(state = [], action) {
  switch (action.type) {
    case C.ADD_NEW_DOWNLOAD:
      return [
        ...state,
        {
          id: action.id,
          url: action.url,
          dirname: action.dirname,
          status: action.status
        }
      ];
    case C.START_DOWNLOAD:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              res: action.res,
              status: action.status,
              resumable: action.resumable
            }
          : download
      );
    case C.STARTING_DOWNLOAD:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              status: 'starting'
            }
          : download
      );
    case C.UPDATE_BYTES_DOWNLOADED:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              bytesDownloaded: action.bytesDownloaded
            }
          : download
      );
    case C.PAUSE_DOWNLOAD:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              status: action.status
            }
          : download
      );
    case C.RESUME_DOWNLOAD:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              res: action.res,
              status: action.status
            }
          : download
      );
    case C.RESUMING_DOWNLOAD:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              status: action.status
            }
          : download
      );
    case C.COMPLETE_DOWNLOAD:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              status: action.status
            }
          : download
      );
    case C.CANCEL_DOWNLOAD:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              status: action.status,
              res: undefined
            }
          : download
      );
    case C.REMOVE_DOWNLOAD:
      return state.filter(download => download.id !== action.id);
    case C.CHANGE_DOWNLOAD_URL:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              url: action.newUrl,
              res: undefined
            }
          : download
      );
    case C.DOWNLOAD_ERROR:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              status: action.status,
              error: action.error
            }
          : download
      );
    case C.CHANGE_DOWNLOAD_BASIC_INFO:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              filename: action.filename,
              availableFilename: action.availableFilename,
              size: action.size
            }
          : download
      );
    case C.DOWNLOAD_REMOVED:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              status: action.status
            }
          : download
      );
    case C.DOWNLOAD_NOT_STARTED:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              status: action.status
            }
          : download
      );
    default:
      return state;
  }
}

export function interval(state = null, action) {
  switch (action.type) {
    case C.SET_INTERVAL:
      return action.interval;
    default:
      return state;
  }
}

export function intervalSubscribers(state = [], action) {
  switch (action.type) {
    case C.SUBSCRIBE_TO_INTERVAL:
      return [...state, { id: action.id, action: action.action }];
    case C.UNSUBSCRIBE_FROM_INTERVAL:
      return state.filter(subscriber => subscriber.id !== action.id);
    default:
      return state;
  }
}

export function message(state = {}, action) {
  switch (action.type) {
    case C.ALERT:
      return {
        value: action.message,
        type: action.messageType,
        actionName: action.actionName,
        action: action.action
      };
    default:
      return state;
  }
}
