import prettyBytes from './pretty-bytes';

describe('pretty-bytes.js default export function', () => {
  it('displays bytes in a more readable format', () => {
    expect(prettyBytes(27)).toEqual({ size: '27', unit: 'B' });
    expect(prettyBytes(174831)).toEqual({ size: '170', unit: 'KB' });
    expect(prettyBytes(45839320)).toEqual({ size: '43.7', unit: 'MB' });
    expect(prettyBytes(83708352627)).toEqual({ size: '77.9', unit: 'GB' });
    expect(prettyBytes(3751483728191)).toEqual({
      size: '3493',
      unit: 'GB',
    });
  });

  it('truncates the decimal digits of the size appropriately', () => {
    expect(prettyBytes(5.875 * 1024)).toEqual({ size: '5.8', unit: 'KB' });
    expect(prettyBytes(68.23 * 1024 * 1024)).toEqual({
      size: '68.2',
      unit: 'MB',
    });
    expect(prettyBytes(472.453 * 1024)).toEqual({
      size: '472',
      unit: 'KB',
    });
    expect(prettyBytes(7234.82 * 1024 * 1024 * 1024)).toEqual({
      size: '7234',
      unit: 'GB',
    });
    expect(prettyBytes(5)).toEqual({ size: '5', unit: 'B' });
    expect(prettyBytes(3.0)).toEqual({ size: '3', unit: 'B' });
    expect(prettyBytes(4.642)).toEqual({ size: '4', unit: 'B' });
    expect(prettyBytes(7 * 1024)).toEqual({ size: '7.0', unit: 'KB' });
    expect(prettyBytes(8.0 * 1024)).toEqual({ size: '8.0', unit: 'KB' });
    expect(prettyBytes(12 * 1024 * 1024)).toEqual({ size: '12.0', unit: 'MB' });
    expect(prettyBytes(732 * 1024)).toEqual({ size: '732', unit: 'KB' });
  });
});
