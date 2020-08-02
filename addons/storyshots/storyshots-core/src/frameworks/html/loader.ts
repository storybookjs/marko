import global from 'global';
import configure from '../configure';
import { Loader } from '../Loader';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'html';
}

function load(options: StoryshotsOptions) {
  global.STORYBOOK_ENV = 'html';

  const storybook = jest.requireActual('@storybook/html');

  configure({ ...options, storybook });

  return {
    framework: 'html' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for HTML');
    },
    storybook,
  };
}

const htmLoader: Loader = {
  load,
  test,
};

export default htmLoader;
