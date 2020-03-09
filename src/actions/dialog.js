import { OPEN_DIALOG, CLOSE_DIALOG } from './constants';

export function openDialog(dtype, data) {
  return {
    type: OPEN_DIALOG,
    dtype,
    open: true,
    data
  };
}

export function closeDialog() {
  return {
    type: CLOSE_DIALOG,
    open: false
  };
}
