import { createReducer } from './utilities';
import { CHANGE_PAGE } from '../actions';

export default createReducer('downloads', {
  [CHANGE_PAGE]: changePage
});

function changePage(state, action) {
  return action.page;
}
