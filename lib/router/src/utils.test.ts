import { getMatch, parsePath } from './utils';

describe('getMatch', () => {
  it('gets startsWithTarget match', () => {
    const output = getMatch('/foo/bar', '/foo', true);

    expect(output).toEqual({
      path: '/foo/bar',
    });
  });

  it('gets currentIsTarget match', () => {
    const output = getMatch('/foo', '/foo', false);

    expect(output).toEqual({
      path: '/foo',
    });
  });

  it('gets matchTarget match', () => {
    const output = getMatch('/foo', '/f.+', false);

    expect(output).toEqual({
      path: '/foo',
    });
  });

  it('returns null match', () => {
    const output = getMatch('/foo/bar', '/foo/baz', true);

    expect(output).toBe(null);
  });
});

describe('parsePath', () => {
  it('should work without path', () => {
    const output = parsePath(undefined);

    expect(output).toEqual({
      viewMode: undefined,
      storyId: undefined,
      refId: undefined,
    });
  });

  it('should parse /foo/bar correctly', () => {
    const output = parsePath('/foo/bar');

    expect(output).toMatchObject({
      viewMode: 'foo',
      storyId: 'bar',
    });
  });

  it('should parse /foo/bar/x correctly', () => {
    const output = parsePath('/foo/bar/x');

    expect(output).toMatchObject({
      viewMode: 'foo',
      storyId: 'bar',
    });
  });

  it('should parse /viewMode/refId_story--id correctly', () => {
    const output = parsePath('/viewMode/refId_story--id');

    expect(output).toMatchObject({
      viewMode: 'viewmode',
      storyId: 'story--id',
      refId: 'refid',
    });
  });
});
