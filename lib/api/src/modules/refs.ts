import { location, fetch } from 'global';
import { logger } from '@storybook/client-logger';
import {
  transformStoriesRawToStoriesHash,
  StoriesRaw,
  StoryInput,
  StoriesHash,
} from '../lib/stories';

import { Module } from '../index';

export interface SubState {
  refs: Refs;
}

type Versions = Record<string, string>;

export type SetRefData = Omit<ComposedRef, 'stories'> & {
  stories?: StoriesRaw;
};

export interface SubAPI {
  findRef: (source: string) => ComposedRef;
  setRef: (id: string, data: SetRefData, ready?: boolean) => void;
  getRefs: () => Refs;
  checkRef: (ref: SetRefData) => Promise<void>;
  changeRefVersion: (id: string, url: string) => void;
}

export type Mapper = (ref: ComposedRef, story: StoryInput) => StoryInput;
export interface ComposedRef {
  id: string;
  title?: string;
  url: string;
  startInjected?: boolean;
  stories: StoriesHash;
  versions?: Versions;
  authUrl?: string;
  ready?: boolean;
  error?: any;
}

export type Refs = Record<string, ComposedRef>;
export type RefId = string;
export type RefUrl = string;

export const getSourceType = (source: string) => {
  const { origin, pathname } = location;

  if (source === origin || source === `${origin + pathname}iframe.html`) {
    return 'local';
  }
  return 'external';
};

export const defaultMapper: Mapper = (b, a) => {
  return { ...a, kind: a.kind.replace('|', '/') };
};

const addRefIds = (input: StoriesHash, ref: ComposedRef): StoriesHash => {
  return Object.entries(input).reduce((acc, [id, item]) => {
    return { ...acc, [id]: { ...item, refId: ref.id } };
  }, {} as StoriesHash);
};

const map = (input: StoriesRaw, ref: ComposedRef, options: { mapper?: Mapper }): StoriesRaw => {
  const { mapper } = options;
  if (mapper) {
    return Object.entries(input).reduce((acc, [id, item]) => {
      return { ...acc, [id]: mapper(ref, item) };
    }, {} as StoriesRaw);
  }
  return input;
};

export const init = ({ store, provider }: Module) => {
  const api: SubAPI = {
    findRef: source => {
      const refs = api.getRefs();

      return Object.values(refs).find(({ url }) => `${url}/iframe.html`.match(source));
    },
    changeRefVersion: (id, url) => {
      const previous = api.getRefs()[id];
      const ref = { ...previous, stories: {}, url } as SetRefData;

      api.checkRef(ref);
    },
    checkRef: async ref => {
      const { id, url } = ref;

      const response = await fetch(`${url}/data.json`).catch(() => false);

      if (response) {
        const { ok } = response;

        if (ok) {
          const data: SetRefData = await response
            .json()
            .catch((error: Error) => ({ startInjected: true, error }));

          api.setRef(id, { id, url, startInjected: false, ...data });
        } else {
          api.setRef(id, { id, url, startInjected: true });
        }
      } else {
        logger.warn('an auto-injected ref threw a cors-error');
        api.setRef(id, { id, url, startInjected: true });
      }
    },

    getRefs: () => {
      const { refs: fromConfig = {} } = provider.getConfig();
      const { refs: fromState = {} } = store.getState();

      return { ...fromConfig, ...fromState };
    },

    setRef: (id, { stories, ...rest }, ready = false) => {
      const ref = api.getRefs()[id];
      const after = stories
        ? addRefIds(
            transformStoriesRawToStoriesHash(
              map(stories, ref, { mapper: defaultMapper }),
              {},
              { provider }
            ),
            ref
          )
        : undefined;

      const result = { ...ref, stories: after, ...rest, ready };

      store.setState({
        refs: {
          ...(store.getState().refs || {}),
          [id]: result,
        },
      });
    },
  };

  const refs = Object.entries(api.getRefs());

  const initialState: SubState['refs'] = refs.reduce(
    (acc, [key, data]) => ({
      ...acc,
      [key]: {
        title: data.id,
        ...data,
      },
    }),
    {} as SubState['refs']
  );

  refs.forEach(([k, v]) => {
    api.checkRef(v as SetRefData);
  });

  return {
    api,
    state: {
      refs: initialState,
    },
  };
};
