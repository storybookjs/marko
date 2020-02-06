import { document } from 'global';
import React, {
  PureComponent,
  Fragment,
  ComponentType,
  FunctionComponent,
  SyntheticEvent,
} from 'react';
import memoize from 'memoizerific';
import addons from '@storybook/addons';
import { STORIES_COLLAPSE_ALL, STORIES_EXPAND_ALL } from '@storybook/core-events';
import debounce from 'lodash/debounce';

import {
  createId,
  keyEventToAction,
  getParent,
  getParents,
  getPrevious,
  getMains,
  getNext,
  toFiltered,
  Dataset,
  ExpandedSet,
  SelectedSet,
  Item,
} from './utils';

import {
  DefaultSection,
  DefaultList,
  DefaultLink,
  DefaultLeaf,
  DefaultHead,
  DefaultRootTitle,
  DefaultFilter,
  DefaultMessage,
} from './components';

const createHandler = memoize(10000)((item, cb) => (...args: any[]) => cb(...args, item));

const linked = (
  C: ComponentType,
  {
    onClick,
    onKeyUp,
    prefix = '',
    Link: L,
  }: { onClick: Function; onKeyUp: Function; Link: ComponentType; prefix: string }
) => {
  const Linked = React.memo(p => (
    <L
      prefix={prefix}
      {...p}
      // @ts-ignore
      onKeyUp={createHandler(p, onKeyUp)}
      onClick={createHandler(p, onClick)}
    >
      <C {...p} />
    </L>
  ));
  Linked.displayName = `Linked${C.displayName}`;

  return Linked;
};

const getLink = memoize(1)((Link: ComponentType<any>) => Link || DefaultLink);

const getHead = memoize(1)(
  (
    Head: ComponentType<any>,
    Link: ComponentType<any>,
    prefix: string,
    events: Record<string, any>
  ) =>
    linked(Head || DefaultHead, {
      onClick: events.onClick,
      onKeyUp: events.onKeyUp,
      prefix,
      Link: getLink(Link),
    })
);

const getLeaf = memoize(1)(
  (
    Leaf: ComponentType<any>,
    Link: ComponentType<any>,
    prefix: string,
    events: Record<string, any>
  ) =>
    linked(Leaf || DefaultLeaf, {
      onClick: events.onClick,
      onKeyUp: events.onKeyUp,
      prefix,
      Link: getLink(Link),
    })
);

const getFilter = memoize(1)((Filter: ComponentType<any>) => Filter || DefaultFilter);
const getTitle = memoize(1)((Title: ComponentType<any>) => Title || DefaultRootTitle);
const getContainer = memoize(1)((Section: ComponentType<any>) => Section || DefaultSection);
const getMessage = memoize(1)((Message: ComponentType<any>) => Message || DefaultMessage);

const branchOrLeaf = (
  {
    Branch,
    Leaf,
    Head,
    List,
  }: {
    Branch: ComponentType<any>;
    Leaf: ComponentType<any>;
    Head: ComponentType<any>;
    List: ComponentType<any>;
  },
  {
    root,
    dataset,
    expanded,
    selected,
    depth,
  }: { root: string; dataset: Dataset; expanded: ExpandedSet; selected: SelectedSet; depth: number }
) => {
  const node = dataset[root];
  return node.children ? (
    <Branch
      key={node.id}
      {...{
        Branch,
        Leaf,
        Head,
        List,
        dataset,
        root,
        depth,
        expanded,
        selected,
      }}
    />
  ) : (
    <Leaf key={node.id} {...node} depth={depth} isSelected={selected[node.id]} />
  );
};

const Tree: FunctionComponent<{
  root: string;
  depth: number;
  dataset: Dataset;
  expanded: ExpandedSet;
  selected: SelectedSet;
  events?: any;
  Branch: ComponentType<any>;
  Link?: ComponentType<any>;
  List?: ComponentType<any>;
  Leaf?: ComponentType<any>;
  Head?: ComponentType<any>;
}> = props => {
  const {
    root,
    depth,
    dataset,
    expanded,
    selected,
    Branch = Tree,
    List = DefaultList,
    Leaf = DefaultLeaf,
    Head = DefaultHead,
  } = props;

  const item = dataset[root];

  if (!item) {
    return null;
  }

  const { children, ...node } = item;

  const mapNode = (i: string) =>
    branchOrLeaf(
      { Branch, Leaf, Head, List },
      { dataset, selected, expanded, root: i, depth: depth + 1 }
    );

  switch (true) {
    case !!(children && children.length && node.name): {
      return (
        <Fragment>
          <Head
            {...node}
            depth={depth}
            isExpanded={expanded[node.id]}
            isSelected={selected[node.id]}
            childIds={children}
          />
          {children && expanded[node.id] ? <List>{children.map(mapNode)}</List> : null}
        </Fragment>
      );
    }
    case !!(children && children.length): {
      return <List>{children.map(mapNode)}</List>;
    }
    case node.isLeaf: {
      return <Leaf key={node.id} {...node} depth={depth} isSelected={selected[node.id]} />;
    }
    default: {
      return null;
    }
  }
};

