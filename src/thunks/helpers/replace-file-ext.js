import path from 'path';

export default function (filepath, newExt) {
  return filepath.replace(path.extname(filepath), newExt);
}
