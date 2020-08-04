import { NOTIFY } from './constants';

export function notify({ type, message, action, responseCallback }) {
  return {
    type: NOTIFY,
    ntype: type,
    message,
    action,
    responseCallback,
  };
}
