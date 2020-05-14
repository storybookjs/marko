import React from 'react';
import { highlightObject } from '@storybook/addon-a11y';
import { themes, convert, styled } from '@storybook/theming';

import Button from '../../components/addon-a11y/Button';

const text = 'Testing the a11y highlight';

export default {
  title: 'Addons/A11y/Highlight',
  component: Button,
  parameters: {
    options: { selectedPanel: 'storybook/a11y/panel' },
  },
  decorators: [(storyFn) => <div style={{ padding: 10 }}>{storyFn()}</div>],
};

const PassesHighlight = styled.div(highlightObject(convert(themes.normal).color.positive));
const IncompleteHighlight = styled.div(highlightObject(convert(themes.normal).color.warning));
const ViolationsHighlight = styled.div(highlightObject(convert(themes.normal).color.negative));

export const Passes = () => <PassesHighlight>{text}</PassesHighlight>;
export const Incomplete = () => <IncompleteHighlight>{text}</IncompleteHighlight>;
export const Violations = () => <ViolationsHighlight>{text}</ViolationsHighlight>;
