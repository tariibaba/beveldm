function getFriendlyStorage(bytes) {
  const units = ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb'];
  let unitIndex = 0;
  let size = bytes;
  while (size >= 1024) {
    size /= 1024;
    unitIndex++;
  }
  return { size: size.toPrecision(3), unit: units[unitIndex] };
}

export default getFriendlyStorage;
