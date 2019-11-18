import fs from 'fs';
import pify from 'pify';

export default async function deleteFile(path) {
  const unlink = pify(fs.unlink);
  await unlink(path);
}
