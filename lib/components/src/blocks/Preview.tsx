import React from 'react';
import { styled } from '@storybook/theming';

import { string } from 'prop-types';
import { getBlockBackgroundStyle } from './BlockBackgroundStyles';
import { Source, SourceProps } from './Source';
import { ActionBar } from '../ActionBar/ActionBar';

export interface PreviewProps {
  isColumn?: boolean;
  columns?: number;
  withSource?: SourceProps;
  isExpanded?: boolean;
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

interface SourceExpanderProps {
  withSource?: SourceProps;
  isExpanded?: boolean;
}
const SourceExpander: React.FunctionComponent<SourceExpanderProps> = ({
  withSource,
  isExpanded = false,
}) => {
  const [expanded, setExpanded] = React.useState(isExpanded);
  const { source, actionItem } = expanded
    ? {
        source: <Source {...withSource} />,
        actionItem: { title: 'hide code', onClick: () => setExpanded(false) },
      }
    : {
        source: null,
        actionItem: { title: 'show code', onClick: () => setExpanded(true) },
      };
  return (
    <>
      {source}
      <ActionBar actionItems={[actionItem]} />
    </>
  );
};

const Preview: React.FunctionComponent<PreviewProps> = ({
  isColumn,
  columns,
  children,
  withSource,
  isExpanded,
  ...props
}) => (
  <PreviewWrapper {...props}>
    <ChildrenContainer {...props}>
      {Array.isArray(children) ? (
        children.map((child, i) => <div key={i.toString()}>{child}</div>)
      ) : (
        <div>{children}</div>
      )}
    </ChildrenContainer>
    {withSource && <SourceExpander withSource={withSource} isExpanded={isExpanded} />}
  </PreviewWrapper>
);

export { Preview };
