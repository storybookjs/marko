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

import { styled } from '@storybook/theming';
import { StoriesHash, State, useStorybookApi, isRoot } from '@storybook/api';

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
  color: transparentize(0.5, theme.color.defaultText),
  margin: '0 20px',
}));
RootHeading.defaultProps = {
  className: 'sidebar-subheading',
};

const RefHead = styled.div(({ theme }) => ({
  padding: theme.layoutMargin,
  paddingLeft: theme.layoutMargin * 2,
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
    return <ListItem onClick={onClick} {...props} />;
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
    return <ListItem onClick={onClick} {...props} />;
  },
  Branch: Tree,
  List: styled.div({}),
};

export const Ref: FunctionComponent<RefType & RefProps> = ({
  stories,
  id: key,
  title = key,
  storyId,
  filter,
  isHidden = false,
}) => {
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
    <div>
      <ExpanderContext.Provider value={combo}>
        {!isMain ? <RefHead>{title}</RefHead> : null}
        {isLoading ? (
          <Loader size={isMain ? 'multiple' : 'single'} />
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
          </Fragment>
        )}
      </ExpanderContext.Provider>
    </div>
  );
};

type FilteredType = 'filtered' | 'unfiltered';

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
    return parents.reduce(
      (acc, item) => ({ ...acc, [item.id]: item }),
      dataset[storyId]
        ? {
            [storyId]: dataset[storyId],
          }
        : {}
    );
  }, [parents]);

  const filteredSet = useMemo(() => (filter ? toFiltered(dataset, filter) : dataset), [
    dataset,
    filter,
  ]);

  return useMemo(
    () => ({
      ...extra,
      ...filteredSet,
    }),
    [extra, filteredSet]
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

  const type: FilteredType = filter.length >= 2 ? 'filtered' : 'unfiltered';

  const parents = useMemo(() => getParents(storyId, dataset), [storyId, dataset]);

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
