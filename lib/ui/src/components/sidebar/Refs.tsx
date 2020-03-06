import { window } from 'global';
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

import { StoriesHash, State, useStorybookApi, isRoot } from '@storybook/api';
import { Icons, WithTooltip, Spaced, Button, TooltipLinkList } from '@storybook/components';
import { logger } from '@storybook/client-logger';
import { Location } from '@storybook/router';
import { styled } from '@storybook/theming';

import { ListItem } from './Tree/ListItem';
import { toFiltered, getMains, getParents } from './Tree/utils';
import { Tree } from './Tree/Tree';
import { Section, Hr } from './Section';
import { Loader, Contained } from './Loader';

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

const IndicatorPlacement = styled.div(
  ({ theme }) => ({
    position: 'absolute',
    top: 0,
    right: 20,
    height: 14,
    display: 'flex',

    '& > * + *': {
      marginLeft: theme.layoutMargin,
    },
  }),
  ({ theme }) => ({
    color: theme.color.mediumdark,
  })
);

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

const Message = styled.a(({ theme }) => ({
  textDecoration: 'none',
  lineHeight: '18px',
  padding: 10,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  color: theme.color.darker,

  '&:hover': {
    background: theme.background.hoverable,
    color: theme.color.darker,
  },
  '&:link': {
    color: theme.color.darker,
  },
  '&:active': {
    color: theme.color.darker,
  },
  '&:focus': {
    color: theme.color.darker,
  },

  '& > *': {
    flex: 1,
  },
  '& > svg': {
    marginTop: 5,
    width: 20,
    marginRight: 10,
    flex: 'unset',
  },
}));

const MessageWrapper = styled.div({
  width: 280,
  boxSizing: 'border-box',
  borderRadius: 8,
  overflow: 'hidden',
});

const BlueIcon = styled(Icons)(({ theme }) => ({
  color: theme.color.secondary,
}));
const YellowIcon = styled(Icons)(({ theme }) => ({
  color: theme.color.gold,
}));

const RefIndicator: FunctionComponent<RefType & { type: ReturnType<typeof getType> }> = ({
  type,
  ...ref
}) => {
  const icon = getIcon(ref);

  const list = useMemo(() => Object.values(ref.stories || {}), [ref.stories]);
  const componentCount = useMemo(() => list.filter(v => v.isComponent).length, [list]);
  const leafCount = useMemo(() => list.filter(v => v.isLeaf).length, [list]);

  return (
    <IndicatorPlacement>
      <WithTooltip
        placement="top"
        trigger="click"
        tooltip={
          <MessageWrapper>
            <Spaced row={0}>
              {type === 'loading' ? (
                <Message href={ref.url} target="_blank">
                  <BlueIcon icon="time" />
                  <div>
                    <strong>Please wait</strong>
                    <div>This storybook is being loaded, explore in a new browser tab</div>
                  </div>
                </Message>
              ) : (
                <Message href={ref.url} target="_blank">
                  <BlueIcon icon="globe" />
                  <div>
                    <strong>View external storybook</strong>
                    <div>
                      Explore {componentCount} components and {leafCount} stories in a new browser
                      tab
                    </div>
                  </div>
                </Message>
              )}

              {ref.startInjected ? (
                <Fragment>
                  <Hr />
                  <Message href="https://storybook.js.org" target="_blank">
                    <YellowIcon icon="lightning" />
                    <div>
                      <strong>Reduce lag</strong>
                      <div>Learn how to speed up Storybook Composition performance</div>
                    </div>
                  </Message>
                </Fragment>
              ) : null}

              {type === 'error' ? (
                <Fragment>
                  <Hr />
                  <Message href="https://storybook.js.org" target="_blank">
                    <YellowIcon icon="book" />
                    <div>
                      <strong>A problem occured</strong>
                      <div>Explore the documentation</div>
                    </div>
                  </Message>
                </Fragment>
              ) : null}
            </Spaced>
          </MessageWrapper>
        }
      >
        {icon}
      </WithTooltip>
      {ref.versions ? (
        <WithTooltip
          placement="top"
          trigger="click"
          tooltip={
            <TooltipLinkList
              links={Object.entries(ref.versions).map(([id, href]) => ({ id, title: id, href }))}
            />
          }
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 4, fontSize: 11 }}>{Object.keys(ref.versions)[0]}</span>
            <Icons width="14" height="14" icon="chevrondown" />
          </div>
        </WithTooltip>
      ) : null}
    </IndicatorPlacement>
  );
};

