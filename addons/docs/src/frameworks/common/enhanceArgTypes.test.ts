import { ArgType } from '@storybook/api';
import { enhanceArgTypes } from './enhanceArgTypes';
import { extractArgTypes } from '../angular';

expect.addSnapshotSerializer({
  print: (val: any) => JSON.stringify(val, null, 2),
  test: (val) => true,
});

const enhance = ({
  argType,
  arg,
  extractedArgType,
}: {
  argType?: ArgType;
  arg?: any;
  extractedArgType?: ArgType;
}) => {
  const context = {
    id: 'foo--bar',
    kind: 'foo',
    name: 'bar',
    parameters: {
      component: 'dummy',
      docs: {
        extractArgTypes: () => ({ input: extractedArgType }),
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
          argType: { type: { name: 'number' } },
        })
      ).toMatchInlineSnapshot(`
        {
          "name": "input",
          "type": {
            "name": "number"
          }
        }
      `);
    });
  });
  describe('args input', () => {
    it('number', () => {
      expect(enhance({ arg: 5 })).toMatchInlineSnapshot(`
        {
          "name": "input",
          "type": {
            "name": "number"
          }
        }
      `);
    });
  });

  describe('extraction', () => {
    it('number', () => {
      expect(enhance({ extractedArgType: { name: 'input', type: { name: 'number' } } }))
        .toMatchInlineSnapshot(`
        {
          "name": "input",
          "type": {
            "name": "number"
          }
        }
      `);
    });
  });

  describe('controls input', () => {
    it('range', () => {
      expect(enhance({ argType: { controls: { type: 'range', min: 0, max: 100 } } }))
        .toMatchInlineSnapshot(`
        {
          "name": "input",
          "controls": {
            "type": "range",
            "min": 0,
            "max": 100
          }
        }
      `);
    });
    it('options', () => {
      expect(
        enhance({
          argType: { controls: { type: 'options', options: [1, 2], controlType: 'radio' } },
        })
      ).toMatchInlineSnapshot(`
        {
          "name": "input",
          "controls": {
            "type": "options",
            "options": [
              1,
              2
            ],
            "controlType": "radio"
          }
        }
      `);
    });
  });

  describe('mixed input', () => {
    it('mixed input', () => {
      expect(
        enhance({
          argType: { defaultValue: 5, control: { type: 'range', step: 50 } },
          arg: 3,
          extractedArgType: { name: 'input' },
        })
      ).toMatchInlineSnapshot(`
        {
          "name": "input",
          "defaultValue": 5,
          "control": {
            "type": "range",
            "step": 50
          }
        }
      `);
    });
  });
});
