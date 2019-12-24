import contentDipositionFilename from 'content-disposition-filename';
import path from 'path';

export default function getFilename(url, headers) {
  if (headers['content-disposition'])
    return contentDipositionFilename(headers['content-disposition']);
  else {
    return path.basename(url);
  }
}
