import React from 'react';
import { styled } from '@storybook/theming';

import { getBlockBackgroundStyle } from './BlockBackgroundStyles';

export interface PreviewProps {
  isColumn?: boolean;
  columns?: number;
}

const ChildrenContainer = styled.div<PreviewProps>(({ isColumn, columns }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: isColumn ? 'column' : 'row',
  marginTop: -20,

  '> *': {
    flex: columns ? `1 1 calc(100%/${columns} - 20px)` : `1 1 0%`,
    marginRight: 20,
    marginTop: 20,
  },
}));

const PreviewWrapper = styled.div<PreviewProps>(({ theme }) => ({
  ...getBlockBackgroundStyle(theme),
  margin: '25px 0 40px',
  padding: '30px 20px',
}));

const Preview: React.FunctionComponent<PreviewProps> = ({
  isColumn,
  columns,
  children,
  ...props
}) => (
  <PreviewWrapper {...props}>
    <ChildrenContainer {...props}>
      {Array.isArray(children) ? children.map(child => <div>{child}</div>) : <div>{children}</div>}
    </ChildrenContainer>
  </PreviewWrapper>
);

export { Preview };
