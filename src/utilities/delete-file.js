import fs from 'fs';
import pify from 'pify';

export default function deleteFile(path) {
  const unlink = pify(fs.unlink);
  return unlink(path);
}
