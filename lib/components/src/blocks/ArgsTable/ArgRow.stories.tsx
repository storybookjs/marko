import React from 'react';
import { action } from '@storybook/addon-actions';
import { ArgRow } from './ArgRow';
import { TableWrapper } from './ArgsTable';
import { ResetWrapper } from '../../typography/DocumentFormatting';

export default {
  component: ArgRow,
  title: 'Docs/ArgRow',
  decorators: [
    (getStory) => (
      <ResetWrapper>
        <TableWrapper>
          <tbody>{getStory()}</tbody>
        </TableWrapper>
      </ResetWrapper>
    ),
  ],
};

const Story = (args) => <ArgRow {...args} />;

const baseArgs = {
  updateArgs: action('updateArgs'),
};

export const String = Story.bind({});
String.args = {
  ...baseArgs,
  row: {
    name: 'someString',
    description: 'someString description',
    type: { required: true },
    control: { type: 'text' },
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'fixme' },
    },
  },
};

export const LongName = Story.bind({});
LongName.args = {
  ...baseArgs,
  row: {
    ...String.args.row,
    name: 'reallyLongStringThatTakesUpSpace',
  },
};

export const LongDesc = Story.bind({});
LongDesc.args = {
  ...baseArgs,
  row: {
    ...String.args.row,
    description: 'really long description that takes up a lot of space. sometimes this happens.',
  },
};

export const Boolean = Story.bind({});
Boolean.args = {
  ...baseArgs,
  row: {
    name: 'someBoolean',
    description: 'someBoolean description',
    type: { required: true },
    control: { type: 'boolean' },
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'fixme' },
    },
  },
};

export const Color = Story.bind({});
Color.args = {
  ...baseArgs,
  row: {
    name: 'someColor',
    type: { name: 'string' },
    description: 'someColor description',
    defaultValue: '#ff0',
    control: { type: 'color' },
  },
};

export const Date = Story.bind({});
Date.args = {
  ...baseArgs,
  row: {
    name: 'someDate',
    type: { name: 'string' },
    description: 'someDate description',
    control: { type: 'date' },
  },
};

export const Number = Story.bind({});
Number.args = {
  ...baseArgs,
  row: {
    name: 'someNumber',
    description: 'someNumber description',
    type: { required: false },
    table: {
      type: { summary: 'number' },
      defaultValue: { summary: '0' },
    },
    control: { type: 'number' },
  },
};

export const Range = Story.bind({});
Range.args = {
  ...baseArgs,
  row: {
    ...Number.args.row,
    control: { type: 'range' },
  },
};

export const Radio = Story.bind({});
Radio.args = {
  ...baseArgs,
  row: {
    name: 'someEnum',
    description: 'someEnum description',
    control: { type: 'radio', options: ['a', 'b', 'c'] },
  },
};

export const InlineRadio = Story.bind({});
InlineRadio.args = {
  ...baseArgs,
  row: {
    ...Radio.args.row,
    control: { ...Radio.args.row.control, type: 'inline-radio' },
  },
};

export const Check = Story.bind({});
Check.args = {
  ...baseArgs,
  row: {
    ...Radio.args.row,
    control: { ...Radio.args.row.control, type: 'check' },
  },
};

export const InlineCheck = Story.bind({});
InlineCheck.args = {
  ...baseArgs,
  row: {
    ...Radio.args.row,
    control: { ...Radio.args.row.control, type: 'inline-check' },
  },
};

export const Select = Story.bind({});
Select.args = {
  ...baseArgs,
  row: {
    ...Radio.args.row,
    control: { ...Radio.args.row.control, type: 'select' },
  },
};

export const MultiSelect = Story.bind({});
MultiSelect.args = {
  ...baseArgs,
  row: {
    ...Radio.args.row,
    control: { ...Radio.args.row.control, type: 'multi-select' },
  },
};

export const ObjectOf = Story.bind({});
ObjectOf.args = {
  ...baseArgs,
  row: {
    name: 'someObject',
    description: 'A simple `objectOf` propType.',
    table: {
      type: { summary: 'objectOf(number)' },
      defaultValue: { summary: '{ key: 1 }' },
    },
    control: { type: 'object' },
  },
};

export const ArrayOf = Story.bind({});
ArrayOf.args = {
  ...baseArgs,
  row: {
    name: 'someArray',
    description: 'array of a certain type',
    table: {
      type: { summary: 'number[]' },
      defaultValue: { summary: '[1, 2, 3]' },
    },
    control: { type: 'array' },
  },
};

export const ComplexObject = Story.bind({});
ComplexObject.args = {
  ...baseArgs,
  row: {
    name: 'someComplex',
    description: 'A very complex `objectOf` propType.',
    table: {
      type: {
        summary: 'object',
        detail: `[{
      id: number,
      func: func,
      arr: [{ index: number }]
    }]`,
      },
      defaultValue: {
        summary: 'object',
        detail: `[{
      id: 1,
      func: () => {},
      arr: [{ index: 1 }]
    }]`,
      },
    },
    control: { type: 'object' },
  },
};

export const Func = Story.bind({});
Func.args = {
  ...baseArgs,
  row: {
    name: 'concat',
    description: 'concat 2 string values.',
    type: { required: true },
    table: {
      type: { summary: '(a: string, b: string) => string' },
      defaultValue: { summary: 'func', detail: '(a, b) => { return a + b; }' },
      jsDocTags: {
        params: [
          { name: 'a', description: 'The first string' },
          { name: 'b', description: 'The second string' },
        ],
        returns: { description: 'The concatenation of both strings' },
      },
    },
    control: false,
  },
};

export const Markdown = Story.bind({});
Markdown.args = {
  ...baseArgs,
  row: {
    name: 'someString',
    description:
      'A `prop` can *support* __markdown__ syntax. This was ship in ~~5.2~~ 5.3. [Find more info in the storybook docs.](https://storybook.js.org/)',
    table: {
      type: { summary: 'string' },
    },
    control: { type: 'text' },
  },
};

export const StringCompact = Story.bind({});
StringCompact.args = {
  ...String.args,
  compact: true,
};

export const StringNoControls = Story.bind({});
StringNoControls.args = {
  row: String.args.row,
};

export const StringNoControlsCompact = Story.bind({});
StringNoControlsCompact.args = {
  row: String.args.row,
  compact: true,
};
