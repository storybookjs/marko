import { document, window } from 'global';
import Events from '@storybook/core-events';

import start from './start';

jest.mock('@storybook/client-logger');
jest.mock('global', () => ({
  history: { replaceState: jest.fn() },
  navigator: { userAgent: 'browser', platform: '' },
  window: {
    __STORYBOOK_CLIENT_API__: undefined,
    addEventListener: jest.fn(),
    location: { search: '' },
    history: { replaceState: jest.fn() },
    matchMedia: jest.fn().mockReturnValue({ matches: false }),
  },
  document: {
    addEventListener: jest.fn(),
    getElementById: jest.fn().mockReturnValue({}),
    body: { classList: { add: jest.fn(), remove: jest.fn() }, style: {} },
    documentElement: {},
    location: { search: '?id=kind--story' },
  },
}));

afterEach(() => {
  window.__STORYBOOK_CLIENT_API__ = undefined;
});

it('returns apis', () => {
  const render = jest.fn();

  const result = start(render);

  expect(result).toEqual(
    expect.objectContaining({
      configure: expect.any(Function),
      channel: expect.any(Object),
      clientApi: expect.any(Object),
      configApi: expect.any(Object),
      forceReRender: expect.any(Function),
    })
  );
});

it('reuses the current client api when the lib is reloaded', () => {
  jest.useFakeTimers();
  const render = jest.fn();

  const { clientApi } = start(render);

  const valueOfClientApi = window.__STORYBOOK_CLIENT_API__;

  const { clientApi: newClientApi, channel } = start(render);

  channel.emit(Events.SET_STORIES, {});

  expect(clientApi).toEqual(newClientApi);
  expect(clientApi).toEqual(valueOfClientApi);
});

it('calls render when you add a story', () => {
  jest.useFakeTimers();
  const render = jest.fn();

  const { clientApi, configApi, channel } = start(render);

  configApi.configure(() => {
    clientApi.storiesOf('kind', {} as NodeModule).add('story', () => {});
  }, {} as NodeModule);

  channel.emit(Events.SET_STORIES, {});

  expect(render).toHaveBeenCalledWith(expect.objectContaining({ kind: 'kind', name: 'story' }));
});

it('emits an exception and shows error when your story throws', () => {
  jest.useFakeTimers();
  const render = jest.fn();

  const { clientApi, configApi, channel } = start(render);

  configApi.configure(() => {
    clientApi.storiesOf('kind', {} as NodeModule).add('story1', () => {});
  }, {} as NodeModule);

  channel.emit(Events.SET_STORIES, {});

  expect(render).not.toHaveBeenCalled();
  expect(document.body.classList.add).toHaveBeenCalledWith('sb-show-nopreview');
});

it('emits an error and shows error when your framework calls showError', () => {
  jest.useFakeTimers();
  const error = {
    title: 'Some error',
    description: 'description',
  };
  const render = jest.fn().mockImplementation(({ showError }) => {
    showError(error);
  });

  const { clientApi, configApi, channel } = start(render);

  configApi.configure(() => {
    clientApi.storiesOf('kind', {} as NodeModule).add('story', () => {});
  }, {} as NodeModule);

  channel.emit(Events.SET_STORIES, {});

  expect(render).toHaveBeenCalled();
  expect(document.body.classList.add).toHaveBeenCalledWith('sb-show-errordisplay');
});
