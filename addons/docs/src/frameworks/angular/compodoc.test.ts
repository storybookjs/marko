import { extractType } from './compodoc';
import { Decorator } from './types';

const makeProperty = (compodocType?: string) => ({
  type: compodocType,
  name: 'dummy',
  decorators: [] as Decorator[],
  optional: true,
});

describe('extractType', () => {
  describe('with compodoc type', () => {
    it.each([
      ['string', { name: 'string' }],
      ['boolean', { name: 'boolean' }],
      ['number', { name: 'number' }],
      ['object', { name: 'object' }],
      ['foo', { name: 'object' }],
      [null, { name: 'void' }],
      [undefined, { name: 'void' }],
      ['T[]', { name: 'object' }],
      ['[]', { name: 'object' }],
      ['"primary" | "secondary"', { name: 'enum', value: ['primary', 'secondary'] }],
    ])('%s', (compodocType, expected) => {
      expect(extractType(makeProperty(compodocType), null)).toEqual(expected);
    });
  });

  describe('without compodoc type', () => {
    it.each([
      ['string', { name: 'string' }],
      [false, { name: 'boolean' }],
      [10, { name: 'number' }],
      [['abc'], { name: 'object' }],
      [{ foo: 1 }, { name: 'object' }],
      [undefined, { name: 'void' }],
    ])('%s', (defaultValue, expected) => {
      expect(extractType(makeProperty(null), defaultValue)).toEqual(expected);
    });
  });
});
