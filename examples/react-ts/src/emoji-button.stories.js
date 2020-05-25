import React from 'react';
import { argsStory } from '@storybook/react';
import { EmojiButton } from './emoji-button';

export default { component: EmojiButton, title: 'Examples / Emoji Button' };

export const WithArgs = argsStory({ label: 'With args' });
export const Basic = () => <EmojiButton label="Click me" />;
