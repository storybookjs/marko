import { State, API } from '@storybook/api';
import { FunctionComponent, ReactNode } from 'react';

export type ViewMode = State['viewMode'];

export interface PreviewProps {
  api: API;
  storyId: string;
  viewMode: ViewMode;
  docsOnly: boolean;
  options: {
    isFullscreen: boolean;
    isToolshown: boolean;
  };
  id: string;
  path: string;
  location: State['location'];
  queryParams: State['customQueryParams'];
  customCanvas?: IframeRenderer;
  description: string;
  baseUrl: string;
  parameters: Record<string, any>;
  withLoader: boolean;
}

export interface WrapperProps {
  index: number;
  children: ReactNode;
  id: string;
  storyId: string;
  active: boolean;
}

export type Wrapper = {
  render: FunctionComponent<WrapperProps>;
};

export interface ApplyWrappersProps {
  wrappers: Wrapper[];
  viewMode: State['viewMode'];
  id: string;
  storyId: string;
  active: boolean;
  baseUrl: string;
  scale: number;
  queryParams: Record<string, any>;
  customCanvas?: IframeRenderer;
}

export type IframeRenderer = (
  storyId: string,
  viewMode: State['viewMode'],
  id: string,
  baseUrl: string,
  scale: number,
  queryParams: Record<string, any>
) => ReactNode;
