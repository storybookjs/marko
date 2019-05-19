import React from 'react';
import { styled } from '@storybook/theming';

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

const StyledSource = styled(Source)(({ theme }) => ({
  margin: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  border: 'none',
  paddingBottom: 10,
}));

const PreviewWrapper = styled.div<PreviewProps>(({ theme, withSource }) => ({
  ...getBlockBackgroundStyle(theme),
  padding: '30px 20px',
  position: 'relative',
  borderBottomLeftRadius: withSource && 0,
  borderBottomRightRadius: withSource && 0,
}));

const PreviewContainer = styled.div(({ theme }) => ({
  margin: '25px 0 40px',
}));

const Preview: React.FunctionComponent<PreviewProps> = ({
  isColumn,
  columns,
  children,
  withSource,
  isExpanded = false,
  ...props
}) => {
  const [expanded, setExpanded] = React.useState(isExpanded);
  const { source, actionItem } = expanded
    ? {
        source: <StyledSource {...withSource} dark />,
        actionItem: { title: 'Hide code', onClick: () => setExpanded(false) },
      }
    : {
        source: null,
        actionItem: { title: 'Show code', onClick: () => setExpanded(true) },
      };
  return (
    <PreviewContainer {...props}>
      <PreviewWrapper withSource={withSource}>
        <ChildrenContainer isColumn={isColumn} columns={columns}>
          {Array.isArray(children) ? (
            children.map((child, i) => <div key={i.toString()}>{child}</div>)
          ) : (
            <div>{children}</div>
          )}
        </ChildrenContainer>
        {withSource && <ActionBar actionItems={[actionItem]} />}
      </PreviewWrapper>
      {withSource && source}
    </PreviewContainer>
  );
};

export { Preview };
