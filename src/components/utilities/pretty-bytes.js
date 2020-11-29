export default function (bytes) {
  const units = ['KB', 'MB', 'GB'];
  const [prettyBytes, unit] = units.reduce(
    ([prevBytes, prevUnit], currUnit) =>
      prevBytes >= 1024 ? [prevBytes / 1024, currUnit] : [prevBytes, prevUnit],
    [bytes, 'B']
  );
  const [wholeNumberDigits, decimalDigits] = prettyBytes.toString().split('.');
  const decimalPlaces = wholeNumberDigits.length <= 2 ? 1 : 0;
  const truncatedDecimalDigits =
    (unit !== 'B' &&
      ((decimalDigits && decimalDigits.slice(0, decimalPlaces)) ||
        (decimalPlaces && '0'))) ||
    '';
  const truncatedPrettyBytes = `${wholeNumberDigits}${
    truncatedDecimalDigits && '.'
  }${truncatedDecimalDigits}`;
  return { size: truncatedPrettyBytes, unit };
}
