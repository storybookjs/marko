import { location } from 'global';
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
  refs: Record<string, InceptionRef & { data: StoriesHash } & RefState>;
}

export interface SubAPI {
  setRef: (id: string, stories: StoriesRaw) => void;
  getRefs: () => Record<RefId, RefUrl>;
}

export type Mapper = (ref: InceptionRef, story: StoryInput) => StoryInput;
export interface InceptionRef {
  id: string;
  url: string;
}
export interface RefState {
  isInjected: boolean;
}

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
  return { ...a, kind: `${b.id}/${a.kind.replace('|', '/')}` };
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
  const getRefs: SubAPI['getRefs'] = () => {
    const { refs = {} } = provider.getConfig();

    return refs;
  };

  const setRef: SubAPI['setRef'] = (id, data) => {
    const url = getRefs()[id];
    const ref = { id, url };
    const after = namespace(
      transformStoriesRawToStoriesHash(map(data, ref, { mapper: defaultMapper }), {}),
      ref
    );

    store.setState({
      refs: {
        ...(store.getState().refs || {}),
        [id]: { id, url, data: after, isInjected: true },
      },
    });
  };

  const initialState: SubState['refs'] = Object.entries(getRefs()).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: {
        id: key,
        url: value,
        data: {},
        isInjected: true,
      },
    }),
    {} as SubState['refs']
  );

  return {
    api: {
      setRef,
      getRefs,
    },
    state: {
      refs: initialState,
    },
  };
};
export default initRefsApi;
