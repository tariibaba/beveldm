export default function (download) {
  clearTimeout(download.autoretryTimeout);
  download.timeout = null;
}
