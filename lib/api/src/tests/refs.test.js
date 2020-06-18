import { fetch } from 'global';
import { getSourceType, init as initRefs } from '../modules/refs';

jest.mock('global', () => {
  const globalMock = {
    fetch: jest.fn(() => Promise.resolve({})),
  };
  // Change global.location value to handle edge cases
  // Add additional variations of global.location mock return values in this array.
  // NOTE: The order must match the order that global.location is called in the unit tests.
  const edgecaseLocations = [
    { origin: 'https://storybook.js.org', pathname: '/storybook/index.html' },
  ];
  // global.location value after all edgecaseLocations are returned
  const lastLocation = { origin: 'https://storybook.js.org', pathname: '/storybook/' };
  Object.defineProperties(globalMock, {
    location: {
      get: edgecaseLocations
        .reduce((mockFn, location) => mockFn.mockReturnValueOnce(location), jest.fn())
        .mockReturnValue(lastLocation),
    },
  });
  return globalMock;
});

const provider = {
  getConfig: () => ({
    refs: {
      fake: {
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      },
    },
  }),
};

const store = {
  getState: () => ({
    refs: {
      fake: {
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      },
    },
  }),
  setState: jest.fn(() => {
    // console.log('setState!');
  }),
};

describe('Refs API', () => {
  describe('getSourceType(source)', () => {
    // These tests must be run first and in correct order.
    // The order matches the "edgecaseLocations" order in the 'global' mock function above.
    describe('edge cases', () => {
      it('returns "local" when source matches location with /index.html in path', () => {
        // mockReturnValue(edgecaseLocations[0])
        expect(getSourceType('https://storybook.js.org/storybook/iframe.html')).toEqual([
          'local',
          'https://storybook.js.org/storybook',
        ]);
      });
      it('returns "correct url" when source does not match location', () => {
        expect(getSourceType('https://external.com/storybook/')).toEqual([
          'external',
          'https://external.com/storybook',
        ]);
      });
    });
    // Other tests use "lastLocation" for the 'global' mock
    it('returns "local" when source matches location', () => {
      expect(getSourceType('https://storybook.js.org/storybook/iframe.html')).toEqual([
        'local',
        'https://storybook.js.org/storybook',
      ]);
    });
    it('returns "external" when source does not match location', () => {
      expect(getSourceType('https://external.com/storybook/iframe.html')).toEqual([
        'external',
        'https://external.com/storybook',
      ]);
    });
  });

  describe('checkRef', () => {
    it('on initialization it checks refs', async () => {
      // given
      initRefs({ provider, store });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "omit",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/iframe.html",
            Object {
              "cors": "no-cors",
              "credentials": "omit",
            },
          ],
        ]
      `);
    });

    it('checks refs (all fail)', async () => {
      // given
      const { api } = initRefs({ provider, store });

      fetch.mockClear();
      store.setState.mockClear();

      const result = await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "omit",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/iframe.html",
            Object {
              "cors": "no-cors",
              "credentials": "omit",
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "error": Object {
                "message": "Error: Loading of ref failed
          at fetch (lib/api/src/modules/refs.ts)

        URL: https://example.com

        We weren't able to load the above URL,
        it's possible a CORS error happened.

        Please check your dev-tools network tab.",
              },
              "id": "fake",
              "ready": false,
              "stories": undefined,
              "title": "Fake",
              "type": "auto-inject",
              "url": "https://example.com",
            },
          },
        }
      `);
    });

    it('checks refs (success)', async () => {
      // given
      const { api } = initRefs({ provider, store });

      fetch.mockClear();
      store.setState.mockClear();

      fetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              stories: {},
            }),
        })
      );

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "omit",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/iframe.html",
            Object {
              "cors": "no-cors",
              "credentials": "omit",
            },
          ],
          Array [
            "https://example.com/metadata.json",
            Object {
              "cache": "no-cache",
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[1][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "id": "fake",
              "ready": false,
              "stories": Object {},
              "title": "Fake",
              "type": "lazy",
              "url": "https://example.com",
            },
          },
        }
      `);
    });

    it('checks refs (auth)', async () => {
      // given
      const { api } = initRefs({ provider, store });

      fetch.mockClear();
      store.setState.mockClear();

      fetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              loginUrl: 'https://example.com/login',
            }),
        })
      );

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "omit",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/iframe.html",
            Object {
              "cors": "no-cors",
              "credentials": "omit",
            },
          ],
          Array [
            "https://example.com/metadata.json",
            Object {
              "cache": "no-cache",
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/metadata.json",
            Object {
              "cache": "no-cache",
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[1][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "id": "fake",
              "loginUrl": "https://example.com/login",
              "ready": false,
              "stories": undefined,
              "title": "Fake",
              "type": "auto-inject",
              "url": "https://example.com",
            },
          },
        }
      `);
    });
  });
});
