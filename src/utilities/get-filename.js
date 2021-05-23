import contentDipositionFilename from 'content-disposition-filename';

export default function getFilename(url, headers) {
  const cdFilename = contentDipositionFilename(headers['content-disposition']);
  let filename = cdFilename;
  if (!filename) {
    const pathnames = new URL(url).pathname.split('/');
    filename = pathnames[pathnames.length-1];
  }

  return decodeURIComponent(filename).replace(/^"|"+$/g, '');
}
