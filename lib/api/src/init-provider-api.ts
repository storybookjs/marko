import { ReactNode } from 'react';
import { Channel } from '@storybook/channels';
import { ThemeVars } from '@storybook/theming';

import { API, State } from './index';
import Store from './store';
import { UIOptions } from './modules/layout';

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
  getConfig(): {
    theme?: ThemeVars;
    [k: string]: any;
  } & Partial<UIOptions>;
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
};
