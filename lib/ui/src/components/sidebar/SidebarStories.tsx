import React, { Fragment, FunctionComponent, memo } from 'react';

import { styled } from '@storybook/theming';
import { Placeholder, Link as StyledLink } from '@storybook/components';
import { StoriesHash } from '@storybook/api';
import { Location, Link as RouterLink } from '@storybook/router';
import { TreeState } from './treeview/treeview';

import SidebarItem from './SidebarItem';
import SidebarSubheading from './SidebarSubheading';

const Subheading = styled(SidebarSubheading)({
  margin: '0 20px',
});

Subheading.defaultProps = {
  className: 'sidebar-subheading',
};

const Section = styled.section(({ theme }) => ({
  '& + &': {
    marginTop: theme.layoutMargin * 2,
  },
  '&:last-of-type': {
    marginBottom: theme.layoutMargin * 4,
  },
}));

const List = styled.div();
List.displayName = 'List';

const plain = {
  color: 'inherit',
  display: 'block',
  textDecoration: 'none',
  userSelect: 'none',
};
// @ts-ignore
const PlainRouterLink = styled(RouterLink)(plain);
// @ts-ignore
const PlainLink = styled.a(plain);

const Wrapper = styled.div({});

export const viewMode = (
  currentViewMode: string | undefined,
  isDocsOnly: boolean,
  parameters: { viewMode?: string } = {}
) => {
  const { viewMode: paramViewMode } = parameters;
  switch (true) {
    case typeof paramViewMode === 'string':
      return paramViewMode;
    case isDocsOnly:
      return 'docs';
    case currentViewMode === 'settings' || !currentViewMode:
      return 'story';
    default:
      return currentViewMode;
  }
};

const targetId = (childIds?: string[]) =>
  childIds && childIds.find((childId: string) => /.*--.*/.exec(childId));

export const Link: FunctionComponent<{
  id: string;
  name: string;
  isLeaf: boolean;
  prefix: string;
  onKeyUp: Function;
  onClick: Function;
  childIds: string[] | null;
  isExpanded: boolean;
  isComponent: boolean;
  parameters: Record<string, any>;
}> = ({
  id,
  prefix,
  name,
  children,
  isLeaf,
  isComponent,
  onClick,
  onKeyUp,
  childIds = null,
  isExpanded = false,
  parameters,
}) => {
  return isLeaf || (isComponent && !isExpanded) ? (
    <Location>
      {({ viewMode: currentViewMode }) => (
        <PlainRouterLink
          title={name}
          id={prefix + id}
          to={`/${viewMode(currentViewMode, isLeaf && isComponent, parameters)}/${targetId(
            childIds
          ) || id}`}
          onKeyUp={onKeyUp}
          onClick={onClick}
        >
          {children}
        </PlainRouterLink>
      )}
    </Location>
  ) : (
    <PlainLink title={name} id={prefix + id} onKeyUp={onKeyUp} onClick={onClick}>
      {children}
    </PlainLink>
  );
};
Link.displayName = 'Link';

export interface StoriesProps {
  loading: boolean;
  stories: StoriesHash;
  storyId?: undefined | string;
  className?: undefined | string;
  filter: string;
}

const SidebarStories: FunctionComponent<StoriesProps> = memo(
  ({ stories, storyId, loading, className, filter = '', ...rest }) => {
    const list = Object.entries(stories);

    if (loading) {
      return (
        <Wrapper className={className}>
          <SidebarItem loading />
          <SidebarItem loading />
          <SidebarItem depth={1} loading />
          <SidebarItem depth={1} loading />
          <SidebarItem depth={2} loading />
          <SidebarItem depth={3} loading />
          <SidebarItem depth={3} loading />
          <SidebarItem depth={3} loading />
          <SidebarItem depth={1} loading />
          <SidebarItem depth={1} loading />
          <SidebarItem depth={1} loading />
          <SidebarItem depth={2} loading />
          <SidebarItem depth={2} loading />
          <SidebarItem depth={2} loading />
          <SidebarItem depth={3} loading />
          <SidebarItem loading />
          <SidebarItem loading />
        </Wrapper>
      );
    }

    if (list.length < 1) {
      return (
        <Wrapper className={className}>
          <Placeholder key="empty">
            <Fragment key="title">No stories found</Fragment>
            <Fragment>
              Learn how to&nbsp;
              <StyledLink href="https://storybook.js.org/basics/writing-stories/" target="_blank">
                write stories
              </StyledLink>
            </Fragment>
          </Placeholder>
        </Wrapper>
      );
    }
    return (
      <TreeState
        className={className}
        key="treestate"
        dataset={stories}
        prefix="explorer"
        selectedId={storyId}
        filter={filter}
        List={List}
        Head={SidebarItem}
        Link={Link}
        Leaf={SidebarItem}
        Title={Subheading}
        Section={Section}
        Message={Placeholder}
        {...rest}
      />
    );
  }
);

export default SidebarStories;