const calculateTreeState = memoize(50)(
  (
    { dataset, selectedId }: { dataset: Dataset; selectedId: string },
    {
      lastSelectedId,
      unfilteredExpanded,
    }: { lastSelectedId: string; unfilteredExpanded: ExpandedSet }
  ) => {
    if (selectedId === lastSelectedId) {
      return null;
    }

    // If a new selection is made, we need to ensure it is part of the expanded set
    const selectedAncestorIds = selectedId ? getParents(selectedId, dataset).map(i => i.id) : [];
    const newExpanded = Object.keys(dataset).reduce((acc, key) => {
      acc[key] = selectedAncestorIds.includes(key) || unfilteredExpanded[key];
      return acc;
    }, {} as SelectedSet);

    return {
      lastSelectedId: selectedId,
      unfilteredExpanded: newExpanded,
    };
  }
);

const getExpanded = ({
  unfilteredExpanded,
  filteredExpanded,
  filter,
}: {
  unfilteredExpanded: ExpandedSet;
  filteredExpanded: ExpandedSet;
  filter: string;
}) => (filter ? filteredExpanded : unfilteredExpanded);

const getFilteredDataset = memoize(
  50
)(({ dataset, filter }: { dataset: Dataset; filter: string }) =>
  filter ? toFiltered(dataset, filter) : dataset
);

// Update the set of expansions we are currently working with
const updateExpanded = (fn: (expandedset: ExpandedSet) => ExpandedSet) => ({
  unfilteredExpanded,
  filteredExpanded,
  filter,
  ...rest
}: TreeStateState): TreeStateState => {
  if (filter) {
    return {
      ...rest,
      unfilteredExpanded,
      filter,
      filteredExpanded: fn(filteredExpanded),
    };
  }
  return {
    ...rest,
    filteredExpanded,
    filter,
    unfilteredExpanded: fn(unfilteredExpanded),
  };
};

const getPropsForTree = memoize(50)(
  ({ dataset, selectedId }: { dataset: Dataset; selectedId: string }) => {
    const selected = Object.keys(dataset).reduce(
      (acc, k) => Object.assign(acc, { [k]: k === selectedId }),
      {} as SelectedSet
    );

    const { roots, others } = getMains(dataset).reduce(
      (acc, item) => {
        const { isRoot } = item;
        return isRoot
          ? { ...acc, roots: [...acc.roots, item] }
          : { ...acc, others: [...acc.others, item] };
      },
      { roots: [] as Item[], others: [] as Item[] }
    );

    return { selected, roots, others };
  }
);

interface TreeStateState {
  unfilteredExpanded: SelectedSet;
  filteredExpanded: ExpandedSet;
  filter: string | null;
  lastSelectedId: string | null;
}

interface TreeStateProps {
  dataset: Dataset;
  selectedId: string;
  prefix: string;
  filter?: string;
  event?: any;
  Filter: ComponentType<any>;
  List: ComponentType<any>;
  Title: ComponentType<any>;
  Link: ComponentType<any>;
  Leaf: ComponentType<any>;
  Head: ComponentType<any>;
  Section: ComponentType<any>;
  Message: ComponentType<any>;
}

class TreeState extends PureComponent<TreeStateProps, TreeStateState> {
  state = {
    // We maintain two sets of expanded nodes, so we remember which were expanded if we clear the filter
    unfilteredExpanded: {},
    filteredExpanded: {},
    filter: null,
    lastSelectedId: null,
  } as TreeStateState;

  static getDerivedStateFromProps(props: TreeStateProps, state: TreeStateState) {
    return calculateTreeState(props, state);
  }

  static defaultProps: Partial<TreeStateProps> = {
    selectedId: null,
    Filter: undefined,
    List: undefined,
    Title: undefined,
    Link: undefined,
    Leaf: undefined,
    Head: undefined,
    Section: undefined,
    Message: undefined,
  };

