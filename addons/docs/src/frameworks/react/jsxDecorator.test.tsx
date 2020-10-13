/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import React from 'react';
import range from 'lodash/range';
import addons, { StoryContext } from '@storybook/addons';
import { renderJsx, jsxDecorator } from './jsxDecorator';
import { SNIPPET_RENDERED } from '../../shared';

jest.mock('@storybook/addons');
const mockedAddons = addons as jest.Mocked<typeof addons>;

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
  it('undefined values', () => {
    expect(renderJsx(<div className={undefined}>hello</div>, {})).toMatchInlineSnapshot(`
      <div>
        hello
      </div>
    `);
  });
  it('null values', () => {
    expect(renderJsx(<div className={null}>hello</div>, {})).toMatchInlineSnapshot(`
      <div className={null}>
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

  it('forwardRef component', () => {
    const MyExoticComponent = React.forwardRef(function MyExoticComponent(props: any, _ref: any) {
      return <div>{props.children}</div>;
    });

    expect(renderJsx(<MyExoticComponent>I'm forwardRef!</MyExoticComponent>, {}))
      .toMatchInlineSnapshot(`
        <MyExoticComponent>
          I'm forwardRef!
        </MyExoticComponent>
      `);
  });

  it('memo component', () => {
    const MyMemoComponent = React.memo(function MyMemoComponent(props: any) {
      return <div>{props.children}</div>;
    });

    expect(renderJsx(<MyMemoComponent>I'm memo!</MyMemoComponent>, {})).toMatchInlineSnapshot(`
      <MyMemoComponent>
        I'm memo!
      </MyMemoComponent>
    `);
  });
});

// @ts-ignore
const makeContext = (name: string, parameters: any, args: any): StoryContext => ({
  id: `jsx-test--${name}`,
  kind: 'js-text',
  name,
  parameters,
  args,
});

describe('jsxDecorator', () => {
  let mockChannel: { on: jest.Mock; emit?: jest.Mock };
  beforeEach(() => {
    mockedAddons.getChannel.mockReset();

    mockChannel = { on: jest.fn(), emit: jest.fn() };
    mockedAddons.getChannel.mockReturnValue(mockChannel as any);
  });

  it('should render dynamically for args stories', () => {
    const storyFn = (args: any) => <div>args story</div>;
    const context = makeContext('args', { __isArgsStory: true }, {});
    jsxDecorator(storyFn, context);
    expect(mockChannel.emit).toHaveBeenCalledWith(
      SNIPPET_RENDERED,
      'jsx-test--args',
      '<div>\n  args story\n</div>'
    );
  });

  it('should skip dynamic rendering for no-args stories', () => {
    const storyFn = () => <div>classic story</div>;
    const context = makeContext('classic', {}, {});
    jsxDecorator(storyFn, context);
    expect(mockChannel.emit).not.toHaveBeenCalled();
  });

  // This is deprecated, but still test it
  it('allows the snippet output to be modified by onBeforeRender', () => {
    const storyFn = (args: any) => <div>args story</div>;
    const onBeforeRender = (dom: string) => `<p>${dom}</p>`;
    const jsx = { onBeforeRender };
    const context = makeContext('args', { __isArgsStory: true, jsx }, {});
    jsxDecorator(storyFn, context);
    expect(mockChannel.emit).toHaveBeenCalledWith(
      SNIPPET_RENDERED,
      'jsx-test--args',
      '<p><div>\n  args story\n</div></p>'
    );
  });

  it('allows the snippet output to be modified by transformSource', () => {
    const storyFn = (args: any) => <div>args story</div>;
    const transformSource = (dom: string) => `<p>${dom}</p>`;
    const jsx = { transformSource };
    const context = makeContext('args', { __isArgsStory: true, jsx }, {});
    jsxDecorator(storyFn, context);
    expect(mockChannel.emit).toHaveBeenCalledWith(
      SNIPPET_RENDERED,
      'jsx-test--args',
      '<p><div>\n  args story\n</div></p>'
    );
  });

  it('provides the story context to transformSource', () => {
    const storyFn = (args: any) => <div>args story</div>;
    const transformSource = jest.fn();
    const jsx = { transformSource };
    const context = makeContext('args', { __isArgsStory: true, jsx }, {});
    jsxDecorator(storyFn, context);
    expect(transformSource).toHaveBeenCalledWith('<div>\n  args story\n</div>', context);
  });
});
