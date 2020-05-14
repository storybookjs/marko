import { history, document } from 'global';

import { StoryStore } from '@storybook/client-api';

import {
  pathToId,
  setPath,
  getIdFromLegacyQuery,
  parseQueryParameters,
  initializePath,
} from './url';

jest.mock('global', () => ({
  history: { replaceState: jest.fn() },
  document: {
    location: {
      pathname: 'pathname',
      search: '',
    },
  },
}));

describe('url', () => {
  describe('pathToId', () => {
    it('should parse valid ids', () => {
      expect(pathToId('/story/story--id')).toEqual('story--id');
    });
    it('should error on invalid ids', () => {
      [null, '', '/whatever/story/story--id'].forEach((path) => {
        expect(() => pathToId(path)).toThrow(/Invalid/);
      });
    });
  });

  describe('setPath', () => {
    it('should navigate to storyId', () => {
      setPath({ storyId: 'story--id', viewMode: 'story' });
      expect(history.replaceState).toHaveBeenCalledWith(
        {},
        '',
        'pathname?id=story--id&viewMode=story'
      );
    });
    it('should replace legacy parameters but preserve others', () => {
      document.location.search = 'foo=bar&selectedStory=selStory&selectedKind=selKind';
      setPath({ storyId: 'story--id', viewMode: 'story' });
      expect(history.replaceState).toHaveBeenCalledWith(
        {},
        '',
        'pathname?foo=bar&id=story--id&viewMode=story'
      );
    });
  });

  describe('getIdFromLegacyQuery', () => {
    const getRawStory = () => {};
    const store: unknown = { getRawStory };
    it('should parse story paths', () => {
      expect(getIdFromLegacyQuery({ path: '/story/story--id' }, store as StoryStore)).toBe(
        'story--id'
      );
    });
    it('should use legacy parameters to look up custom story ids', () => {
      const customStore: unknown = {
        getRawStory: () => ({ id: 'custom--id' }),
      };
      expect(
        getIdFromLegacyQuery(
          { selectedKind: 'kind', selectedStory: 'story' },
          customStore as StoryStore
        )
      ).toBe('custom--id');
    });
    it('should use fall-back behavior for legacy queries for unknown stories', () => {
      expect(
        getIdFromLegacyQuery(
          { path: null, selectedKind: 'kind', selectedStory: 'story' },
          store as StoryStore
        )
      ).toBe('kind--story');
    });

    it('should not parse non-queries', () => {
      expect(getIdFromLegacyQuery({}, store as StoryStore)).toBeUndefined();
    });
  });

  describe('parseQueryParameters', () => {
    it('should parse id', () => {
      expect(parseQueryParameters('?foo=bar&id=story--id')).toBe('story--id');
    });
    it('should not parse non-ids', () => {
      expect(parseQueryParameters('')).toBeUndefined();
    });
  });

  describe('initializePath', () => {
    const getRawStory = () => {};
    const store: unknown = { getRawStory };
    it('should handle id queries', () => {
      document.location.search = '?id=story--id';
      expect(initializePath(store as StoryStore)).toEqual({
        storyId: 'story--id',
        viewMode: 'story',
      });
      expect(history.replaceState).not.toHaveBeenCalled();
    });
    it('should redirect legacy queries', () => {
      document.location.search = '?selectedKind=kind&selectedStory=story';
      expect(initializePath(store as StoryStore)).toEqual({
        storyId: 'kind--story',
        viewMode: 'story',
      });
      expect(history.replaceState).toHaveBeenCalledWith(
        {},
        '',
        'pathname?id=kind--story&viewMode=story'
      );
    });
  });
});
