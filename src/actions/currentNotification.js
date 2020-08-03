import { NOTIFY } from './constants';

export function notify(variant, message, action, responseCallback) {
  return {
    type: NOTIFY,
    variant,
    message,
    action,
    responseCallback,
  };
}
