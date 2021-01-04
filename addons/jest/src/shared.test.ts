import { defineJestParameter } from './shared';

describe('defineJestParameter', () => {
  test('infers from story file name if jest parameter is not provided', () => {
    expect(defineJestParameter({ fileName: './stories/addon-jest.stories.js' })).toEqual([
      'addon-jest',
    ]);
  });

  test('wraps string jest parameter with an array', () => {
    expect(defineJestParameter({ jest: 'addon-jest' })).toEqual(['addon-jest']);
  });

  test('returns as is if jest parameter is an array', () => {
    expect(defineJestParameter({ jest: ['addon-jest', 'something-else'] })).toEqual([
      'addon-jest',
      'something-else',
    ]);
  });

  test('returns null if disabled option is passed to jest parameter', () => {
    expect(defineJestParameter({ jest: { disabled: true } })).toBeNull();
  });

  test('returns null if no filename to infer from', () => {
    expect(defineJestParameter({})).toBeNull();
  });

  test('returns null if filename is a module ID that cannot be inferred from', () => {
    // @ts-ignore
    expect(defineJestParameter({ fileName: 1234 })).toBeNull();
  });
});
