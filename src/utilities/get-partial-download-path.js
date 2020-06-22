import getDownloadPath from './get-download-path';
import { PARTIAL_DOWNLOAD_EXTENSION } from '../constants';

export default function getPartialDownloadPath(download) {
  return getDownloadPath(download) + PARTIAL_DOWNLOAD_EXTENSION;
}
