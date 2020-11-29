import getBytes from './get-bytes';

describe('get-bytes.js default export function', () => {
  it('converts a storage size to its equivalent in bytes', () => {
    expect(getBytes(12, 'B')).toBe(12);
    expect(getBytes(15, 'KB')).toBe(15360);
    expect(getBytes(283, 'MB')).toBe(296747008);
    expect(getBytes(8, 'GB')).toBe(8589934592);
  });

  it('does not return a floating-point number', () => {
    expect(getBytes(235.4, 'B')).toBe(235);
    expect(getBytes(12.83, 'KB')).toBe(13137);
  });

  it('throws an error on unrecognized input', () => {
    expect(() => {
      getBytes(12, 'AB');
    }).toThrowError('Unknown storage unit.');
  });
});
