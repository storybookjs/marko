import React, {
  FunctionComponent,
  useMemo,
  useState,
  useCallback,
  Fragment,
  ComponentPropsWithoutRef,
} from 'react';

import { styled } from '@storybook/theming';
import { ScrollArea, Placeholder } from '@storybook/components';
import { StoriesHash, State, useStorybookApi } from '@storybook/api';

import { opacify } from 'polished';
import SidebarHeading, { SidebarHeadingProps } from './SidebarHeading';
import SidebarItem from './SidebarItem';

import Search from './SidebarSearch';
import { filteredLength, toFiltered, getMains } from './treeview/utils';

import { Tree } from './treeview/treeview';
import SidebarSubheading from './SidebarSubheading';

const Heading = styled(SidebarHeading)<SidebarHeadingProps>({
  padding: '20px 20px 12px',
});

const Container = styled.nav({
  position: 'absolute',
  zIndex: 1,
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
});

const CustomScrollArea = styled(ScrollArea)({
  '.simplebar-track.simplebar-vertical': {
    right: 4,
  },
});

export interface SidebarProps {
  stories: StoriesHash;
  refs: State['refs'];
  menu: any[];
  storyId?: string;
  menuHighlighted?: boolean;
  isLoading?: boolean;
}

type Refs = State['refs'];
type RefType = Refs[keyof Refs];
type BooleanSet = Record<string, boolean>;
type Item = StoriesHash[keyof StoriesHash];
type DataSet = Record<string, Item>;

const Subheading = styled(SidebarSubheading)({
  margin: '0 20px',
});

Subheading.defaultProps = {
  className: 'sidebar-subheading',
};

const RefHead = styled.div(({ theme }) => ({
  padding: theme.layoutMargin,
  paddingLeft: theme.layoutMargin * 2,
}));

const Hr = styled.hr(({ theme }) => ({
  border: '0 none',
  height: 0,
  borderTop: `1px solid ${opacify(0.1, theme.appBorderColor)}`,
}));

const Loader: FunctionComponent<{ size: 'single' | 'multiple' }> = ({ size }) => {
  return size === 'multiple' ? (
    <Fragment>
      <SidebarItem isLoading />
      <SidebarItem isLoading />
      <SidebarItem depth={1} isLoading />
      <SidebarItem depth={1} isLoading />
      <SidebarItem depth={2} isLoading />
      <SidebarItem depth={3} isLoading />
      <SidebarItem depth={3} isLoading />
      <SidebarItem depth={3} isLoading />
      <SidebarItem depth={1} isLoading />
      <SidebarItem depth={1} isLoading />
      <SidebarItem depth={1} isLoading />
      <SidebarItem depth={2} isLoading />
      <SidebarItem depth={2} isLoading />
      <SidebarItem depth={2} isLoading />
      <SidebarItem depth={3} isLoading />
      <SidebarItem isLoading />
      <SidebarItem isLoading />
    </Fragment>
  ) : (
    <SidebarItem isLoading />
  );
};

const Section = styled.section(({ theme }) => ({
  '& + &': {
    marginTop: theme.layoutMargin * 2,
  },
  '&:last-of-type': {
    marginBottom: theme.layoutMargin * 4,
  },
}));

const Ref: FunctionComponent<RefType & {
  storyId: string;
  filter: string;
  isHidden: boolean;
}> = ({ stories, id: key, title = key, storyId, filter, isHidden = false }) => {
  const { dataSet, expandedSet, length, others, roots, setExpanded, selectedSet } = useDataset(
    stories,
    filter,
    storyId
  );

  const Components = useMemo(() => {
    return {
      Head: (props: ComponentPropsWithoutRef<typeof SidebarItem>) => {
        const api = useStorybookApi();
        const { id, isComponent, childIds } = props;
        const onClick = useCallback(
          e => {
            e.preventDefault();
            if (!expandedSet[id] && isComponent && childIds && childIds.length) {
              api.selectStory(childIds[0]);
            }
            setExpanded(s => ({ ...s, [id]: !s[id] }));
          },
          [id, expandedSet[id]]
        );

        return <SidebarItem onClick={onClick} {...props} />;
      },
      Leaf: (props: ComponentPropsWithoutRef<typeof SidebarItem>) => {
        const api = useStorybookApi();
        const { id } = props;
        const onClick = useCallback(
          e => {
            e.preventDefault();
            api.selectStory(id);
            setExpanded(s => ({ ...s, [id]: !s[id] }));
          },
          [id]
        );

        return <SidebarItem onClick={onClick} {...props} />;
      },
      Branch: Tree,
      List: styled.div({}),
    };
  }, [selectedSet]);

  const isLoading = !length;

  if (isHidden) {
    return null;
  }

  return (
    <div>
      <RefHead>{title}</RefHead>
      {isLoading ? (
        <Loader size={key === 'storybook_internal' ? 'multiple' : 'single'} />
      ) : (
        <Fragment>
          {others.length ? (
            <Section key="other">
              {others.map(({ id }) => (
                <Tree
                  key={id}
                  depth={0}
                  dataset={dataSet}
                  selected={selectedSet}
                  expanded={expandedSet}
                  root={id}
                  {...Components}
                />
              ))}
            </Section>
          ) : null}

          {roots.map(({ id, name, children }) => (
            <Section key={id}>
              <Subheading>{name}</Subheading>
              {children.map(child => (
                <Tree
                  key={child}
                  depth={0}
                  dataset={dataSet}
                  selected={selectedSet}
                  expanded={expandedSet}
                  root={child}
                  {...Components}
                />
              ))}
            </Section>
          ))}
        </Fragment>
      )}
    </div>
  );
};

