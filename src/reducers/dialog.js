import { createReducer } from './utilities';
import { OPEN_DIALOG, CLOSE_DIALOG } from '../actions';

const initialState = {
  type: null,
  open: false,
  data: null
};

export default createReducer(initialState, {
  [OPEN_DIALOG]: openDialog,
  [CLOSE_DIALOG]: closeDialog
});

function openDialog(state, action) {
  return {
    type: action.dtype,
    open: action.open,
    data: action.data
  };
}

function closeDialog(state, action) {
  return {
    ...state,
    open: action.open
  }
}
