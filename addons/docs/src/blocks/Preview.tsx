import React from 'react';
import { Preview as PurePreview, PreviewProps } from '@storybook/components';
import { Story } from './Story';

export const Preview: React.FunctionComponent<PreviewProps> = ({ children, ...props }) => (
  <PurePreview {...props}>{children || <Story />}</PurePreview>
);
