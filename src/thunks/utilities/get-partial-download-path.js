import replaceFileExt from './replace-file-ext';
import getDownloadPath from './get-download-path';
import { PARTIAL_DOWNLOAD_EXTENSION } from '../../constants';

export default function getPartialDownloadPath(download) {
  return replaceFileExt(getDownloadPath(download), PARTIAL_DOWNLOAD_EXTENSION);
}
