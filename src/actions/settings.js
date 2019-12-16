import { TOGGLE_SAVE_DATA} from './constants';

export function toggleSaveData(value) {
  return {
    type: TOGGLE_SAVE_DATA,
    value
  };
}
