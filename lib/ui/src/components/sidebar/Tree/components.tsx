import React, { FunctionComponent, ReactNode, SyntheticEvent } from 'react';
import { styled } from '@storybook/theming';

export const DefaultSection = styled.div();

export const DefaultList = styled.div();

export const A = styled.a();

export const DefaultFilter = styled(props => <input placeholder="search..." {...props} />)({
  width: '100%',
  background: 'transparent',
  border: '1px solid black',
});

export const prevent = (e: SyntheticEvent) => {
  e.preventDefault();
  return false;
};

export const DefaultMessage = styled.div({});

export const LeafStyle = styled.div<{ depth: number; isSelected: boolean }>(
  {
    minHeight: 24,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  ({ depth }) => ({
    paddingLeft: depth * 10,
  }),
  ({ isSelected }) => ({
    background: isSelected ? '#CFD8DC' : 'transparent',
  })
);

export const DefaultLeaf: FunctionComponent<{ name: ReactNode; depth: number } & Record<
  string,
  any
>> = ({ name, isSelected, depth, ...rest }) => (
  <LeafStyle isSelected={isSelected} depth={depth} {...rest}>
    {name}
  </LeafStyle>
);

export const DefaultHead: FunctionComponent<{
  name: ReactNode;
  depth: number;
  isExpanded?: boolean;
  isSelected?: boolean;
  isComponent?: boolean;
}> = ({ name, depth, isExpanded = false, isSelected = false, isComponent = false }) => (
  <LeafStyle isSelected={isSelected} depth={depth}>
    <span>
      {isExpanded ? '-' : '+'}
      {isComponent ? '!' : ''}
    </span>
    <span>{name}</span>
  </LeafStyle>
);

export const DefaultRootTitle = styled.h4({});

export const DefaultLink: FunctionComponent<{
  id: string;
  prefix: string;
  children: string[];
  onClick: Function;
}> = ({ id, prefix, children, ...rest }) => (
  <A href={`#!${prefix}${id}`} {...rest} onClick={e => prevent(e) || rest.onClick(e)}>
    {children}
  </A>
);
