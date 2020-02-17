import { combineParameters } from './parameters';

describe('client-api.parameters', () => {
  it('merges different sets of parameters by key, preferencing last', () => {
    expect(
      combineParameters([
        { a: 'b', c: 'd' },
        { e: 'f', a: 'g' },
      ])
    ).toEqual({
      a: 'g',
      c: 'd',
      e: 'f',
    });
  });

  it('merges sub-keys if they are specified', () => {
    expect(
      combineParameters([{ ns: { a: 'b', c: 'd' } }, { ns: { e: 'f', a: 'g' } }], ['ns'])
    ).toEqual({
      ns: {
        a: 'g',
        c: 'd',
        e: 'f',
      },
    });
  });

  it('combines array values inside sub-keys', () => {
    expect(
      combineParameters([{ ns: { array: [1, 2, 3] } }, { ns: { array: [3, 4, 5] } }], ['ns'])
    ).toEqual({
      ns: {
        array: [1, 2, 3, 4, 5],
      },
    });
  });
});
