import { combineParameters } from './parameters';

describe('client-api.parameters', () => {
  it('merges different sets of parameters by key, preferencing last', () => {
    expect(combineParameters({ a: 'b', c: 'd' }, { e: 'f', a: 'g' })).toEqual({
      a: 'g',
      c: 'd',
      e: 'f',
    });
  });

  it('merges sub-keys', () => {
    expect(combineParameters({ ns: { a: 'b', c: 'd' } }, { ns: { e: 'f', a: 'g' } })).toEqual({
      ns: {
        a: 'g',
        c: 'd',
        e: 'f',
      },
    });
  });

  // XXX: yes it does-- what should it do?
  // it('does not merges sub-sub-keys', () => {
  //   expect(
  //     combineParameters({ ns: { nns: { a: 'b', c: 'd' } } }, { ns: { nns: { e: 'f', a: 'g' } } })
  //   ).toEqual({
  //     ns: {
  //       nns: {
  //         e: 'f',
  //         a: 'g',
  //       },
  //     },
  //   });
  // });

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
