import { parseArgsParam } from './parseArgsParam';

jest.mock('@storybook/client-logger', () => ({
  once: { warn: jest.fn() },
}));

describe('parseArgsParam', () => {
  it('parses a simple key-value pair', () => {
    const args = parseArgsParam('key:val');
    expect(args).toStrictEqual({ key: 'val' });
  });

  it('parses spaces', () => {
    const args = parseArgsParam('key:one+two+three');
    expect(args).toStrictEqual({ key: 'one two three' });
  });

  it('parses null', () => {
    const args = parseArgsParam('key:!null');
    expect(args).toStrictEqual({ key: null });
  });

  it('parses undefined', () => {
    const args = parseArgsParam('key:!undefined');
    expect(args).toStrictEqual({ key: undefined });
  });

  it('parses hex color values', () => {
    const args = parseArgsParam('key:!hex(ff4785)');
    expect(args).toStrictEqual({ key: '#ff4785' });
  });

  it('parses rgba color values', () => {
    const args = parseArgsParam('rgb:!rgb(255,71,133);rgba:!rgba(255,71,133,0.5)');
    expect(args).toStrictEqual({ rgb: 'rgb(255, 71, 133)', rgba: 'rgba(255, 71, 133, 0.5)' });
  });

  it('parses hsla color values', () => {
    const args = parseArgsParam('hsl:!hsl(45,99,70);hsla:!hsla(45,99,70,0.5)');
    expect(args).toStrictEqual({ hsl: 'hsl(45, 99%, 70%)', hsla: 'hsla(45, 99%, 70%, 0.5)' });
  });

  it('parses Date', () => {
    const args = parseArgsParam('key:!date(2001-02-03T04:05:06.789Z)');
    expect(args).toStrictEqual({ key: new Date('2001-02-03T04:05:06.789Z') });
  });

  it('parses Date with timezone offset', () => {
    const args = parseArgsParam('key:!date(2001-02-03T04:05:06.789+09:00)');
    expect(args).toStrictEqual({ key: new Date('2001-02-03T04:05:06.789+09:00') });
  });

  it('parses Date without timezone', () => {
    const args = parseArgsParam('key:!date(2001-02-03T04:05:06.789)');
    expect(args).toStrictEqual({ key: expect.any(Date) }); // depends on local timezone
  });

  it('parses Date without second fraction', () => {
    const args = parseArgsParam('key:!date(2001-02-03T04:05:06Z)');
    expect(args).toStrictEqual({ key: new Date('2001-02-03T04:05:06.000Z') });
  });

  it('parses Date without time', () => {
    const args = parseArgsParam('key:!date(2001-02-03)');
    expect(args).toStrictEqual({ key: expect.any(Date) }); // depends on local timezone
  });

  it('does not parse Date without prefix', () => {
    const args = parseArgsParam('key:2001-02-03T04:05:06.789Z');
    expect(args).toStrictEqual({});
  });

  it('parses multiple values', () => {
    const args = parseArgsParam('one:1;two:2;three:3');
    expect(args).toStrictEqual({ one: '1', two: '2', three: '3' });
  });

  it('parses arrays', () => {
    const args = parseArgsParam('arr[]:1;arr[]:2;arr[]:3');
    expect(args).toStrictEqual({ arr: ['1', '2', '3'] });
  });

  it('parses arrays with indices', () => {
    const args = parseArgsParam('arr[0]:1;arr[1]:2;arr[2]:3');
    expect(args).toStrictEqual({ arr: ['1', '2', '3'] });
  });

  it('parses sparse arrays', () => {
    const args = parseArgsParam('arr[0]:1;arr[2]:3');
    // eslint-disable-next-line no-sparse-arrays
    expect(args).toStrictEqual({ arr: ['1', , '3'] });
  });

  it('parses repeated values as arrays', () => {
    const args = parseArgsParam('arr:1;arr:2;arr:3');
    expect(args).toStrictEqual({ arr: ['1', '2', '3'] });
  });

  it('parses simple objects', () => {
    const args = parseArgsParam('obj.one:1;obj.two:2');
    expect(args).toStrictEqual({ obj: { one: '1', two: '2' } });
  });

  it('parses nested objects', () => {
    const args = parseArgsParam('obj.foo.one:1;obj.foo.two:2;obj.bar.one:1');
    expect(args).toStrictEqual({ obj: { foo: { one: '1', two: '2' }, bar: { one: '1' } } });
  });

  it('parses arrays in objects', () => {
    expect(parseArgsParam('obj.foo[]:1;obj.foo[]:2')).toStrictEqual({ obj: { foo: ['1', '2'] } });
    expect(parseArgsParam('obj.foo[0]:1;obj.foo[1]:2')).toStrictEqual({ obj: { foo: ['1', '2'] } });
    // eslint-disable-next-line no-sparse-arrays
    expect(parseArgsParam('obj.foo[1]:2')).toStrictEqual({ obj: { foo: [, '2'] } });
    expect(parseArgsParam('obj.foo:1;obj.foo:2')).toStrictEqual({ obj: { foo: ['1', '2'] } });
  });

  it('parses single object in array', () => {
    const args = parseArgsParam('arr[].one:1;arr[].two:2');
    expect(args).toStrictEqual({ arr: [{ one: '1', two: '2' }] });
  });

  it('parses multiple objects in array', () => {
    expect(parseArgsParam('arr[0].key:1;arr[1].key:2')).toStrictEqual({
      arr: [{ key: '1' }, { key: '2' }],
    });
    expect(parseArgsParam('arr[0][key]:1;arr[1][key]:2')).toStrictEqual({
      arr: [{ key: '1' }, { key: '2' }],
    });
  });

  it('parses nested object in array', () => {
    expect(parseArgsParam('arr[].foo.bar:val')).toStrictEqual({ arr: [{ foo: { bar: 'val' } }] });
    expect(parseArgsParam('arr[][foo][bar]:val')).toStrictEqual({ arr: [{ foo: { bar: 'val' } }] });
  });

  describe('key sanitization', () => {
    it("omits keys that aren't in the extended alphanumeric set", () => {
      expect(parseArgsParam('a`b:val')).toStrictEqual({});
      expect(parseArgsParam('a~b:val')).toStrictEqual({});
      expect(parseArgsParam('a!b:val')).toStrictEqual({});
      expect(parseArgsParam('a@b:val')).toStrictEqual({});
      expect(parseArgsParam('a#b:val')).toStrictEqual({});
      expect(parseArgsParam('a$b:val')).toStrictEqual({});
      expect(parseArgsParam('a%b:val')).toStrictEqual({});
      expect(parseArgsParam('a^b:val')).toStrictEqual({});
      expect(parseArgsParam('a&b:val')).toStrictEqual({});
      expect(parseArgsParam('a*b:val')).toStrictEqual({});
      expect(parseArgsParam('a(b:val')).toStrictEqual({});
      expect(parseArgsParam('a)b:val')).toStrictEqual({});
      expect(parseArgsParam('a=b:val')).toStrictEqual({});
      expect(parseArgsParam('"b":val')).toStrictEqual({});
      expect(parseArgsParam('a/b:val')).toStrictEqual({});
      expect(parseArgsParam('a\\b:val')).toStrictEqual({});
      expect(parseArgsParam('a|b:val')).toStrictEqual({});
      expect(parseArgsParam('a[b:val')).toStrictEqual({});
      expect(parseArgsParam('a]b:val')).toStrictEqual({});
      expect(parseArgsParam('a{b:val')).toStrictEqual({});
      expect(parseArgsParam('a}b:val')).toStrictEqual({});
      expect(parseArgsParam('a?b:val')).toStrictEqual({});
      expect(parseArgsParam('a<b:val')).toStrictEqual({});
      expect(parseArgsParam('a>b:val')).toStrictEqual({});
      expect(parseArgsParam('a,b:val')).toStrictEqual({});
    });

    it('allows keys that are in the extended alphanumeric set', () => {
      expect(parseArgsParam(' key :val')).toStrictEqual({ ' key ': 'val' });
      expect(parseArgsParam('+key+:val')).toStrictEqual({ ' key ': 'val' });
      expect(parseArgsParam('-key-:val')).toStrictEqual({ '-key-': 'val' });
      expect(parseArgsParam('_key_:val')).toStrictEqual({ _key_: 'val' });
      expect(parseArgsParam('KEY123:val')).toStrictEqual({ KEY123: 'val' });
      expect(parseArgsParam('1:val')).toStrictEqual({ '1': 'val' });
    });

    it('also applies to nested object keys', () => {
      expect(parseArgsParam('obj.a!b:val')).toStrictEqual({});
      expect(parseArgsParam('obj[a!b]:val')).toStrictEqual({});
      expect(parseArgsParam('arr[][a!b]:val')).toStrictEqual({});
      expect(parseArgsParam('arr[0][a!b]:val')).toStrictEqual({});
    });

    it('completely omits an arg when a (deeply) nested key is invalid', () => {
      expect(parseArgsParam('obj.foo.a!b:val;obj.foo.bar:val;obj.baz:val')).toStrictEqual({});
      expect(parseArgsParam('obj.foo[][a!b]:val;obj.foo.bar:val;obj.baz:val')).toStrictEqual({});
      expect(parseArgsParam('obj.foo.a!b:val;key:val')).toStrictEqual({ key: 'val' });
    });
  });

  describe('value sanitization', () => {
    it("omits values that aren't in the extended alphanumeric set", () => {
      expect(parseArgsParam('key:a`b')).toStrictEqual({});
      expect(parseArgsParam('key:a~b')).toStrictEqual({});
      expect(parseArgsParam('key:a!b')).toStrictEqual({});
      expect(parseArgsParam('key:a@b')).toStrictEqual({});
      expect(parseArgsParam('key:a#b')).toStrictEqual({});
      expect(parseArgsParam('key:a$b')).toStrictEqual({});
      expect(parseArgsParam('key:a%b')).toStrictEqual({});
      expect(parseArgsParam('key:a^b')).toStrictEqual({});
      expect(parseArgsParam('key:a&b')).toStrictEqual({});
      expect(parseArgsParam('key:a*b')).toStrictEqual({});
      expect(parseArgsParam('key:a(b')).toStrictEqual({});
      expect(parseArgsParam('key:a)b')).toStrictEqual({});
      expect(parseArgsParam('key:a=b')).toStrictEqual({});
      expect(parseArgsParam('key:a[b')).toStrictEqual({});
      expect(parseArgsParam('key:a]b')).toStrictEqual({});
      expect(parseArgsParam('key:a{b')).toStrictEqual({});
      expect(parseArgsParam('key:a}b')).toStrictEqual({});
      expect(parseArgsParam('key:a\\b')).toStrictEqual({});
      expect(parseArgsParam('key:a|b')).toStrictEqual({});
      expect(parseArgsParam("key:a'b")).toStrictEqual({});
      expect(parseArgsParam('key:a"b')).toStrictEqual({});
      expect(parseArgsParam('key:a,b')).toStrictEqual({});
      expect(parseArgsParam('key:a.b')).toStrictEqual({});
      expect(parseArgsParam('key:a<b')).toStrictEqual({});
      expect(parseArgsParam('key:a>b')).toStrictEqual({});
      expect(parseArgsParam('key:a/b')).toStrictEqual({});
      expect(parseArgsParam('key:a?b')).toStrictEqual({});
    });

    it('allows values that are in the extended alphanumeric set', () => {
      expect(parseArgsParam('key: val ')).toStrictEqual({ key: ' val ' });
      expect(parseArgsParam('key:+val+')).toStrictEqual({ key: ' val ' });
      expect(parseArgsParam('key:_val_')).toStrictEqual({ key: '_val_' });
      expect(parseArgsParam('key:-val-')).toStrictEqual({ key: '-val-' });
      expect(parseArgsParam('key:VAL123')).toStrictEqual({ key: 'VAL123' });
      expect(parseArgsParam('key:1')).toStrictEqual({ key: '1' });
    });

    it('also applies to nested object and array values', () => {
      expect(parseArgsParam('obj.key:a!b')).toStrictEqual({});
      expect(parseArgsParam('obj[key]:a!b')).toStrictEqual({});
      expect(parseArgsParam('arr[][key]:a!b')).toStrictEqual({});
      expect(parseArgsParam('arr[0][key]:a!b')).toStrictEqual({});
      expect(parseArgsParam('arr[]:a!b')).toStrictEqual({});
      expect(parseArgsParam('arr[0]:a!b')).toStrictEqual({});
    });

    it('completely omits an arg when a (deeply) nested value is invalid', () => {
      expect(parseArgsParam('obj.key:a!b;obj.foo:val;obj.bar.baz:val')).toStrictEqual({});
      expect(parseArgsParam('obj.arr[]:a!b;obj.foo:val;obj.bar.baz:val')).toStrictEqual({});
      expect(parseArgsParam('obj.arr[0]:val;obj.arr[1]:a!b;obj.foo:val')).toStrictEqual({});
      expect(parseArgsParam('obj.arr[][one]:a!b;obj.arr[][two]:val')).toStrictEqual({});
      expect(parseArgsParam('arr[]:val;arr[]:a!b;key:val')).toStrictEqual({ key: 'val' });
      expect(parseArgsParam('arr[0]:val;arr[1]:a!1;key:val')).toStrictEqual({ key: 'val' });
      expect(parseArgsParam('arr[0]:val;arr[2]:a!1;key:val')).toStrictEqual({ key: 'val' });
    });
  });
});
