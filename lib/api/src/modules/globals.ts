import { SET_STORIES, UPDATE_GLOBALS, GLOBALS_UPDATED } from '@storybook/core-events';
import { logger } from '@storybook/client-logger';

import { Args, ModuleFn } from '../index';

import { SetStoriesPayload } from '../lib/stories';
import { getSourceType, ComposedRef } from './refs';

export interface SubState {
  globals: Args;
}

export interface SubAPI {
  updateGlobals: (newGlobals: Args) => void;
}

interface Meta {
  ref?: ComposedRef;
  source?: string;
  sourceType?: 'local' | 'external';
  sourceLocation?: string;
  refId?: string;
  v?: number;
  type: string;
}

export const init: ModuleFn = ({ store, fullAPI }) => {
  const api: SubAPI = {
    updateGlobals(newGlobals) {
      // Only emit the message to the local ref
      fullAPI.emit(UPDATE_GLOBALS, {
        globals: newGlobals,
        options: {
          target: 'storybook-preview-iframe',
        },
      });
    },
  };

  const state: SubState = {
    // Currently global args always start empty. TODO -- should this be set on the channel at init time?
    globals: {},
  };

  const getEventMetadata = (context: Meta) => {
    const { source, refId, type } = context;
    const [sourceType, sourceLocation] = getSourceType(source, refId);

    const ref =
      refId && fullAPI.getRefs()[refId]
        ? fullAPI.getRefs()[refId]
        : fullAPI.findRef(sourceLocation);

    const meta = {
      source,
      sourceType,
      sourceLocation,
      refId,
      ref,
      type,
    };

    switch (true) {
      case typeof refId === 'string':
      case sourceType === 'local':
      case sourceType === 'external': {
        return meta;
      }

      // if we couldn't find the source, something risky happened, we ignore the input, and log a warning
      default: {
        logger.warn(`Received a ${type} frame that was not configured as a ref`);
        return null;
      }
    }
  };

  const initModule = () => {
    fullAPI.on(GLOBALS_UPDATED, function handleGlobalsUpdated({ globals }: { globals: Args }) {
      const { ref } = getEventMetadata(this);

      if (!ref) {
        store.setState({ globals });
      } else {
        logger.warn(
          'received a GLOBALS_UPDATED from a non-local ref. This is not currently supported.'
        );
      }
    });
    fullAPI.on(SET_STORIES, function handleSetStories({ globals }: SetStoriesPayload) {
      const { ref } = getEventMetadata(this);

      if (!ref) {
        store.setState({ globals });
      } else if (Object.keys(globals).length > 0) {
        logger.warn('received globals from a non-local ref. This is not currently supported.');
      }
    });
  };

  return {
    api,
    state,
    init: initModule,
  };
};
