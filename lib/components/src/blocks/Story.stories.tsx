import React, { useState } from 'react';
import { styled } from '@storybook/theming';
import { Story, StoryError } from './Story';
import { Button } from '../Button/Button';

export default {
  title: 'Docs/Story',
  component: Story,
};

const buttonFn = () => <Button secondary>Inline story</Button>;

const buttonHookFn = () => {
  const [count, setCount] = useState(0);
  return (
    <Button secondary onClick={() => setCount(count + 1)}>
      {`count: ${count}`}
    </Button>
  );
};

export const Inline = () => <Story inline storyFn={buttonFn} title="hello button" />;

export const Error = () => <Story error={StoryError.NO_STORY} />;

export const ReactHook = () => <Story inline storyFn={buttonHookFn} title="hello button" />;

const FixedLayoutExample = styled.div(({ theme }) => ({
  '&, header, aside, main, footer': {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  header: {
    height: '3rem',
    background: theme.background.positive,
  },
  'aside, main': {
    top: '3rem',
  },
  aside: {
    width: '10rem',
    background: theme.background.warning,
  },
  main: {
    left: '10rem',
    background: theme.background.negative,
  },
  footer: {
    top: 'auto',
    height: '3rem',
    background: theme.background.critical,
  },
}));

export const CustomHeight = () => (
  <Story
    inline
    storyFn={() => (
      <FixedLayoutExample>
        <header />
        <aside />
        <main />
        <footer />
      </FixedLayoutExample>
    )}
    id="custom-height"
    height="15rem"
    title="Define a custom story height for fixed position context for example"
  />
);
