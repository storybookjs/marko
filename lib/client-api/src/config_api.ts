/* eslint no-underscore-dangle: 0 */

import Channel from '@storybook/channels';
import StoryStore from './story_store';
import ClientApi from './client_api';

export default class ConfigApi {
  _channel: Channel;

  _storyStore: StoryStore;

  _clearDecorators: () => void;

  clientApi: ClientApi;

  constructor({ storyStore }: { storyStore: StoryStore }) {
    this._storyStore = storyStore;
  }

  configure = (loaders: () => void, module: NodeModule) => {
    this._storyStore.startConfiguring();

    try {
      loaders();

      this._storyStore.clearError();
    } catch (err) {
      this._storyStore.setError(err);
    }
    this._storyStore.finishConfiguring();

    if (module.hot) {
      module.hot.accept();
      // The generated entry point for main.js:stories adds this flag as it cannot
      // set decorators but calls configure, and aims not to clear decorators added by other files.
      // HOWEVER: this will still clear global decorators added by addons when reloading preview.js
      //   which is a bug!
      // @ts-ignore
      if (!module._StorybookPreserveDecorators) {
        module.hot.dispose(() => this._storyStore.clearGlobalDecorators());
      }
    }
  };
}
