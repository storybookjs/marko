import { buildArgsParam, getMatch, parsePath } from './utils';

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

describe('buildArgsParam', () => {
  it('builds a simple key-value pair', () => {
    const param = buildArgsParam({ key: 'val' });
    expect(param).toEqual('key:val');
  });

  it('builds multiple values', () => {
    const param = buildArgsParam({ one: '1', two: '2', three: '3' });
    expect(param).toEqual('one:1;two:2;three:3');
  });

  it('builds booleans', () => {
    const param = buildArgsParam({ yes: true, no: false });
    expect(param).toEqual('yes:1;no:0');
  });

  it('builds arrays', () => {
    const param = buildArgsParam({ arr: ['1', '2', '3'] });
    expect(param).toEqual('arr[]:1;arr[]:2;arr[]:3');
  });

  it('builds simple objects', () => {
    const param = buildArgsParam({ obj: { one: '1', two: '2' } });
    expect(param).toEqual('obj.one:1;obj.two:2');
  });

  it('builds nested objects', () => {
    const param = buildArgsParam({ obj: { foo: { one: '1', two: '2' }, bar: { one: '1' } } });
    expect(param).toEqual('obj.foo.one:1;obj.foo.two:2;obj.bar.one:1');
  });

  it('builds arrays in objects', () => {
    const param = buildArgsParam({ obj: { foo: ['1', '2'] } });
    expect(param).toEqual('obj.foo[]:1;obj.foo[]:2');
  });

  it('builds single object in array', () => {
    const param = buildArgsParam({ arr: [{ one: '1', two: '2' }] });
    expect(param).toEqual('arr[].one:1;arr[].two:2');
  });

  it('builds multiple objects in array', () => {
    const param = buildArgsParam({ arr: [{ one: '1' }, { two: '2' }] });
    expect(param).toEqual('arr[].one:1;arr[].two:2');
  });

  it('builds nested object in array', () => {
    const param = buildArgsParam({ arr: [{ foo: { bar: 'val' } }] });
    expect(param).toEqual('arr[].foo.bar:val');
  });
});
