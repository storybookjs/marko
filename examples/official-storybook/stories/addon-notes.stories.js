import React from 'react';
import { storiesOf } from '@storybook/react';

// eslint-disable-next-line import/named
import { withNotes, WithNotes, withMarkdownNotes } from '@storybook/addon-notes';
import { action } from '@storybook/addon-actions';
import BaseButton from '../components/BaseButton';
import markdownNotes from './notes/notes.md';

const baseStory = () => (
  <BaseButton label="Button with notes - check the notes panel for details" />
);

const markdownTable = `
| Column1 | Column2 | Column3 |
|---------|---------|---------|
| Row1.1  | Row1.2  | Row1.3  |
| Row2.1  | Row2.2  | Row2.3  |
| Row3.1  | Row3.2  | Row3.3  |
| Row4.1  | Row4.2  | Row4.3  |
`;

storiesOf('Addons|Notes', module)
  .add(
    'withNotes',
    withNotes(
      'This is the notes for a button. This is helpful for adding details about a story in a separate panel.'
    )(baseStory)
  )
  .add('withNotes rendering imported markdown', withNotes(markdownNotes)(baseStory))
  .add(
    'withNotes rendering inline, github-flavored markdown',
    withMarkdownNotes(`
# Documentation

This is inline github-flavored markdown!

## Example Usage
~~~js
storiesOf('Addons|Notes', module)
  .add(
    'withNotes rendering imported markdown',
    withNotes(markdownNotes)(() => (
      <BaseButton label="Button with notes - check the notes panel for details" />
    ))
  )
~~~
    `)(baseStory)
  )
  .add('with a markdown table', withMarkdownNotes(markdownTable)(baseStory))
  .add('using deprecated API', () => (
    <WithNotes notes="Hello">
      <BaseButton onClick={action('clicked')} label="😀 😎 👍 💯" />
    </WithNotes>
  ));
