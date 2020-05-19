import { argsStory } from '@storybook/react';
import { DocgenButton } from '../../components/DocgenButton';

export default {
  title: 'Addons/Docs/ArgsStory',
  component: DocgenButton,
  parameters: { controls: { expanded: false }, chromatic: { disable: true } },
};

export const One = argsStory({ label: 'One' });
export const Two = argsStory({ label: 'Two' });