const useDataset = (dataset: DataSet = {}, filter: string, storyId: string) => {
  const initial = useMemo(() => {
    return Object.keys(dataset).reduce(
      (acc, k) => ({
        filtered: { ...acc.filtered, [k]: true },
        unfiltered: { ...acc.unfiltered, [k]: false },
      }),
      { filtered: {} as BooleanSet, unfiltered: {} as BooleanSet }
    );
  }, [dataset]);

  const type: 'filtered' | 'unfiltered' = filter.length >= 2 ? 'filtered' : 'unfiltered';

  const expandedSets = {
    filtered: useState(initial.filtered),
    unfiltered: useState(initial.unfiltered),
  };

  const selectedSet = useMemo(() => {
    return Object.keys(dataset).reduce(
      (acc, k) => Object.assign(acc, { [k]: k === storyId }),
      {} as BooleanSet
    );
  }, [dataset, storyId]);

  const [state, setState] = expandedSets[type];

  const filteredSet = useMemo(() => (type === 'filtered' ? toFiltered(dataset, filter) : dataset), [
    dataset,
    filter,
  ]);

  const length = useMemo(() => Object.keys(filteredSet).length, [filteredSet]);

  const { roots, others } = useMemo(
    () =>
      getMains(filteredSet).reduce(
        (acc, item) => {
          const { isRoot } = item;
          return isRoot
            ? { ...acc, roots: [...acc.roots, item] }
            : { ...acc, others: [...acc.others, item] };
        },
        { roots: [] as Item[], others: [] as Item[] }
      ),
    [filteredSet]
  );

  return {
    roots,
    others,
    length,
    dataSet: filteredSet,
    selectedSet,
    expandedSet: state,
    setExpanded: setState,
  };
};

const useFilterState = (initial: string) => {
  const [state, setState] = useState(initial);
  const changeFilter = useCallback((value: string) => {
    setState(value);
  }, []);

  const value = state.length > 1 ? state : '';

  return [value, changeFilter] as [typeof state, typeof changeFilter];
};

const useSearchResults = (refsList: [string, RefType][], filter: string) => {
  const refsLengths = useMemo(
    () => refsList.map(([k, i]) => filteredLength(i.stories || {}, filter), 0),
    [refsList, filter]
  );
  const refsTotal = useMemo(() => refsLengths.reduce((acc, i) => acc + i, 0), [refsList, filter]);

  return { total: refsTotal || 0, list: refsLengths };
};

const useCombination = (stories: StoriesHash, refs: Refs) => {
  const merged = useMemo<Refs>(
    () => ({
      storybook_internal: { stories, title: null, id: 'storybook_internal', url: 'iframe.html' },
      ...refs,
    }),
    [refs, stories]
  );

  return useMemo(() => Object.entries(merged), [merged]);
};

const Sidebar: FunctionComponent<SidebarProps> = ({
  storyId,
  stories,
  menu,
  menuHighlighted = false,
  refs = {},
}) => {
  const [filter, setFilter] = useFilterState('');
  const combined = useCombination(stories, refs);
  const { total, list } = useSearchResults(combined, filter);

  const resultLess = total === 0 && filter;

  return (
    <Container className="container sidebar-container">
      <CustomScrollArea vertical>
        <Heading className="sidebar-header" menuHighlighted={menuHighlighted} menu={menu} />

        <Search key="filter" onChange={setFilter} />

        {resultLess ? <Placeholder>This filter resulted in 0 results</Placeholder> : null}

        <Fragment>
          {combined.map(([k, v], index) => {
            const prev = list[index - 1];

            return (
              <Fragment key={k}>
                {index === 0 || (filter && prev === 0) ? null : <Hr />}
                <Ref {...v} storyId={storyId} filter={filter} isHidden={filter && !list[index]} />
              </Fragment>
            );
          })}
        </Fragment>
      </CustomScrollArea>
    </Container>
  );
};

export default Sidebar;
