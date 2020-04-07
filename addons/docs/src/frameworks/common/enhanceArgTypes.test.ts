import yaml from 'yaml';
import { ArgType } from '@storybook/api';
import { enhanceArgTypes } from './enhanceArgTypes';

expect.addSnapshotSerializer({
  print: (val: any) => yaml.stringify(val).trim(),
  test: (val) => true,
});

const enhance = (argType: ArgType, arg?: any, extraction?: ArgType) => {
  const context = {
    id: 'foo--bar',
    kind: 'foo',
    name: 'bar',
    parameters: {
      component: 'dummy',
      docs: {
        extractArgTypes: () => ({ input: extraction }),
      },
      argTypes: {
        input: argType,
      },
    },
    args: {
      input: arg,
    },
    globalArgs: {},
  };
  const result = enhanceArgTypes(context);
  return result?.argTypes?.input;
};

describe('enhanceArgTypes', () => {
  describe('argTypes input', () => {
    it('number', () => {
      expect(
        enhance({
          type: { name: 'number' },
        })
      ).toMatchInlineSnapshot(`
        name: input
        type:
          name: number
      `);
    });
  });
  describe('args input', () => {
    it('number', () => {
      expect(enhance({}, 5)).toMatchInlineSnapshot(`name: input`);
    });
  });

  describe('extraction', () => {
    it('number', () => {
      expect(enhance({}, undefined, { name: 'input', type: { name: 'number' } }))
        .toMatchInlineSnapshot(`
        name: input
        type:
          name: number
      `);
    });
  });

  describe('controls input', () => {
    it('range', () => {
      expect(enhance({ controls: { type: 'range', min: 0, max: 100 } })).toMatchInlineSnapshot(`
        name: input
        controls:
          type: range
          min: 0
          max: 100
      `);
    });
    it('options', () => {
      expect(enhance({ controls: { type: 'options', options: [1, 2, 3], controlType: 'radio' } }))
        .toMatchInlineSnapshot(`
        name: input
        controls:
          type: options
          options:
            - 1
            - 2
            - 3
          controlType: radio
      `);
    });
  });

  describe('mixed input', () => {
    it('mixed input', () => {
      expect(
        enhance({ defaultValue: 5, control: { type: 'range', step: 50 } }, 3, { name: 'input' })
      ).toMatchInlineSnapshot(`
        name: input
        defaultValue: 5
        control:
          type: range
          step: 50
      `);
    });
  });
});
