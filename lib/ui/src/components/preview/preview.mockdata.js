import { types } from '@storybook/addons';

export const previewProps = {
  id: 'string',
  api: {
    on: () => {},
    emit: () => {},
    off: () => {},
  },
  storyId: 'string',
  path: 'string',
  viewMode: 'story',
  location: {},
  baseUrl: 'http://example.com',
  queryParams: {},
  getElements: type =>
    type === types.TAB
      ? [
          {
            id: 'notes',
            type: types.TAB,
            title: 'Notes',
            route: ({ storyId }) => `/info/${storyId}`,
            match: ({ viewMode }) => viewMode === 'info',
            render: () => null,
          },
        ]
      : [],
  options: {
    isFullscreen: false,
    isToolshown: true,
  },
  actions: {},
  withLoader: false,
};