  events = {
    onClick: (e: SyntheticEvent, item: Item) => {
      this.setState(
        updateExpanded(expanded => ({
          ...expanded,
          [item.id]: !expanded[item.id],
        }))
      );
    },
    onFilter: debounce(inputFilter => {
      const { dataset } = this.props;
      const filter = inputFilter.length >= 2 ? inputFilter : '';
      const filteredDataset = getFilteredDataset({ dataset, filter });

      // Whenever we change the filter, we reset the "filtered" expanded set back to all matching stories
      this.setState({
        filter,
        filteredExpanded:
          !!filter &&
          Object.keys(filteredDataset).reduce((acc, k) => Object.assign(acc, { [k]: true }), {}),
      });
    }, 100),
    onKeyUp: (e: KeyboardEvent, item: Item) => {
      const { prefix, dataset } = this.props;
      const { filter } = this.state;
      const filteredDataset = getFilteredDataset({ dataset, filter });
      const expanded = getExpanded(this.state);

      const action = keyEventToAction(e);
      if (action) {
        e.preventDefault();
      }

      if (action === 'RIGHT') {
        const next = getNext({ id: item.id, dataset: filteredDataset, expanded });
        if (!filteredDataset[item.id].children || expanded[item.id]) {
          if (next) {
            try {
              document.getElementById(createId(next.id, prefix)).focus();
            } catch (err) {
              // debugger;
            }
          }
        }

        this.setState(updateExpanded(currExpanded => ({ ...currExpanded, [item.id]: true })));
      }
      if (action === 'LEFT') {
        const prev = getPrevious({ id: item.id, dataset: filteredDataset, expanded });

        if (!filteredDataset[item.id].children || !expanded[item.id]) {
          const parent = getParent(item.id, filteredDataset);
          if (parent && parent.children) {
            try {
              document.getElementById(createId(parent.id, prefix)).focus();
            } catch (err) {
              // debugger;
            }

            if (prev) {
              try {
                document.getElementById(createId(prev.id, prefix)).focus();
              } catch (err) {
                // debugger;
              }
            }
          }
        }

        this.setState(updateExpanded(currExpanded => ({ ...currExpanded, [item.id]: false })));
      }
      if (action === 'DOWN') {
        const next = getNext({ id: item.id, dataset: filteredDataset, expanded });
        if (next) {
          try {
            document.getElementById(createId(next.id, prefix)).focus();
          } catch (err) {
            // debugger;
          }
        }
      }
      if (action === 'UP') {
        const prev = getPrevious({ id: item.id, dataset: filteredDataset, expanded });

        if (prev) {
          try {
            document.getElementById(createId(prev.id, prefix)).focus();
          } catch (err) {
            // debugger;
          }
        }
      }
    },
  };

  componentDidMount() {
    addons.getChannel().on(STORIES_COLLAPSE_ALL, this.onCollapseAll);
    addons.getChannel().on(STORIES_EXPAND_ALL, this.onExpandAll);
  }

  componentWillUnmount() {
    addons.getChannel().off(STORIES_COLLAPSE_ALL, this.onCollapseAll);
    addons.getChannel().off(STORIES_EXPAND_ALL, this.onExpandAll);
  }

  updateExpanded = (expanded: string | boolean) => {
    const { dataset, selectedId } = this.props;
    this.setState(({ unfilteredExpanded }) => {
      const selectedAncestorIds = selectedId ? getParents(selectedId, dataset).map(i => i.id) : [];
      return {
        unfilteredExpanded: Object.keys(unfilteredExpanded).reduce(
          (acc, key) => ({ ...acc, [key]: selectedAncestorIds.includes(key) || expanded }),
          {}
        ),
      };
    });
  };

  onCollapseAll = () => this.updateExpanded(undefined);

  onExpandAll = () => this.updateExpanded(true);

  render() {
    const {
      events,
      state: { filter, unfilteredExpanded, filteredExpanded },
      props,
    } = this;
    const { prefix, dataset, selectedId } = props;

    const Filter = getFilter(props.Filter);
    const List = getFilter(props.List);
    const Branch = Tree;
    const Title = getTitle(props.Title);
    const Link = getLink(props.Link);
    const Leaf = getLeaf(props.Leaf, Link, prefix, events);
    const Head = getHead(props.Head, Link, prefix, events);
    const Section = getContainer(props.Section);
    const Message = getMessage(props.Message);

    const filteredDataset = getFilteredDataset({ dataset, filter });
    const expanded = filter ? filteredExpanded : unfilteredExpanded;
    const { selected, roots, others } = getPropsForTree({ dataset: filteredDataset, selectedId });

    return (
      <Fragment>
        {Filter ? <Filter key="filter" onChange={this.events.onFilter} /> : null}
        {!roots.length && !others.length && <Message>This filter resulted in 0 results</Message>}

        {others.length ? (
          <Section key="other">
            {others.map(({ id }) => (
              <Branch
                key={id}
                depth={0}
                dataset={filteredDataset}
                selected={selected}
                expanded={expanded}
                root={id}
                events={events}
                Link={Link}
                Head={Head}
                Leaf={Leaf}
                Branch={Branch}
              />
            ))}
          </Section>
        ) : null}

        {roots.map(({ id, name, children }) => (
          <Section key={id}>
            <Title type="section" mods={['uppercase']}>
              {name}
            </Title>
            {children.map(key => (
              <Branch
                key={key}
                depth={0}
                dataset={filteredDataset}
                selected={selected}
                expanded={expanded}
                root={key}
                events={events}
                Head={Head}
                Leaf={Leaf}
                Branch={Branch}
                List={List}
              />
            ))}
          </Section>
        ))}
      </Fragment>
    );
  }
}

export { TreeState, Tree };
