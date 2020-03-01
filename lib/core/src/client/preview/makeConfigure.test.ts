import { ConfigApi, ClientApi, StoryStore } from '@storybook/client-api';
import { RequireContext } from './types';

import { makeConfigure } from './makeConfigure';

let cbs: ((data: any) => void)[];
let mod: NodeModule;
beforeEach(() => {
  cbs = [];
  mod = ({
    hot: {
      data: {},
      dispose: (cb: (data: any) => void) => cbs.push(cb),
    },
  } as unknown) as NodeModule;
});

function doHMRDispose() {
  cbs.forEach(cb => cb(mod.hot.data));
  cbs = [];
}

afterEach(() => {
  doHMRDispose();
});

function makeMocks() {
  const configApi = { configure: (x: Function) => x() };
  const storyStore = {
    removeStoryKind: jest.fn(),
    incrementRevision: jest.fn(),
  };
  const clientApi = {
    storiesOf: jest.fn().mockImplementation(() => ({
      addParameters: jest.fn(),
      addDecorator: jest.fn(),
      add: jest.fn(),
    })),
  };

  const context = { configApi, storyStore, clientApi };
  const configure = makeConfigure(context);
  return { ...context, configure };
}

function makeRequireContext(map: Record<string, any>): RequireContext {
  const context = (key: string) => map[key];

  return Object.assign(context, {
    keys: () => Object.keys(map),
    resolve: (key: string) => key,
  });
}

