import { parseArgsParam } from './parseArgsParam';

jest.mock('@storybook/client-logger', () => ({
  once: { warn: jest.fn() },
}));

describe('parseArgsParam', () => {
  it('parses a simple key-value pair', () => {
    const args = parseArgsParam('key:val');
    expect(args).toEqual({ key: 'val' });
  });

  it('parses spaces', () => {
    const args = parseArgsParam('key:one+two+three');
    expect(args).toEqual({ key: 'one two three' });
  });

  it('parses null', () => {
    const args = parseArgsParam('key:!null');
    expect(args).toEqual({ key: null });
  });

  it('parses undefined', () => {
    const args = parseArgsParam('key:!undefined');
    expect(args).toEqual({ key: undefined });
  });

  it('parses multiple values', () => {
    const args = parseArgsParam('one:1;two:2;three:3');
    expect(args).toEqual({ one: '1', two: '2', three: '3' });
  });

  it('parses arrays', () => {
    const args = parseArgsParam('arr[]:1;arr[]:2;arr[]:3');
    expect(args).toEqual({ arr: ['1', '2', '3'] });
  });

  it('parses arrays with indices', () => {
    const args = parseArgsParam('arr[0]:1;arr[1]:2;arr[2]:3');
    expect(args).toEqual({ arr: ['1', '2', '3'] });
  });

  it('parses repeated values as arrays', () => {
    const args = parseArgsParam('arr:1;arr:2;arr:3');
    expect(args).toEqual({ arr: ['1', '2', '3'] });
  });

  it('parses simple objects', () => {
    const args = parseArgsParam('obj.one:1;obj.two:2');
    expect(args).toEqual({ obj: { one: '1', two: '2' } });
  });

  it('parses nested objects', () => {
    const args = parseArgsParam('obj.foo.one:1;obj.foo.two:2;obj.bar.one:1');
    expect(args).toEqual({ obj: { foo: { one: '1', two: '2' }, bar: { one: '1' } } });
  });

  it('parses arrays in objects', () => {
    expect(parseArgsParam('obj.foo[]:1;obj.foo[]:2')).toEqual({ obj: { foo: ['1', '2'] } });
    expect(parseArgsParam('obj.foo[0]:1;obj.foo[1]:2')).toEqual({ obj: { foo: ['1', '2'] } });
    expect(parseArgsParam('obj.foo:1;obj.foo:2')).toEqual({ obj: { foo: ['1', '2'] } });
  });

  it('parses single object in array', () => {
    const args = parseArgsParam('arr[].one:1;arr[].two:2');
    expect(args).toEqual({ arr: [{ one: '1', two: '2' }] });
  });

  it('parses multiple objects in array', () => {
    expect(parseArgsParam('arr[0].key:1;arr[1].key:2')).toEqual({
      arr: [{ key: '1' }, { key: '2' }],
    });
    expect(parseArgsParam('arr[0][key]:1;arr[1][key]:2')).toEqual({
      arr: [{ key: '1' }, { key: '2' }],
    });
  });

  it('parses nested object in array', () => {
    expect(parseArgsParam('arr[].foo.bar:val')).toEqual({ arr: [{ foo: { bar: 'val' } }] });
    expect(parseArgsParam('arr[][foo][bar]:val')).toEqual({ arr: [{ foo: { bar: 'val' } }] });
  });

  describe('key sanitization', () => {
    it("omits keys that aren't in the extended alphanumeric set", () => {
      expect(parseArgsParam('a`b:val')).toEqual({});
      expect(parseArgsParam('a~b:val')).toEqual({});
      expect(parseArgsParam('a!b:val')).toEqual({});
      expect(parseArgsParam('a@b:val')).toEqual({});
      expect(parseArgsParam('a#b:val')).toEqual({});
      expect(parseArgsParam('a$b:val')).toEqual({});
      expect(parseArgsParam('a%b:val')).toEqual({});
      expect(parseArgsParam('a^b:val')).toEqual({});
      expect(parseArgsParam('a&b:val')).toEqual({});
      expect(parseArgsParam('a*b:val')).toEqual({});
      expect(parseArgsParam('a(b:val')).toEqual({});
      expect(parseArgsParam('a)b:val')).toEqual({});
      expect(parseArgsParam('a=b:val')).toEqual({});
      expect(parseArgsParam('"b":val')).toEqual({});
      expect(parseArgsParam('a/b:val')).toEqual({});
      expect(parseArgsParam('a\\b:val')).toEqual({});
      expect(parseArgsParam('a|b:val')).toEqual({});
      expect(parseArgsParam('a[b:val')).toEqual({});
      expect(parseArgsParam('a]b:val')).toEqual({});
      expect(parseArgsParam('a{b:val')).toEqual({});
      expect(parseArgsParam('a}b:val')).toEqual({});
      expect(parseArgsParam('a?b:val')).toEqual({});
      expect(parseArgsParam('a<b:val')).toEqual({});
      expect(parseArgsParam('a>b:val')).toEqual({});
      expect(parseArgsParam('a,b:val')).toEqual({});
    });

    it('allows keys that are in the extended alphanumeric set', () => {
      expect(parseArgsParam(' key :val')).toEqual({ ' key ': 'val' });
      expect(parseArgsParam('+key+:val')).toEqual({ ' key ': 'val' });
      expect(parseArgsParam('-key-:val')).toEqual({ '-key-': 'val' });
      expect(parseArgsParam('_key_:val')).toEqual({ _key_: 'val' });
      expect(parseArgsParam('KEY123:val')).toEqual({ KEY123: 'val' });
      expect(parseArgsParam('1:val')).toEqual({ '1': 'val' });
    });

    it('also applies to nested object keys', () => {
      expect(parseArgsParam('obj.a!b:val')).toEqual({});
      expect(parseArgsParam('obj[a!b]:val')).toEqual({});
      expect(parseArgsParam('arr[][a!b]:val')).toEqual({});
      expect(parseArgsParam('arr[0][a!b]:val')).toEqual({});
    });

    it('completely omits an arg when a (deeply) nested key is invalid', () => {
      expect(parseArgsParam('obj.foo.a!b:val;obj.foo.bar:val;obj.baz:val')).toEqual({});
      expect(parseArgsParam('obj.foo[][a!b]:val;obj.foo.bar:val;obj.baz:val')).toEqual({});
      expect(parseArgsParam('obj.foo.a!b:val;key:val')).toEqual({ key: 'val' });
    });
  });

  describe('value sanitization', () => {
    it("omits values that aren't in the extended alphanumeric set", () => {
      expect(parseArgsParam('key:a`b')).toEqual({});
      expect(parseArgsParam('key:a~b')).toEqual({});
      expect(parseArgsParam('key:a!b')).toEqual({});
      expect(parseArgsParam('key:a@b')).toEqual({});
      expect(parseArgsParam('key:a#b')).toEqual({});
      expect(parseArgsParam('key:a$b')).toEqual({});
      expect(parseArgsParam('key:a%b')).toEqual({});
      expect(parseArgsParam('key:a^b')).toEqual({});
      expect(parseArgsParam('key:a&b')).toEqual({});
      expect(parseArgsParam('key:a*b')).toEqual({});
      expect(parseArgsParam('key:a(b')).toEqual({});
      expect(parseArgsParam('key:a)b')).toEqual({});
      expect(parseArgsParam('key:a=b')).toEqual({});
      expect(parseArgsParam('key:a[b')).toEqual({});
      expect(parseArgsParam('key:a]b')).toEqual({});
      expect(parseArgsParam('key:a{b')).toEqual({});
      expect(parseArgsParam('key:a}b')).toEqual({});
      expect(parseArgsParam('key:a\\b')).toEqual({});
      expect(parseArgsParam('key:a|b')).toEqual({});
      expect(parseArgsParam("key:a'b")).toEqual({});
      expect(parseArgsParam('key:a"b')).toEqual({});
      expect(parseArgsParam('key:a,b')).toEqual({});
      expect(parseArgsParam('key:a.b')).toEqual({});
      expect(parseArgsParam('key:a<b')).toEqual({});
      expect(parseArgsParam('key:a>b')).toEqual({});
      expect(parseArgsParam('key:a/b')).toEqual({});
      expect(parseArgsParam('key:a?b')).toEqual({});
    });

    it('allows values that are in the extended alphanumeric set', () => {
      expect(parseArgsParam('key: val ')).toEqual({ key: ' val ' });
      expect(parseArgsParam('key:+val+')).toEqual({ key: ' val ' });
      expect(parseArgsParam('key:_val_')).toEqual({ key: '_val_' });
      expect(parseArgsParam('key:-val-')).toEqual({ key: '-val-' });
      expect(parseArgsParam('key:VAL123')).toEqual({ key: 'VAL123' });
      expect(parseArgsParam('key:1')).toEqual({ key: '1' });
    });

    it('also applies to nested object and array values', () => {
      expect(parseArgsParam('obj.key:a!b')).toEqual({});
      expect(parseArgsParam('obj[key]:a!b')).toEqual({});
      expect(parseArgsParam('arr[][key]:a!b')).toEqual({});
      expect(parseArgsParam('arr[0][key]:a!b')).toEqual({});
      expect(parseArgsParam('arr[]:a!b')).toEqual({});
      expect(parseArgsParam('arr[0]:a!b')).toEqual({});
    });

    it('completely omits an arg when a (deeply) nested value is invalid', () => {
      expect(parseArgsParam('obj.key:a!b;obj.foo:val;obj.bar.baz:val')).toEqual({});
      expect(parseArgsParam('obj.arr[]:a!b;obj.foo:val;obj.bar.baz:val')).toEqual({});
      expect(parseArgsParam('obj.arr[0]:val;obj.arr[1]:a!b;obj.foo:val')).toEqual({});
      expect(parseArgsParam('obj.arr[][one]:a!b;obj.arr[][two]:val')).toEqual({});
      expect(parseArgsParam('arr[]:val;arr[]:a!b;key:val')).toEqual({ key: 'val' });
      expect(parseArgsParam('arr[0]:val;arr[1]:a!1;key:val')).toEqual({ key: 'val' });
      expect(parseArgsParam('arr[0]:val;arr[2]:a!1;key:val')).toEqual({ key: 'val' });
    });
  });
});
