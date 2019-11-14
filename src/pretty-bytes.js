export default function (bytes) {
  if (bytes === 0)
    return '0 B';
    
  const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let unitIndex = 0;
  let prettyBytes = bytes;
  while (prettyBytes >= 1024 && unitIndex < units.length - 1) {
    prettyBytes /= 1024;
    unitIndex++;
  }
  const fractionDigits = Math.log10(prettyBytes) < 2 ? 1 : 0;
  
  return prettyBytes.toFixed(fractionDigits) + ' ' + units[unitIndex];
}
