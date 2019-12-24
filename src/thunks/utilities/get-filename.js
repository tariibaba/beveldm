import contentDipositionFilename from 'content-disposition-filename';
import path from 'path';

export default function getFilename(url, headers) {
  const cdFilename = contentDipositionFilename(headers['content-disposition']);
  const filename = cdFilename || path.basename(url);

  return decodeURIComponent(filename);
}
