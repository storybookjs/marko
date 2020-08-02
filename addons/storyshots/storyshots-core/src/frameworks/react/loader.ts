import configure from '../configure';
import hasDependency from '../hasDependency';
import { Loader } from '../Loader';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'react' || (!options.framework && hasDependency('@storybook/react'));
}

function load(options: StoryshotsOptions) {
  const storybook = jest.requireActual('@storybook/react');

  configure({ ...options, storybook });

  return {
    framework: 'react' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: jest.requireActual('./renderShallowTree').default,
    storybook,
  };
}

const reactLoader: Loader = {
  load,
  test,
};

export default reactLoader;
