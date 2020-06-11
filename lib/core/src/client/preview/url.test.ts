import { history, document } from 'global';

import { pathToId, setPath, parseQueryParameters, getSelectionSpecifierFromPath } from './url';

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

  describe('parseQueryParameters', () => {
    it('should parse id', () => {
      expect(parseQueryParameters('?foo=bar&id=story--id')).toBe('story--id');
    });
    it('should not parse non-ids', () => {
      expect(parseQueryParameters('')).toBeUndefined();
    });
  });

  describe('getSelectionSpecifierFromPath', () => {
    it('should handle no search', () => {
      document.location.search = '';
      expect(getSelectionSpecifierFromPath()).toEqual(null);
    });
    it('should handle id queries', () => {
      document.location.search = '?id=story--id';
      expect(getSelectionSpecifierFromPath()).toEqual({
        storySpecifier: 'story--id',
        viewMode: 'story',
      });
    });
    it('should handle id queries with *', () => {
      document.location.search = '?id=*';
      expect(getSelectionSpecifierFromPath()).toEqual({
        storySpecifier: '*',
        viewMode: 'story',
      });
    });
    it('should redirect legacy queries', () => {
      document.location.search = '?selectedKind=kind&selectedStory=story';
      expect(getSelectionSpecifierFromPath()).toEqual({
        storySpecifier: { kind: 'kind', name: 'story' },
        viewMode: 'story',
      });
    });
  });
});