const Wrapper = styled.div({
  position: 'relative',
  marginLeft: -20,
  marginRight: -20,
});

const getType = (isLoading: boolean, isAuthRequired: boolean, isError: boolean) => {
  if (isLoading) {
    return 'loading';
  }
  if (isAuthRequired) {
    return 'auth';
  }
  if (isError) {
    return 'error';
  }
  return 'ready';
};

const Text = styled.p(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,

  margin: 0,
}));

export const Ref: FunctionComponent<RefType & RefProps> = ref => {
  const { stories, id: key, title = key, storyId, filter, isHidden = false, authUrl, error } = ref;
  const { dataSet, expandedSet, length, others, roots, setExpanded, selectedSet } = useDataset(
    stories,
    filter,
    storyId
  );

  const combo = useMemo(() => ({ setExpanded, expandedSet }), [setExpanded, expandedSet]);

  const isLoading = !length;
  const isMain = key === 'storybook_internal';
  const isError = !!error;
  const isAuthRequired = !!authUrl;

  const type = getType(isLoading, isAuthRequired, isError);
  const [isAuthAttempted, setAuthAttempted] = useState(false);

  const refresh = useCallback(() => {
    window.document.location.reload();
  }, []);

  const open = useCallback(e => {
    e.preventDefault();
    const childWindow = window.open(authUrl, `storybook_auth_${ref.id}`, 'resizable,scrollbars');

    // wait for window to close
    const timer = setInterval(() => {
      if (!childWindow) {
        logger.error('unable to access authUrl window');
        clearInterval(timer);
      }
      if (childWindow.closed) {
        clearInterval(timer);
        setAuthAttempted(true);
      }
    }, 1000);
  }, []);

  return isHidden ? null : (
    <ExpanderContext.Provider value={combo}>
      <Wrapper data-title={title}>
        {isMain ? null : (
          <Fragment>
            <RefHead>{title}</RefHead>
            <RefIndicator {...ref} type={type} />
          </Fragment>
        )}

        {type === 'auth' && (
          <Contained>
            <Spaced>
              {isAuthAttempted ? (
                <Fragment>
                  <Text>Authentication concluded</Text>
                  <div>
                    <Button small gray onClick={refresh}>
                      <Icons icon="sync" />
                      Refresh the page
                    </Button>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <Text>Browse this secure storybook</Text>
                  <div>
                    <Button small gray onClick={open}>
                      <Icons icon="lock" />
                      Login
                    </Button>
                  </div>
                </Fragment>
              )}
            </Spaced>
          </Contained>
        )}

        {type === 'error' && (
          <Contained>
            <Spaced>
              <Text>Ow now! something went wrong loading this storybook</Text>
              <WithTooltip
                trigger="click"
                tooltip={
                  <MessageWrapper>
                    <pre>{error.toString()}</pre>
                  </MessageWrapper>
                }
              >
                <Button small gray>
                  <Icons icon="doclist" />
                  View error
                </Button>
              </WithTooltip>
            </Spaced>
          </Contained>
        )}

        {type === 'loading' && (
          <Contained>
            <Loader size={isMain ? 'multiple' : 'single'} />
          </Contained>
        )}

        {type === 'ready' && (
          <Fragment>
            <Spaced row={1.5}>
              {others.length ? (
                <Section data-title="categorized" key="categorized">
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
                <Section data-title={name} key={id}>
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
          </Fragment>
        )}
      </Wrapper>
    </ExpanderContext.Provider>
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
