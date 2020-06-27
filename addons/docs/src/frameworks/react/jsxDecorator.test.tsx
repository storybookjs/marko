/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import React from 'react';
import range from 'lodash/range';
import { renderJsx } from './jsxDecorator';

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val) => typeof val === 'string',
});

describe('renderJsx', () => {
  it('basic', () => {
    expect(renderJsx(<div>hello</div>, {})).toMatchInlineSnapshot(`
      <div>
        hello
      </div>
    `);
  });
  it('functions', () => {
    // eslint-disable-next-line no-console
    const onClick = () => console.log('onClick');
    expect(renderJsx(<div onClick={onClick}>hello</div>, {})).toMatchInlineSnapshot(`
      <div onClick={() => {}}>
        hello
      </div>
    `);
  });
  it('large objects', () => {
    const obj: Record<string, string> = {};
    range(20).forEach((i) => {
      obj[`key_${i}`] = `val_${i}`;
    });
    expect(renderJsx(<div data-val={obj} />, {})).toMatchInlineSnapshot(`
      <div
        data-val={{
          key_0: 'val_0',
          key_1: 'val_1',
          key_10: 'val_10',
          key_11: 'val_11',
          key_12: 'val_12',
          key_13: 'val_13',
          key_14: 'val_14',
          key_15: 'val_15',
          key_16: 'val_16',
          key_17: 'val_17',
          key_18: 'val_18',
          key_19: 'val_19',
          key_2: 'val_2',
          key_3: 'val_3',
          key_4: 'val_4',
          key_5: 'val_5',
          key_6: 'val_6',
          key_7: 'val_7',
          key_8: 'val_8',
          key_9: 'val_9'
        }}
       />
    `);
  });

  it('long arrays', () => {
    const arr = range(20).map((i) => `item ${i}`);
    expect(renderJsx(<div data-val={arr} />, {})).toMatchInlineSnapshot(`
      <div
        data-val={[
          'item 0',
          'item 1',
          'item 2',
          'item 3',
          'item 4',
          'item 5',
          'item 6',
          'item 7',
          'item 8',
          'item 9',
          'item 10',
          'item 11',
          'item 12',
          'item 13',
          'item 14',
          'item 15',
          'item 16',
          'item 17',
          'item 18',
          'item 19'
        ]}
       />
    `);
  });
});
