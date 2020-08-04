import { updateObject, createReducer } from './utilities';
import { NOTIFY } from '../actions';

export default createReducer(
  {},
  {
    [NOTIFY]: notify
  }
);

function notify(state, action) {
  return updateObject(state, {
    type: action.ntype,
    message: action.message,
    responseCallback: action.responseCallback,
    action: action.action
  });
}
