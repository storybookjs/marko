import React, { ComponentProps } from 'react';
import { Meta, Story } from '@storybook/react';
import TsButton from '../../components/TsButton';

export default {
  title: 'Other/Demo/TsButton',
  component: TsButton,
  decorators: [
    (StoryFn) => (
      <>
        <StoryFn />
      </>
    ),
  ],
} as Meta;

const Template: Story = (args) => <TsButton {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  type: 'default',
  children: 'basic',
};

type ButtonProps = ComponentProps<typeof TsButton>;
const TypedTemplate: Story<ButtonProps> = (args) => <TsButton {...args} />;

export const Typed = TypedTemplate.bind({});
Typed.args = {
  type: 'action',
  children: 'typed',
  foo: 'bar', // should be a type error?
};
