import { CHANGE_DOWNLOAD_GROUP } from './constants';

export function changeDownloadGroup(downloadGroup) {
  return {
    type: CHANGE_DOWNLOAD_GROUP,
    downloadGroup
  };
}
