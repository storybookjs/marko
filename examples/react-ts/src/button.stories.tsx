import React from 'react';
import { argsStory } from '@storybook/react';
import { Button } from './button';

export default { component: Button, title: 'Examples / Button' };

export const WithArgs = argsStory({ label: 'With args' });
export const Basic = () => <Button label="Click me" />;
