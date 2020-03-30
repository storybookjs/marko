import { location, fetch } from 'global';
import { logger } from '@storybook/client-logger';
import {
  transformStoriesRawToStoriesHash,
  StoriesRaw,
  StoryInput,
  StoriesHash,
} from '../lib/stories';

import { ModuleFn } from '../index';

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

export const init: ModuleFn = ({ store, provider }) => {
  const api: SubAPI = {
    findRef: (source) => {
      const refs = api.getRefs();

      return Object.values(refs).find(({ url }) => `${url}/iframe.html`.match(source));
    },
    changeRefVersion: (id, url) => {
      const previous = api.getRefs()[id];
      const ref = { ...previous, stories: {}, url } as SetRefData;

      api.checkRef(ref);
    },
    checkRef: async (ref) => {
      const { id, url } = ref;

      const handler = async (response: Response) => {
        if (response) {
          const { ok } = response;

          if (ok) {
            return response.json().catch((error: Error) => ({ error }));
          }
        } else {
          logger.warn('an auto-injected ref threw a cors-error');
        }

        return false;
      };

      const [stories, metadata] = await Promise.all([
        fetch(`${url}/stories.json`)
          .catch(() => false)
          .then(handler),
        fetch(`${url}/metadata.json`)
          .catch(() => false)
          .then(handler),
      ]);

      api.setRef(id, {
        id,
        url,
        ...(stories || {}),
        ...(metadata || {}),
        startInjected: !stories && !metadata,
      });
    },

    getRefs: () => {
      const { refs = {} } = store.getState();

      return refs;
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
          ...api.getRefs(),
          [id]: result,
        },
      });
    },
  };

  const refs = provider.getConfig().refs || {};
  const initialState: SubState['refs'] = refs;

  Object.entries(refs).forEach(([k, v]) => {
    api.checkRef(v as SetRefData);
  });

  return {
    api,
    state: {
      refs: initialState,
    },
  };
};
