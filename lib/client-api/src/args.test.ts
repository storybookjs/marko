import { once } from '@storybook/client-logger';
import { combineArgs, mapArgsToTypes, validateOptions } from './args';

const stringType = { name: 'string' };
const numberType = { name: 'number' };
const booleanType = { name: 'boolean' };
const enumType = { name: 'enum' };
const functionType = { name: 'function' };
const numArrayType = { name: 'array', value: numberType };
const boolObjectType = { name: 'object', value: { bool: booleanType } };

jest.mock('@storybook/client-logger');

enum ArgsMapTestEnumWithoutInitializer {
  EnumValue,
  EnumValue2,
}

enum ArgsMapTestEnumWithStringInitializer {
  EnumValue = 'EnumValue',
}

enum ArgsMapTestEnumWithNumericInitializer {
  EnumValue = 4,
}

describe('mapArgsToTypes', () => {
  it('maps strings', () => {
    expect(mapArgsToTypes({ a: 'str' }, { a: { type: stringType } })).toStrictEqual({ a: 'str' });
    expect(mapArgsToTypes({ a: 42 }, { a: { type: stringType } })).toStrictEqual({ a: '42' });
  });

  it('maps enums', () => {
    expect(
      mapArgsToTypes({ a: ArgsMapTestEnumWithoutInitializer.EnumValue }, { a: { type: enumType } })
    ).toEqual({ a: 0 });
    expect(
      mapArgsToTypes({ a: ArgsMapTestEnumWithoutInitializer.EnumValue2 }, { a: { type: enumType } })
    ).toEqual({ a: 1 });
    expect(
      mapArgsToTypes(
        { a: ArgsMapTestEnumWithStringInitializer.EnumValue },
        { a: { type: enumType } }
      )
    ).toEqual({ a: 'EnumValue' });
    expect(
      mapArgsToTypes(
        { a: ArgsMapTestEnumWithNumericInitializer.EnumValue },
        { a: { type: enumType } }
      )
    ).toEqual({ a: 4 });
  });

  it('maps numbers', () => {
    expect(mapArgsToTypes({ a: '42' }, { a: { type: numberType } })).toStrictEqual({ a: 42 });
    expect(mapArgsToTypes({ a: 'a' }, { a: { type: numberType } })).toStrictEqual({ a: NaN });
  });

  it('maps booleans', () => {
    expect(mapArgsToTypes({ a: 'true' }, { a: { type: booleanType } })).toStrictEqual({ a: true });
    expect(mapArgsToTypes({ a: 'false' }, { a: { type: booleanType } })).toStrictEqual({
      a: false,
    });
    expect(mapArgsToTypes({ a: 'yes' }, { a: { type: booleanType } })).toStrictEqual({ a: false });
  });

  it('maps sparse arrays', () => {
    // eslint-disable-next-line no-sparse-arrays
    expect(mapArgsToTypes({ a: [, '2', undefined] }, { a: { type: numArrayType } })).toStrictEqual({
      // eslint-disable-next-line no-sparse-arrays
      a: [, 2, undefined],
    });
  });

  it('omits functions', () => {
    expect(mapArgsToTypes({ a: 'something' }, { a: { type: functionType } })).toStrictEqual({});
  });

  it('omits unknown keys', () => {
    expect(mapArgsToTypes({ a: 'string' }, { b: { type: stringType } })).toStrictEqual({});
  });

  it('passes through unmodified if no type is specified', () => {
    expect(mapArgsToTypes({ a: { b: 1 } }, { a: { type: undefined } })).toStrictEqual({
      a: { b: 1 },
    });
  });

  it('deeply maps objects', () => {
    expect(
      mapArgsToTypes(
        {
          key: {
            arr: ['1', '2'],
            obj: { bool: 'true' },
          },
        },
        {
          key: {
            type: {
              name: 'object',
              value: {
                arr: numArrayType,
                obj: boolObjectType,
              },
            },
          },
        }
      )
    ).toStrictEqual({
      key: {
        arr: [1, 2],
        obj: { bool: true },
      },
    });
  });

  it('deeply maps arrays', () => {
    expect(
      mapArgsToTypes(
        {
          key: [
            {
              arr: ['1', '2'],
              obj: { bool: 'true' },
            },
          ],
        },
        {
          key: {
            type: {
              name: 'array',
              value: {
                name: 'object',
                value: {
                  arr: numArrayType,
                  obj: boolObjectType,
                },
              },
            },
          },
        }
      )
    ).toStrictEqual({
      key: [
        {
          arr: [1, 2],
          obj: { bool: true },
        },
      ],
    });
  });
});

describe('combineArgs', () => {
  it('merges args', () => {
    expect(combineArgs({ foo: 1 }, { bar: 2 })).toStrictEqual({ foo: 1, bar: 2 });
  });

  it('merges sparse arrays', () => {
    // eslint-disable-next-line no-sparse-arrays
    expect(combineArgs({ foo: [1, 2, 3] }, { foo: [, 4, undefined] })).toStrictEqual({
      foo: [1, 4],
    });
  });

  it('deeply merges args', () => {
    expect(combineArgs({ foo: { bar: [1, 2], baz: true } }, { foo: { bar: [3] } })).toStrictEqual({
      foo: { bar: [3, 2], baz: true },
    });
  });

  it('omits keys with undefined value', () => {
    expect(combineArgs({ foo: 1 }, { foo: undefined })).toStrictEqual({});
  });
});

describe('validateOptions', () => {
  it('omits arg and warns if value is not one of options', () => {
    expect(validateOptions({ a: 1 }, { a: { options: [2, 3] } })).toStrictEqual({});
    expect(once.warn).toHaveBeenCalledWith(
      "Received illegal value for 'a'. Supported options: 2, 3"
    );
  });

  it('includes arg if value is one of options', () => {
    expect(validateOptions({ a: 1 }, { a: { options: [1, 2] } })).toStrictEqual({ a: 1 });
  });

  it('includes arg if value is undefined', () => {
    expect(validateOptions({ a: undefined }, { a: { options: [1, 2] } })).toStrictEqual({
      a: undefined,
    });
  });

  it('includes arg if no options are specified', () => {
    expect(validateOptions({ a: 1 }, { a: {} })).toStrictEqual({ a: 1 });
  });

  it('ignores options and logs an error if options is not an array', () => {
    expect(validateOptions({ a: 1 }, { a: { options: { 2: 'two' } } })).toStrictEqual({ a: 1 });
    expect(once.error).toHaveBeenCalledWith(
      expect.stringContaining("Invalid argType: 'a.options' should be an array")
    );
  });

  it('logs an error if options contains non-primitive values', () => {
    expect(
      validateOptions({ a: { one: 1 } }, { a: { options: [{ one: 1 }, { two: 2 }] } })
    ).toStrictEqual({ a: { one: 1 } });
    expect(once.error).toHaveBeenCalledWith(
      expect.stringContaining("Invalid argType: 'a.options' should only contain primitives")
    );
    expect(once.warn).not.toHaveBeenCalled();
  });

  it('supports arrays', () => {
    expect(validateOptions({ a: [1, 2] }, { a: { options: [1, 2, 3] } })).toStrictEqual({
      a: [1, 2],
    });
    expect(validateOptions({ a: [1, 2, 4] }, { a: { options: [2, 3] } })).toStrictEqual({});
    expect(once.warn).toHaveBeenCalledWith(
      "Received illegal value for 'a[0]'. Supported options: 2, 3"
    );
  });
});