describe('core.preview.makeConfigure', () => {
  it('calls storiesOf and add correctly from CSF exports', () => {
    const { configure, clientApi } = makeMocks();

    const input = {
      a: {
        default: {
          title: 'a',
        },
        1: () => 0,
        2: () => 0,
      },
      b: {
        default: {
          title: 'b',
        },
        1: () => 0,
        2: Object.assign(() => 0, { story: { name: 'two' } }),
      },
    };
    configure(makeRequireContext(input), mod, 'react');

    expect(clientApi.storiesOf).toHaveBeenCalledWith('a', true);
    const aApi = clientApi.storiesOf.mock.results[0].value;
    expect(aApi.add).toHaveBeenCalledWith('1', input.a[1], { __id: 'a--1' });
    expect(aApi.add).toHaveBeenCalledWith('2', input.a[2], { __id: 'a--2' });

    expect(clientApi.storiesOf).toHaveBeenCalledWith('b', true);
    const bApi = clientApi.storiesOf.mock.results[1].value;
    expect(bApi.add).toHaveBeenCalledWith('1', input.b[1], { __id: 'b--1' });
    expect(bApi.add).toHaveBeenCalledWith('two', input.b[2], { __id: 'b--2' });
  });

  it('adds stories in the right order if __namedExportsOrder is supplied', () => {
    const { configure, clientApi } = makeMocks();

    const input = {
      a: {
        default: {
          title: 'a',
        },
        // Note the export order doesn't work if the exports are numbers
        x: () => 0,
        y: () => 0,
        z: () => 0,
        w: () => 0,
        __namedExportsOrder: ['w', 'x', 'z', 'y'],
      },
    };
    configure(makeRequireContext(input), mod, 'react');

    const aApi = clientApi.storiesOf.mock.results[0].value;
    expect(aApi.add.mock.calls.map((c: string[]) => c[0])).toEqual(['W', 'X', 'Z', 'Y']);
  });

  it('filters exports using includeStories', () => {
    const { configure, clientApi } = makeMocks();

    const input = {
      a: {
        default: {
          title: 'a',
          includeStories: ['x', 'z'],
        },
        // Note the export order doesn't work if the exports are numbers
        x: () => 0,
        y: () => 0,
        z: () => 0,
        w: () => 0,
      },
    };
    configure(makeRequireContext(input), mod, 'react');

    const aApi = clientApi.storiesOf.mock.results[0].value;
    expect(aApi.add.mock.calls.map((c: string[]) => c[0])).toEqual(['X', 'Z']);
  });

  it('filters exports using excludeStories', () => {
    const { configure, clientApi } = makeMocks();

    const input = {
      a: {
        default: {
          title: 'a',
          excludeStories: ['x', 'z'],
        },
        x: () => 0,
        y: () => 0,
        z: () => 0,
        w: () => 0,
      },
    };
    configure(makeRequireContext(input), mod, 'react');

    const aApi = clientApi.storiesOf.mock.results[0].value;
    expect(aApi.add.mock.calls.map((c: string[]) => c[0])).toEqual(['Y', 'W']);
  });

  it('allows setting componentId', () => {
    const { configure, clientApi } = makeMocks();

    const input = {
      a: {
        default: {
          title: 'a',
          id: 'random',
        },
        x: () => 0,
      },
    };
    configure(makeRequireContext(input), mod, 'react');

    const aApi = clientApi.storiesOf.mock.results[0].value;
    expect(aApi.add).toHaveBeenCalledWith('X', input.a.x, { __id: 'random--x' });
  });

  it('sets various parameters on components', () => {
    const { configure, clientApi } = makeMocks();

    const input = {
      a: {
        default: {
          title: 'a',
          component: 'c',
          subcomponents: 'scs',
        },
      },
    };
    configure(makeRequireContext(input), mod, 'react');

    const aApi = clientApi.storiesOf.mock.results[0].value;
    expect(aApi.addParameters).toHaveBeenCalledWith({
      framework: 'react',
      component: 'c',
      subcomponents: 'scs',
      fileName: 'a',
    });
  });

  it('allows setting component parameters and decorators', () => {
    const { configure, clientApi } = makeMocks();

    const decorator = jest.fn();
    const input = {
      a: {
        default: {
          title: 'a',
          parameters: { x: 'y' },
          decorators: [decorator],
        },
        x: () => 0,
      },
    };
    configure(makeRequireContext(input), mod, 'react');

    const aApi = clientApi.storiesOf.mock.results[0].value;
    expect(aApi.addParameters).toHaveBeenCalledWith(expect.objectContaining({ x: 'y' }));
    expect(aApi.addDecorator).toHaveBeenCalledWith(decorator);
  });

  it('allows setting story parameters and decorators', () => {
    const { configure, clientApi } = makeMocks();

    const decorator = jest.fn();
    const input = {
      a: {
        default: {
          title: 'a',
        },
        x: Object.assign(() => 0, {
          story: {
            parameters: { x: 'y' },
            decorators: [decorator],
          },
        }),
      },
    };
    configure(makeRequireContext(input), mod, 'react');

    const aApi = clientApi.storiesOf.mock.results[0].value;
    expect(aApi.add).toHaveBeenCalledWith('X', input.a.x, {
      x: 'y',
      decorators: [decorator],
      __id: 'a--x',
    });
  });

  it('allows passing decorators on parameters (deprecated)', () => {
    const { configure, clientApi } = makeMocks();

    const decorator = jest.fn();
    const input = {
      a: {
        default: {
          title: 'a',
        },
        x: Object.assign(() => 0, { story: { parameters: { decorators: [decorator] } } }),
      },
    };
    configure(makeRequireContext(input), mod, 'react');

    const aApi = clientApi.storiesOf.mock.results[0].value;
    expect(aApi.add).toHaveBeenCalledWith('X', input.a.x, {
      decorators: [decorator],
      __id: 'a--x',
    });
  });

  it('handles HMR correctly when adding stories', () => {
    const { configure, clientApi, storyStore } = makeMocks();

    const firstInput = {
      a: {
        default: {
          title: 'a',
        },
        x: () => 0,
      },
    };
    configure(makeRequireContext(firstInput), mod, 'react');

    // HMR dispose callbacks
    doHMRDispose();

    clientApi.storiesOf.mockClear();
    const secondInput = {
      ...firstInput,
      b: {
        default: {
          title: 'b',
        },
        x: () => 0,
      },
    };
    configure(makeRequireContext(secondInput), mod, 'react');

    expect(storyStore.removeStoryKind).not.toHaveBeenCalled();
    expect(storyStore.incrementRevision).not.toHaveBeenCalled();
    expect(clientApi.storiesOf).toHaveBeenCalledWith('b', true);
  });

  it('handles HMR correctly when removing stories', () => {
    const { configure, clientApi, storyStore } = makeMocks();

    const firstInput = {
      a: {
        default: {
          title: 'a',
        },
        x: () => 0,
      },
      b: {
        default: {
          title: 'b',
        },
        x: () => 0,
      },
    };
    configure(makeRequireContext(firstInput), mod, 'react');

    // HMR dispose callbacks
    doHMRDispose();

    clientApi.storiesOf.mockClear();
    const secondInput = {
      a: firstInput.a,
    };
    configure(makeRequireContext(secondInput), mod, 'react');

    expect(storyStore.removeStoryKind).toHaveBeenCalledWith('b');
    expect(storyStore.incrementRevision).toHaveBeenCalled();
    expect(clientApi.storiesOf).not.toHaveBeenCalled();
  });

  it('handles HMR correctly when changing stories', () => {
    const { configure, clientApi, storyStore } = makeMocks();

    const firstInput = {
      a: {
        default: {
          title: 'a',
        },
        x: () => 0,
      },

      b: {
        default: {
          title: 'b',
        },
        x: () => 0,
      },
    };
    configure(makeRequireContext(firstInput), mod, 'react');

    // HMR dispose callbacks
    doHMRDispose();

    clientApi.storiesOf.mockClear();
    const secondInput = {
      ...firstInput,
      a: {
        default: {
          title: 'a',
        },
        x: () => 0,
        y: () => 0,
      },
    };
    configure(makeRequireContext(secondInput), mod, 'react');

    expect(storyStore.removeStoryKind).toHaveBeenCalledTimes(1);
    expect(storyStore.removeStoryKind).toHaveBeenCalledWith('a');
    expect(storyStore.incrementRevision).toHaveBeenCalled();
    expect(clientApi.storiesOf).toHaveBeenCalledWith('a', true);
  });
});
