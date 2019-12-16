import { NOTIFY } from './constants';

export function notify(variant, message, actionName, action) {
  return {
    type: NOTIFY,
    variant,
    message,
    actionName,
    action
  };
}
