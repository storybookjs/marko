import React from 'react';

export default {
  title: 'Addons/Controls-Sort',
  argTypes: {
    x: { type: { required: true } },
    y: { type: { required: true }, table: { category: 'foo' } },
    z: {},
    a: { type: { required: true } },
    b: { table: { category: 'foo' } },
    c: {},
  },
  args: {
    x: 'x',
    y: 'y',
    z: 'z',
    a: 'a',
    b: 'b',
    c: 'c',
  },
  parameters: { chromatic: { disable: true } },
};

const Template = (args: any) => <div>{args && <pre>{JSON.stringify(args, null, 2)}</pre>}</div>;

export const None = Template.bind({});
None.parameters = { controls: { sort: 'none' } };

export const Alpha = Template.bind({});
Alpha.parameters = { controls: { sort: 'alpha' } };

export const RequiredFirst = Template.bind({});
RequiredFirst.parameters = { controls: { sort: 'requiredFirst' } };
