import React from 'react';
import { Button } from '@storybook/react/demo';

// NOTE: commented out default since these stories are re-exported
// in the primary file './csf-docs-with-mdx-docs.stories.mdx'
//
// export default {
//   title: 'Addons/Docs/csf-with-mdx-docs',
//   component: Button,
// };

export const Basic = () => <Button>Basic</Button>;

export const WithArgs = (args) => <Button {...args} />;
WithArgs.args = { children: 'with args' };

export const WithTemplate = WithArgs.bind({});
WithTemplate.args = { children: 'with template' };
