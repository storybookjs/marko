// Very simple stories to show what happens when one story's id is a prefix of another's
// Repro for https://github.com/storybookjs/storybook/issues/11571

export default {
  title: 'Core/Prefix',
};

const Template = () => 'Story';

export const prefixAndName = Template.bind({});
export const prefix = Template.bind({});
