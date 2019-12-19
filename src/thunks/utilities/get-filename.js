import contentDipositionFilename from 'content-disposition-filename';
import path from 'path';

export default function getFilename(url, headers) {
  if (headers['content-disposition'])
    return contentDipositionFilename(headers['content-disposition']);
  else {
    const urlobj = new URL(url);
    return path.basename(urlobj.origin + urlobj.pathname);
  }
}
