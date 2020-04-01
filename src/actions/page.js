import { CHANGE_PAGE } from './constants';

export function changePage(page) {
  return {
    type: CHANGE_PAGE,
    page
  };
}
