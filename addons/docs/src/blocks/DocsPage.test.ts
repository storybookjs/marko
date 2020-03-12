import { defaultTitleSlot } from './Title';

describe('defaultTitleSlot', () => {
  it('showRoots', () => {
    const parameters = {
      options: { showRoots: true },
    };
    expect(defaultTitleSlot({ kind: 'a/b/c', parameters })).toBe('c');
    expect(defaultTitleSlot({ kind: 'a|b', parameters })).toBe('a|b');
    expect(defaultTitleSlot({ kind: 'a/b/c.d', parameters })).toBe('c.d');
  });
  it('no showRoots', () => {
    const parameters = {};
    expect(defaultTitleSlot({ kind: 'a/b/c', parameters })).toBe('c');
    expect(defaultTitleSlot({ kind: 'a|b', parameters })).toBe('b');
    expect(defaultTitleSlot({ kind: 'a/b/c.d', parameters })).toBe('d');
  });
  it('empty options', () => {
    const parameters = { options: {} };
    expect(defaultTitleSlot({ kind: 'a/b/c', parameters })).toBe('c');
    expect(defaultTitleSlot({ kind: 'a|b', parameters })).toBe('b');
    expect(defaultTitleSlot({ kind: 'a/b/c.d', parameters })).toBe('d');
  });
});
