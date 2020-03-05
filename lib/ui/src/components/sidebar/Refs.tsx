import React, {
  FunctionComponent,
  useMemo,
  useState,
  useCallback,
  Fragment,
  ComponentPropsWithoutRef,
  useEffect,
  useContext,
} from 'react';
import { transparentize } from 'polished';

import { StoriesHash, State, useStorybookApi, isRoot } from '@storybook/api';
import { Icons, WithTooltip, TooltipMessage, Spaced } from '@storybook/components';
import { Location } from '@storybook/router';
import { styled } from '@storybook/theming';

import { ListItem } from './Tree/ListItem';
import { toFiltered, getMains, getParents } from './Tree/utils';
import { Tree } from './Tree/Tree';
import { Section } from './Section';
import { Loader } from './Loader';

type Refs = State['refs'];
type RefType = Refs[keyof Refs];
type BooleanSet = Record<string, boolean>;
type Item = StoriesHash[keyof StoriesHash];
type DataSet = Record<string, Item>;

type FilteredType = 'filtered' | 'unfiltered';

interface RefProps {
  storyId: string;
  filter: string;
  isHidden: boolean;
}

const RootHeading = styled.div(({ theme }) => ({
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  fontWeight: theme.typography.weight.black,
  fontSize: theme.typography.size.s1 - 1,
  lineHeight: '24px',
  color: theme.color.mediumdark,
  margin: '0 20px',
}));
RootHeading.defaultProps = {
  className: 'sidebar-subheading',
};

const RefHead = styled.div(({ theme }) => ({
  fontWeight: theme.typography.weight.bold,
  fontSize: theme.typography.size.s2,
  color: theme.color.darkest,
  textTransform: 'capitalize',

  lineHeight: '16px',
  paddingTop: 4,
  paddingBottom: 4,

  paddingLeft: theme.layoutMargin * 2,
  paddingRight: theme.layoutMargin * 2,
}));

const ExpanderContext = React.createContext<{
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  expandedSet: BooleanSet;
}>({
  setExpanded: () => {},
  expandedSet: {},
});

const Components = {
  Head: (props: ComponentPropsWithoutRef<typeof ListItem>) => {
    const api = useStorybookApi();
    const { setExpanded, expandedSet } = useContext(ExpanderContext);
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
    return <ListItem onClick={onClick} {...props} href={`#${id}`} />;
  },
  Leaf: (props: ComponentPropsWithoutRef<typeof ListItem>) => {
    const api = useStorybookApi();
    const { setExpanded } = useContext(ExpanderContext);
    const { id } = props;
    const onClick = useCallback(
      e => {
        e.preventDefault();
        api.selectStory(id);
        setExpanded(s => ({ ...s, [id]: !s[id] }));
      },
      [id]
    );

    return (
      <Location>
        {({ viewMode }) => (
          <ListItem onClick={onClick} {...props} href={`?path=/${viewMode}/${id}`} />
        )}
      </Location>
    );
  },
  Branch: Tree,
  List: styled.div({}),
};

const ProblemPlacement = styled.div(
  {
    position: 'absolute',
    top: 0,
    right: 20,
    width: 14,
    height: 14,
  },
  ({ theme }) => ({
    color: theme.color.mediumdark,
  })
);

