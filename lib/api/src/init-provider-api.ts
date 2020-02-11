import { ReactNode } from 'react';
import { Channel } from '@storybook/channels';

import { API, State } from './index';
import Store from './store';

type IframeRenderer = (
  storyId: string,
  viewMode: State['viewMode'],
  id: string,
  baseUrl: string,
  scale: number,
  queryParams: Record<string, any>
) => ReactNode;

export interface Provider {
  channel?: Channel;
  renderPreview?: IframeRenderer;
  handleAPI(api: API): void;
  getConfig(): Record<string, any>;
  [key: string]: any;
}

export interface SubAPI {
  renderPreview?: Provider['renderPreview'];
}

export default ({ provider, api }: { provider: Provider; api: API; store: Store }) => {
  provider.handleAPI(api);

  if (provider.renderPreview) {
    // eslint-disable-next-line no-param-reassign
    api.renderPreview = provider.renderPreview;
  }

  return api;
};
