import { defineJestParameters } from './shared';

describe('defineJestParameters', () => {
  test('infers from story file name if jest parameter is not provided', () => {
    expect(defineJestParameters({ fileName: './stories/addon-jest.stories.js' })).toEqual([
      'addon-jest',
    ]);
  });

  test('wraps string jest parameter with an array', () => {
    expect(defineJestParameters({ jest: 'addon-jest' })).toEqual(['addon-jest']);
  });

  test('returns as is if jest parameter is an array', () => {
    expect(defineJestParameters({ jest: ['addon-jest', 'something-else'] })).toEqual([
      'addon-jest',
      'something-else',
    ]);
  });

  test('returns null if disabled option is passed to jest parameter', () => {
    expect(defineJestParameters({ jest: { disabled: true } })).toEqual(null);
  });
});
