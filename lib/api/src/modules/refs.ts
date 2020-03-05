import { location, fetch } from 'global';
import { logger } from '@storybook/client-logger';
import {
  transformStoriesRawToStoriesHash,
  StoriesRaw,
  StoryInput,
  StoriesHash,
  isRoot,
  Story,
  Group,
  Root,
} from '../lib/stories';

import { Module } from '../index';

export interface SubState {
  refs: Refs;
}

type Versions = Record<string, string>;

export interface SetRefData {
  stories?: StoriesRaw;
  versions?: Versions;
  startInjected?: true;
  loginUrl?: string;
  error?: any;
}

export interface SubAPI {
  findRef: (source: string) => InceptionRef;
  setRef: (id: string, data: SetRefData, ready?: boolean) => void;
  getRefs: () => Refs;
  checkRef: (ref: InceptionRef) => Promise<void>;
}

export type Mapper = (ref: InceptionRef, story: StoryInput) => StoryInput;
export interface InceptionRef {
  id: string;
  title?: string;
  url: string;
  startInjected?: boolean;
  stories: StoriesHash;
  versions?: Versions;
  ready?: boolean;
  error?: any;
}

export type Refs = Record<string, InceptionRef>;
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

const namespace = (input: StoriesHash, ref: InceptionRef): StoriesHash => {
  const output = {} as StoriesHash;

  Object.entries(input).forEach(([id, item]) => {
    const mappedId = `${ref.id}_${item.id}`;
    const target = output[mappedId] || ({} as Story | Group | Root);

    const addition: Partial<Story> = {
      id: mappedId,
      // this is used later to emit the correct commands over the channel
      knownAs: id,
      // this is used to know which iframe to emit the message to
      refId: ref.id,
    };

    Object.assign(target, item, addition);

    if (!isRoot(item)) {
      const mappedParentId = `${ref.id}_${item.parent}`;

      Object.assign(target, {
        parent: mappedParentId,
      });
    }

    if (item.children) {
      Object.assign(target, {
        children: item.children.map(c => `${ref.id}_${c}`),
      });
    }
    output[mappedId] = target;
  });

  return output;
};

const map = (input: StoriesRaw, ref: InceptionRef, options: { mapper?: Mapper }): StoriesRaw => {
  const output: StoriesRaw = {};
  // map the incoming stories to a prefixed, non-conflicting version
  Object.entries(input).forEach(([unmappedStoryId, unmappedStoryInput]) => {
    const mapped = options.mapper ? options.mapper(ref, unmappedStoryInput) : unmappedStoryInput;

    if (mapped) {
      output[unmappedStoryId] = mapped;
    }
  });
  return output;
};

const initRefsApi = ({ store, provider }: Module) => {
  const api: SubAPI = {
    findRef: source => {
      const refs = api.getRefs();

      return Object.values(refs).find(({ url }) => `${url}/iframe.html`.match(source));
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

          api.setRef(id, data);
        } else {
          api.setRef(id, { startInjected: true });
        }
      } else {
        logger.warn('an auto-injected ref threw a cors-error');
        api.setRef(id, { startInjected: true });
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
        ? namespace(
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
    api.checkRef(v);
  });

  return {
    api,
    state: {
      refs: initialState,
    },
  };
};

export default initRefsApi;
