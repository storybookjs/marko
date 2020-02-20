import { document, navigator, window } from 'global';
import React from 'react';
import ReactDOM from 'react-dom';
import deprecate from 'util-deprecate';

import addons, { DecorateStoryFunction, Channel } from '@storybook/addons';
import createChannel from '@storybook/channel-postmessage';
import { ClientApi, ConfigApi, StoryStore } from '@storybook/client-api';
import { isExportStory, storyNameFromExport, toId } from '@storybook/csf';
import { logger } from '@storybook/client-logger';
import Events from '@storybook/core-events';

import { initializePath, setPath } from './url';
import {
  Loadable,
  LoaderFunction,
  PreviewError,
  RequireContext,
  RenderContext,
  RenderStoryFunction,
} from './types';
import { StoryRenderer } from './StoryRenderer';

const isBrowser =
  navigator &&
  navigator.userAgent &&
  navigator.userAgent !== 'storyshots' &&
  !(navigator.userAgent.indexOf('Node.js') > -1) &&
  !(navigator.userAgent.indexOf('jsdom') > -1);

function getOrCreateChannel() {
  let channel = null;
  if (isBrowser) {
    try {
      channel = addons.getChannel();
    } catch (e) {
      channel = createChannel({ page: 'preview' });
      addons.setChannel(channel);
    }
  }

  return channel;
}

function getClientApi(channel: Channel, decorateStory: DecorateStoryFunction) {
  let storyStore: StoryStore;
  let clientApi: ClientApi;
  if (
    typeof window !== 'undefined' &&
    window.__STORYBOOK_CLIENT_API__ &&
    window.__STORYBOOK_STORY_STORE__
  ) {
    clientApi = window.__STORYBOOK_CLIENT_API__;
    storyStore = window.__STORYBOOK_STORY_STORE__;
  } else {
    storyStore = new StoryStore({ channel });
    clientApi = new ClientApi({ storyStore, decorateStory });
  }
  return { clientApi, storyStore };
}

function focusInInput(event: Event) {
  const target = event.target as Element;
  return /input|textarea/i.test(target.tagName) || target.getAttribute('contenteditable') !== null;
}

