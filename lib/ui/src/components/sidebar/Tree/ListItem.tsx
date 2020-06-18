import { DOCS_MODE } from 'global';
import React, { ComponentProps, FunctionComponent, useMemo } from 'react';
import { transparentize } from 'polished';
import { styled } from '@storybook/theming';
import { Icons } from '@storybook/components';

export type ExpanderProps = ComponentProps<'span'> & {
  isExpanded: boolean;
  depth: number;
};

export const Expander = styled.span<ExpanderProps>(
  ({ theme, depth }) => ({
    position: 'absolute',
    display: 'block',
    left: 0,
    top: 9,
    width: 0,
    height: 0,
    borderTop: '3.5px solid transparent',
    borderBottom: '3.5px solid transparent',
    borderLeft: `3.5px solid ${theme.base === 'dark' ? theme.color.lighter : theme.color.medium}`,
    transition: 'transform .1s ease-out',
    marginLeft: depth * 15 + 9,
  }),
  ({ isExpanded = false }) => {
    return isExpanded
      ? {
          transform: 'rotateZ(90deg)',
        }
      : {};
  }
);

export type IconProps = ComponentProps<typeof Icons> & {
  className: string; // FIXME: Icons should extended its typing from the native <svg>
  isSelected?: boolean;
};

const Icon = styled(Icons)<IconProps>(
  {
    position: 'relative',
    flex: 'none',
    width: 10,
    height: 10,
    marginRight: 6,
  },
  ({ icon }) => {
    if (icon === 'folder') {
      return { color: '#774dd7' };
    }
    if (icon === 'component') {
      return { color: '#1ea7fd' };
    }
    if (icon === 'bookmarkhollow' || (DOCS_MODE && icon === 'document')) {
      return { color: '#37d5d3' };
    }
    if (icon === 'document') {
      return { color: '#ffae00' };
    }

    return {};
  },
  ({ isSelected = false, theme }) =>
    isSelected ? { color: 'inherit', fontWeight: theme.typography.weight.bold } : {}
);

export const Item = styled.a<{
  depth?: number;
  isSelected?: boolean;
}>(
  ({ theme }) => ({
    position: 'relative',
    textDecoration: 'none',
    fontSize: theme.typography.size.s2 - 1,
    lineHeight: '16px',
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: theme.layoutMargin * 2,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    background: 'transparent',
  }),
  ({ depth }) => ({
    paddingLeft: depth * 15 + 19,
  }),
  ({ theme, isSelected }) =>
    isSelected
      ? {
          cursor: 'default',
          background: theme.color.secondary,
          color: theme.color.lightest,
          fontWeight: theme.typography.weight.bold,
        }
      : {
          cursor: 'pointer',
          color:
            theme.base === 'light'
              ? theme.color.defaultText
              : transparentize(0.2, theme.color.defaultText),
          '&:hover, &:focus': {
            color: theme.color.defaultText,
            background: theme.background.hoverable,
            outline: 'none',
          },
        }
);

export type ListItemProps = ComponentProps<typeof Item> & {
  childIds?: string[] | null;
  id: string;
  isComponent: boolean;
  isExpanded?: boolean;
  isLeaf: boolean;
  isSelected?: boolean;
  name: string;
  kind: string;
  refId?: string;
  depth: number;
  parameters: Record<string, any>;
};

export const ListItem: FunctionComponent<ListItemProps> = ({
  name,
  id,
  kind,
  refId,
  isComponent = false,
  isLeaf = false,
  isExpanded = false,
  isSelected = false,
  className,
  depth,
  ...props
}) => {
  let iconName: ComponentProps<typeof Icons>['icon'];
  if (isLeaf && isComponent) {
    iconName = 'document';
  } else if (isLeaf) {
    iconName = 'bookmarkhollow';
  } else if (isComponent) {
    iconName = 'component';
  } else {
    iconName = 'folder';
  }

  const classes = useMemo(
    () => [className, 'sidebar-item', isSelected ? 'selected' : null].filter(Boolean).join(' '),
    [className, isSelected]
  );

  return (
    <Item isSelected={isSelected} depth={depth} {...props} className={classes} id={id}>
      {!isLeaf ? (
        <Expander className="sidebar-expander" depth={depth} isExpanded={isExpanded} />
      ) : null}
      <Icon className="sidebar-svg-icon" icon={iconName} isSelected={isSelected} />
      <span>{name}</span>
    </Item>
  );
};
