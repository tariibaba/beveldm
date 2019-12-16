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
    variant: action.variant,
    message: action.message,
    actionName: action.actionName,
    action: action.action
  });
}
