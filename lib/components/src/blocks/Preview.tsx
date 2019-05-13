import React from 'react';
import { styled } from '@storybook/theming';

export interface PreviewProps {
  column: boolean;
}

const PreviewWrapper = styled.div<PreviewProps>(({ column }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: column ? 'column' : 'row',
}));

const Preview: React.FunctionComponent<PreviewProps> = ({ column, children }) => (
  <PreviewWrapper column={column}>{children}</PreviewWrapper>
);

export { Preview };
