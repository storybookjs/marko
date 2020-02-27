import React, {
  Component,
  Fragment,
  FunctionComponent,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import {
  SET_STORIES,
  STORY_CHANGED,
  SELECT_STORY,
  SHARED_STATE_CHANGED,
  SHARED_STATE_SET,
  NAVIGATE_URL,
} from '@storybook/core-events';
import { RenderData as RouterData } from '@storybook/router';
import { Listener } from '@storybook/channels';
import initProviderApi, { SubAPI as ProviderAPI, Provider } from './init-provider-api';

import { createContext } from './context';
import Store, { Options } from './store';
import getInitialState from './initial-state';

import initAddons, { SubAPI as AddonsAPI } from './modules/addons';
import initChannel, { SubAPI as ChannelAPI } from './modules/channel';
import initNotifications, {
  SubState as NotificationState,
  SubAPI as NotificationAPI,
} from './modules/notifications';
import initStories, { SubState as StoriesSubState, SubAPI as StoriesAPI } from './modules/stories';
import {
  StoriesRaw,
  StoriesHash,
  Story,
  Root,
  Group,
  isGroup,
  isRoot,
  isStory,
} from './lib/stories';
import initLayout, {
  ActiveTabs,
  SubState as LayoutSubState,
  SubAPI as LayoutAPI,
} from './modules/layout';
import initShortcuts, {
  SubState as ShortcutsSubState,
  SubAPI as ShortcutsAPI,
} from './modules/shortcuts';
import initURL, { QueryParams, SubAPI as UrlAPI } from './modules/url';
import initVersions, {
  SubState as VersionsSubState,
  SubAPI as VersionsAPI,
} from './modules/versions';

export { Options as StoreOptions, Listener as ChannelListener };
export { ActiveTabs };

const ManagerContext = createContext({ api: undefined, state: getInitialState({}) });

export type Module = StoreData &
  RouterData &
  ProviderData & {
    mode?: 'production' | 'development';
    state: State;
  };

export type State = Other &
  LayoutSubState &
  StoriesSubState &
  NotificationState &
  VersionsSubState &
  RouterData &
  ShortcutsSubState;

export type API = AddonsAPI &
  ChannelAPI &
  ProviderAPI &
  StoriesAPI &
  LayoutAPI &
  NotificationAPI &
  ShortcutsAPI &
  VersionsAPI &
  UrlAPI &
  OtherAPI;

interface OtherAPI {
  [key: string]: any;
}
interface Other {
  customQueryParams: QueryParams;

  [key: string]: any;
}

export interface Combo {
  api: API;
  state: State;
}

interface ProviderData {
  provider: Provider;
}

interface DocsModeData {
  docsMode: boolean;
}

interface StoreData {
  store: Store;
}

interface Children {
  children: ReactNode | ((props: Combo) => ReactNode);
}

type StatePartial = Partial<State>;

export type ManagerProviderProps = Children & RouterData & ProviderData & DocsModeData;

class ManagerProvider extends Component<ManagerProviderProps, State> {
  api: API;

  modules: any[];

  static displayName = 'Manager';

  constructor(props: ManagerProviderProps) {
    super(props);
    const {
      provider,
      location,
      path,
      viewMode = props.docsMode ? 'docs' : 'story',
      storyId,
      docsMode,
      navigate,
    } = props;

    const store = new Store({
      getState: () => this.state,
      setState: (stateChange: StatePartial, callback) => this.setState(stateChange, callback),
    });

    const routeData = { location, path, viewMode, storyId };

    // Initialize the state to be the initial (persisted) state of the store.
    // This gives the modules the chance to read the persisted state, apply their defaults
    // and override if necessary
    const docsModeState = {
      layout: { isToolshown: false, showPanel: false },
      ui: { docsMode: true },
    };
    this.state = store.getInitialState(
      getInitialState({
        ...routeData,
        ...(docsMode ? docsModeState : null),
      })
    );

    const apiData = {
      navigate,
      store,
      provider,
    };

    this.modules = [
      initChannel,
      initAddons,
      initLayout,
      initNotifications,
      initShortcuts,
      initStories,
      initURL,
      initVersions,
    ].map(initModule => initModule({ ...routeData, ...apiData, state: this.state }));

    // Create our initial state by combining the initial state of all modules, then overlaying any saved state
    const state = getInitialState(...this.modules.map(m => m.state));

    // Get our API by combining the APIs exported by each module
    const combo = Object.assign({ navigate }, ...this.modules.map(m => m.api));

    const api = initProviderApi({ provider, store, api: combo });

    api.on(STORY_CHANGED, (id: string) => {
      const options = api.getParameters(id, 'options');

      if (options) {
        api.setOptions(options);
      }
    });

    api.on(SET_STORIES, (data: { stories: StoriesRaw }) => {
      api.setStories(data.stories);
      const options = storyId
        ? api.getParameters(storyId, 'options')
        : api.getParameters(Object.keys(data.stories)[0], 'options');
      api.setOptions(options);
    });
    api.on(
      SELECT_STORY,
      ({ kind, story, ...rest }: { kind: string; story: string; [k: string]: any }) => {
        api.selectStory(kind, story, rest);
      }
    );
    api.on(NAVIGATE_URL, (url: string, options: { [k: string]: any }) => {
      api.navigateUrl(url, options);
    });

    this.state = state;
    this.api = api;
  }

  static getDerivedStateFromProps = (props: ManagerProviderProps, state: State) => {
    if (state.path !== props.path) {
      return {
        ...state,
        location: props.location,
        path: props.path,
        viewMode: props.viewMode,
        storyId: props.storyId,
      };
    }
    return null;
  };

  componentDidMount() {
    // Now every module has had a chance to set its API, call init on each module which gives it
    // a chance to do things that call other modules' APIs.
    this.modules.forEach(({ init }) => {
      if (init) {
        init({ api: this.api });
      }
    });
  }

  shouldComponentUpdate(nextProps: ManagerProviderProps, nextState: State) {
    const prevState = this.state;
    const prevProps = this.props;

    if (prevState !== nextState) {
      return true;
    }
    if (prevProps.path !== nextProps.path) {
      return true;
    }
    return false;
  }

  render() {
    const { children } = this.props;
    const value = {
      state: this.state,
      api: this.api,
    };

    return (
      <ManagerContext.Provider value={value}>
        <ManagerConsumer>{children}</ManagerConsumer>
      </ManagerContext.Provider>
    );
  }
}

interface ManagerConsumerProps<P = unknown> {
  filter?: (combo: Combo) => P;
  children: FunctionComponent<P> | ReactNode;
}

const defaultFilter = (c: Combo) => c;

function ManagerConsumer<P = Combo>({
  // @ts-ignore
  filter = defaultFilter,
  children,
}: ManagerConsumerProps<P>): ReactElement {
  const c = useContext(ManagerContext);
  const renderer = useRef(children);
  const filterer = useRef(filter);

  if (typeof renderer.current !== 'function') {
    return <Fragment>{renderer.current}</Fragment>;
  }

  const data = filterer.current(c);

  const l = useMemo(() => {
    return [...Object.entries(data).reduce((acc, keyval) => acc.concat(keyval), [])];
  }, [c.state]);

  return useMemo(() => {
    const Child = renderer.current as FunctionComponent<P>;

    return <Child {...data} />;
  }, l);
}

export function useStorybookState(): State {
  const { state } = useContext(ManagerContext);
  return state;
}
export function useStorybookApi(): API {
  const { api } = useContext(ManagerContext);
  return api;
}

export {
  ManagerConsumer as Consumer,
  ManagerProvider as Provider,
  StoriesHash,
  Story,
  Root,
  Group,
  isGroup,
  isRoot,
  isStory,
};

export interface EventMap {
  [eventId: string]: Listener;
}

function orDefault<S>(fromStore: S, defaultState: S): S {
  if (typeof fromStore === 'undefined') {
    return defaultState;
  }
  return fromStore;
}

export const useChannel = (eventMap: EventMap, deps: any[] = []) => {
  const api = useStorybookApi();
  useEffect(() => {
    Object.entries(eventMap).forEach(([type, listener]) => api.on(type, listener));
    return () => {
      Object.entries(eventMap).forEach(([type, listener]) => api.off(type, listener));
    };
  }, deps);

  return api.emit;
};

export function useParameter<S>(parameterKey: string, defaultValue?: S) {
  const api = useStorybookApi();

  const result = api.getCurrentParameter<S>(parameterKey);
  return orDefault<S>(result, defaultValue);
}

type StateMerger<S> = (input: S) => S;
// cache for taking care of HMR
const addonStateCache: {
  [key: string]: any;
} = {};

// shared state
export function useSharedState<S>(stateId: string, defaultState?: S) {
  const api = useStorybookApi();
  const existingState = api.getAddonState<S>(stateId);
  const state = orDefault<S>(
    existingState,
    addonStateCache[stateId] ? addonStateCache[stateId] : defaultState
  );
  const setState = (s: S | StateMerger<S>, options?: Options) => {
    // set only after the stories are loaded
    if (addonStateCache[stateId]) {
      addonStateCache[stateId] = s;
    }
    api.setAddonState<S>(stateId, s, options);
  };
  const allListeners = useMemo(() => {
    const stateChangeHandlers = {
      [`${SHARED_STATE_CHANGED}-client-${stateId}`]: (s: S) => setState(s),
      [`${SHARED_STATE_SET}-client-${stateId}`]: (s: S) => setState(s),
    };
    const stateInitializationHandlers = {
      [SET_STORIES]: () => {
        if (addonStateCache[stateId]) {
          // this happens when HMR
          setState(addonStateCache[stateId]);
          api.emit(`${SHARED_STATE_SET}-manager-${stateId}`, addonStateCache[stateId]);
        } else if (defaultState !== undefined) {
          // if not HMR, yet the defaults are form the manager
          setState(defaultState);
          // initialize addonStateCache after first load, so its available for subsequent HMR
          addonStateCache[stateId] = defaultState;
          api.emit(`${SHARED_STATE_SET}-manager-${stateId}`, defaultState);
        }
      },
      [STORY_CHANGED]: () => {
        if (api.getAddonState(stateId) !== undefined) {
          api.emit(`${SHARED_STATE_SET}-manager-${stateId}`, api.getAddonState(stateId));
        }
      },
    };

    return {
      ...stateChangeHandlers,
      ...stateInitializationHandlers,
    };
  }, [stateId]);

  const emit = useChannel(allListeners);
  return [
    state,
    (newStateOrMerger: S | StateMerger<S>, options?: Options) => {
      setState(newStateOrMerger, options);
      emit(`${SHARED_STATE_CHANGED}-manager-${stateId}`, newStateOrMerger);
    },
  ] as [S, (newStateOrMerger: S | StateMerger<S>, options?: Options) => void];
}

export function useAddonState<S>(addonId: string, defaultState?: S) {
  return useSharedState<S>(addonId, defaultState);
}

export function useStoryState<S>(defaultState?: S) {
  const { storyId } = useStorybookState();
  return useSharedState<S>(`story-state-${storyId}`, defaultState);
}
