import contentDipositionFilename from 'content-disposition-filename';
import path from 'path';

export default function getFilename(url, headers) {
  let filename;

  if (headers['content-disposition'])
    filename = contentDipositionFilename(headers['content-disposition']);
  else {
    filename = path.basename(url);
  }

  return decodeURIComponent(filename);
}