const getTitle = (ref: RefType) => {
  switch (true) {
    case !!ref.error: {
      return 'An error occurred';
    }
    case !!ref.startInjected: {
      return 'Not optimized';
    }
    default: {
      return ref.title;
    }
  }
};
const getDescription = (ref: RefType) => {
  switch (true) {
    case !!ref.error: {
      return <pre>{ref.error.toString()}</pre>;
    }
    case !!ref.startInjected: {
      return (
        <div>
          This storybook was auto-injected,
          <br />
          This is bad for performance, please refer to the docs on how to resolve this.
        </div>
      );
    }
    default: {
      return (
        <Fragment>
          <p>This storybook was lazy-loaded.</p>
          {ref.versions ? (
            <div>
              You can switch to other versions:
              <ul>
                {Object.entries(ref.versions).map(([k, v]) => (
                  <li key={k}>{v}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </Fragment>
      );
    }
  }
};
const getIcon = (ref: RefType) => {
  switch (true) {
    case !!ref.error: {
      return <Icons width="14" height="14" icon="alert" />;
    }
    default: {
      return <Icons width="14" height="14" icon="globe" />;
    }
  }
};
const getLinks = (ref: RefType) => {
  switch (true) {
    case !!ref.error: {
      return [
        { title: 'documentation', href: 'https://storybook.js.org/docs' },
        { title: 'referenced storybook', href: ref.url },
      ];
    }
    case !!ref.startInjected: {
      return [
        { title: 'documentation', href: 'https://storybook.js.org/docs' },
        { title: 'referenced storybook', href: ref.url },
      ];
    }
    default: {
      return [{ title: 'referenced storybook', href: ref.url }];
    }
  }
};

const RefIndicator: FunctionComponent<RefType> = ref => {
  const title = getTitle(ref);
  const description = getDescription(ref);
  const icon = getIcon(ref);
  const links = getLinks(ref);

  return (
    <ProblemPlacement>
      <WithTooltip
        placement="top"
        trigger="click"
        tooltip={<TooltipMessage title={title} desc={description} links={links} />}
      >
        {icon}
      </WithTooltip>
    </ProblemPlacement>
  );
};

const Wrapper = styled.div({
  position: 'relative',
  marginLeft: -20,
  marginRight: -20,
});

export const Ref: FunctionComponent<RefType & RefProps> = ref => {
  const { stories, id: key, title = key, storyId, filter, isHidden = false } = ref;
  const { dataSet, expandedSet, length, others, roots, setExpanded, selectedSet } = useDataset(
    stories,
    filter,
    storyId
  );

  const combo = useMemo(() => ({ setExpanded, expandedSet }), [setExpanded, expandedSet]);

  const isLoading = !length;

  if (isHidden) {
    return null;
  }

  const isMain = key === 'storybook_internal';

  return (
    <Wrapper title={title}>
      {!isMain ? <RefIndicator {...ref} /> : null}
      <ExpanderContext.Provider value={combo}>
        {!isMain ? <RefHead>{title}</RefHead> : null}
        <Fragment>
          {isLoading ? (
            <Loader size={isMain ? 'multiple' : 'single'} />
          ) : (
            <Spaced row={1.5}>
              {others.length ? (
                <Section title="categorized" key="categorized">
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
                <Section title={name} key={id}>
                  <RootHeading>{name}</RootHeading>
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
            </Spaced>
          )}
        </Fragment>
      </ExpanderContext.Provider>
    </Wrapper>
  );
};

const useExpanded = (
  type: FilteredType,
  parents: Item[],
  initialFiltered: BooleanSet,
  initialUnfiltered: BooleanSet
) => {
  const expandedSets = {
    filtered: useState(initialFiltered),
    unfiltered: useState(initialUnfiltered),
  };

  const [state, setState] = expandedSets[type];

  useEffect(() => {
    expandedSets.filtered[1](initialFiltered);
    expandedSets.unfiltered[1](initialUnfiltered);
  }, [initialFiltered, initialUnfiltered]);

  const set = useMemo(
    () => ({
      ...state,
      ...parents.reduce((acc, item) => ({ ...acc, [item.id]: true }), {} as BooleanSet),
    }),
    [state, parents]
  );

  return { expandedSet: set, setExpanded: setState };
};

const useSelected = (dataset: DataSet, storyId: string) => {
  return useMemo(() => {
    return Object.keys(dataset).reduce(
      (acc, k) => Object.assign(acc, { [k]: k === storyId }),
      {} as BooleanSet
    );
  }, [dataset, storyId]);
};

const useFiltered = (dataset: DataSet, filter: string, parents: Item[], storyId: string) => {
  const extra = useMemo(() => {
    if (dataset[storyId]) {
      return parents.reduce(
        (acc, item) => ({ ...acc, [item.id]: item }),
        dataset[storyId]
          ? {
              [storyId]: dataset[storyId],
            }
          : {}
      );
    }
    return {};
  }, [parents]);

  const filteredSet = useMemo(() => (filter ? toFiltered(dataset, filter) : dataset), [
    dataset,
    filter,
  ]);

  return useMemo(
    () =>
      filteredSet[storyId]
        ? filteredSet
        : {
            ...extra,
            ...filteredSet,
          },
    [extra, filteredSet]
  );
};

const useDataset = (dataset: DataSet = {}, filter: string, storyId: string) => {
  const emptyInitial = useMemo(
    () => ({
      filtered: {},
      unfiltered: {},
    }),
    []
  );
  const datasetKeys = Object.keys(dataset);
  const initial = useMemo(() => {
    if (datasetKeys.length) {
      return Object.keys(dataset).reduce(
        (acc, k) => ({
          filtered: { ...acc.filtered, [k]: true },
          unfiltered: { ...acc.unfiltered, [k]: false },
        }),
        { filtered: {} as BooleanSet, unfiltered: {} as BooleanSet }
      );
    }
    return emptyInitial;
  }, [dataset]);

  const type: FilteredType = filter.length >= 2 ? 'filtered' : 'unfiltered';

  const parents = useMemo(() => getParents(storyId, dataset), [dataset[storyId]]);

  const { expandedSet, setExpanded } = useExpanded(
    type,
    parents,
    initial.filtered,
    initial.unfiltered
  );

  const selectedSet = useSelected(dataset, storyId);
  const filteredSet = useFiltered(dataset, filter, parents, storyId);

  const length = useMemo(() => Object.keys(filteredSet).length, [filteredSet]);
  const topLevel = useMemo(
    () =>
      Object.values(filteredSet).filter(
        i => (i.depth === 0 && !isRoot(i)) || (!isRoot(i) && isRoot(filteredSet[i.parent]))
      ),
    [filteredSet]
  );

  useEffect(() => {
    if (type === 'filtered') {
      if (topLevel.length < 18) {
        setExpanded(initial.filtered);
      } else {
        setExpanded(initial.unfiltered);
      }
    }
  }, [filter]);

  const { roots, others } = useMemo(
    () =>
      getMains(filteredSet).reduce(
        (acc, item) => {
          return isRoot(item)
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
    expandedSet,
    setExpanded,
  };
};