// todo improve typings
export default function start(
  render: RenderStoryFunction,
  { decorateStory }: { decorateStory?: DecorateStoryFunction } = {}
) {
  const channel = getOrCreateChannel();
  const { clientApi, storyStore } = getClientApi(channel, decorateStory);
  const { clearDecorators } = clientApi;
  const configApi = new ConfigApi({ clearDecorators, storyStore, channel, clientApi });
  const storyRenderer = new StoryRenderer({ render, channel, storyStore });

  // channel can be null in NodeJS
  if (isBrowser) {
    const deprecatedToId = deprecate(
      toId,
      `Passing name+kind to the SET_CURRENT_STORY event is deprecated, use a storyId instead`
    );

    channel.on(Events.SET_CURRENT_STORY, ({ storyId: inputStoryId, name, kind, viewMode }) => {
      let storyId = inputStoryId;
      // For backwards compatibility
      if (!storyId) {
        if (!name || !kind) {
          throw new Error('You should pass `storyId` into SET_CURRENT_STORY');
        }
        storyId = deprecatedToId(kind, name);
      }

      storyStore.setSelection({ storyId, viewMode });
      setPath({ storyId, viewMode });
    });

    // Handle keyboard shortcuts
    window.onkeydown = (event: KeyboardEvent) => {
      if (!focusInInput(event)) {
        // We have to pick off the keys of the event that we need on the other side
        const { altKey, ctrlKey, metaKey, shiftKey, key, code, keyCode } = event;
        channel.emit(Events.PREVIEW_KEYDOWN, {
          event: { altKey, ctrlKey, metaKey, shiftKey, key, code, keyCode },
        });
      }
    };
  }

  storyStore.on(Events.STORY_INIT, () => {
    const { storyId, viewMode } = initializePath(storyStore);
    storyStore.setSelection({ storyId, viewMode });
  });

  if (typeof window !== 'undefined') {
    window.__STORYBOOK_CLIENT_API__ = clientApi;
    window.__STORYBOOK_STORY_STORE__ = storyStore;
    window.__STORYBOOK_ADDONS_CHANNEL__ = channel; // may not be defined
  }

  let previousExports = new Map<any, string>();
  const loadStories = (loadable: Loadable, framework: string) => () => {
    let reqs = null;
    // todo discuss / improve type check
    if (Array.isArray(loadable)) {
      reqs = loadable;
    } else if ((loadable as RequireContext).keys) {
      reqs = [loadable as RequireContext];
    }

    let currentExports = new Map<any, string>();
    if (reqs) {
      reqs.forEach(req => {
        req.keys().forEach((filename: string) => {
          const fileExports = req(filename);
          currentExports.set(
            fileExports,
            // todo discuss: types infer that this is RequireContext; no checks needed?
            // typeof req.resolve === 'function' ? req.resolve(filename) : null
            req.resolve(filename)
          );
        });
      });
    } else {
      const exported = (loadable as LoaderFunction)();
      if (Array.isArray(exported) && exported.every(obj => obj.default != null)) {
        currentExports = new Map(exported.map(fileExports => [fileExports, null]));
      } else if (exported) {
        logger.warn(
          `Loader function passed to 'configure' should return void or an array of module exports that all contain a 'default' export. Received: ${JSON.stringify(
            exported
          )}`
        );
      }
    }

    const removed = Array.from(previousExports.keys()).filter(exp => !currentExports.has(exp));
    removed.forEach(exp => {
      if (exp.default) {
        storyStore.removeStoryKind(exp.default.title);
      }
    });
    if (removed.length > 0) {
      storyStore.incrementRevision();
    }

    const added = Array.from(currentExports.keys()).filter(exp => !previousExports.has(exp));
    added.forEach(fileExports => {
      // An old-style story file
      if (!fileExports.default) {
        return;
      }

      if (!fileExports.default.title) {
        throw new Error(
          `Unexpected default export without title: ${JSON.stringify(fileExports.default)}`
        );
      }

      const { default: meta, __namedExportsOrder, ...namedExports } = fileExports;
      let exports = namedExports;

      // prefer a user/loader provided `__namedExportsOrder` array if supplied
      // we do this as es module exports are always ordered alphabetically
      // see https://github.com/storybookjs/storybook/issues/9136
      if (Array.isArray(__namedExportsOrder)) {
        exports = {};
        __namedExportsOrder.forEach(name => {
          if (namedExports[name]) {
            exports[name] = namedExports[name];
          }
        });
      }

      const {
        title: kindName,
        id: componentId,
        parameters: params,
        decorators: decos,
        component,
        subcomponents,
      } = meta;
      // We pass true here to avoid the warning about HMR. It's cool clientApi, we got this
      // todo discuss: TS now wants a NodeModule; should we fix this differently?
      const kind = clientApi.storiesOf(kindName, true as any);

      // we should always have a framework, rest optional
      kind.addParameters({
        framework,
        component,
        subcomponents,
        fileName: currentExports.get(fileExports),
        ...params,
      });

      // todo add type
      (decos || []).forEach((decorator: any) => {
        kind.addDecorator(decorator);
      });

      Object.keys(exports).forEach(key => {
        if (isExportStory(key, meta)) {
          const storyFn = exports[key];
          const { name, parameters, decorators } = storyFn.story || {};
          if (parameters && parameters.decorators) {
            deprecate(() => {},
            `${kindName} => ${name || key}: story.parameters.decorators is deprecated; use story.decorators instead.`)();
          }
          const decoratorParams = decorators ? { decorators } : null;
          const exportName = storyNameFromExport(key);
          const idParams = { __id: toId(componentId || kindName, exportName) };
          kind.add(name || exportName, storyFn, {
            ...parameters,
            ...decoratorParams,
            ...idParams,
          });
        }
      });
    });
    previousExports = currentExports;
  };

  let loaded = false;
  /**
   * Load a collection of stories. If it has a default export, assume that it is a module-style
   * file and process its named exports as stories. If not, assume it's an old-style
   * storiesof file and require it.
   *
   * @param {*} loadable a require.context `req`, an array of `req`s, or a loader function that returns void or an array of exports
   * @param {*} m - ES module object for hot-module-reloading (HMR)
   * @param {*} framework - name of framework in use, e.g. "react"
   */
  const configure = (loadable: Loadable, m: NodeModule, framework: string) => {
    if (typeof m === 'string') {
      throw new Error(
        `Invalid module '${m}'. Did you forget to pass \`module\` as the second argument to \`configure\`"?`
      );
    }
    if (m && m.hot && m.hot.dispose) {
      ({ previousExports = new Map() } = m.hot.data || {});

      m.hot.dispose(data => {
        loaded = false;
        // eslint-disable-next-line no-param-reassign
        data.previousExports = previousExports;
      });
    }
    if (loaded) {
      logger.warn('Unexpected loaded state. Did you call `load` twice?');
    }
    loaded = true;
    configApi.configure(loadStories(loadable, framework), m);
  };

  return { configure, clientApi, configApi, forceReRender: () => storyRenderer.forceReRender() };
}
