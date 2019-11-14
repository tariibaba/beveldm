import Store from 'electron-store';

export function loadState() {
  return async (_dispatch, getState) => {
    const store = new Store();
    getState().downloads = store.get('downloads') || [];
  };
}
