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
  };
}
