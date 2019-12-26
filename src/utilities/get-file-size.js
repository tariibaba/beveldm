export default function getFileSize(headers) {
  return parseInt(headers['content-length']);
}
