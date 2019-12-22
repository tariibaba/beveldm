export default function(bytes) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let unitIndex = 0;
  let prettyBytes = bytes;
  while (prettyBytes >= 1024 && unitIndex < units.length - 1) {
    prettyBytes /= 1024;
    unitIndex++;
  }

  const integerDigits = getWholeNumberDigits(prettyBytes);
  let fractionDigits;
  if (integerDigits < 2) {
    fractionDigits = 2;
  } else if (integerDigits === 2) {
    fractionDigits = 1;
  } else {
    fractionDigits = 0;
  }

  return prettyBytes.toFixed(fractionDigits) + ' ' + units[unitIndex];
}

function getWholeNumberDigits(number) {
  return number.toString().split('.')[0].length;
}
