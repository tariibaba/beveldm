export default function (size, unit) {
  const units = ['B', 'KB', 'MB', 'GB'];
  if (unit && !units.includes(unit)) {
    throw new Error('Unknown storage unit.');
  }
  return Math.floor(
    units
      .slice(
        0,
        units.findIndex((unitValue) => unitValue === unit)
      )
      .reduceRight((prevScore) => prevScore * 1024, size)
  );
}
