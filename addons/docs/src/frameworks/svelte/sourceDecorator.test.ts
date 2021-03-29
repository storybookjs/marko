import { Args } from '@storybook/api';
import { generateSvelteSource } from './sourceDecorator';

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val) => typeof val === 'string',
});

function generateForArgs(args: Args, slotProperty: string = null) {
  return generateSvelteSource({ name: 'Component' }, args, {}, slotProperty);
}

describe('generateSvelteSource', () => {
  test('boolean true', () => {
    expect(generateForArgs({ bool: true })).toMatchInlineSnapshot(`<Component bool/>`);
  });
  test('boolean false', () => {
    expect(generateForArgs({ bool: false })).toMatchInlineSnapshot(`<Component bool={false}/>`);
  });
  test('null property', () => {
    expect(generateForArgs({ propnull: null })).toMatchInlineSnapshot(`<Component />`);
  });
  test('string property', () => {
    expect(generateForArgs({ str: 'mystr' })).toMatchInlineSnapshot(`<Component str="mystr"/>`);
  });
  test('number property', () => {
    expect(generateForArgs({ count: 42 })).toMatchInlineSnapshot(`<Component count={42}/>`);
  });
  test('object property', () => {
    expect(generateForArgs({ obj: { x: true } })).toMatchInlineSnapshot(
      `<Component obj={{"x":true}}/>`
    );
  });
  test('multiple properties', () => {
    expect(generateForArgs({ a: 1, b: 2 })).toMatchInlineSnapshot(`<Component a={1} b={2}/>`);
  });
  test('slot property', () => {
    expect(generateForArgs({ content: 'xyz', myProp: 'abc' }, 'content')).toMatchInlineSnapshot(`
      <Component myProp="abc">
          xyz
      </Component>
    `);
  });
  test('component is not set', () => {
    expect(generateSvelteSource(null, null, null, null)).toBeNull();
  });
});
