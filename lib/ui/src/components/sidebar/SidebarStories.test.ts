import { viewMode } from './SidebarStories';

describe('viewMode', () => {
  it('always links to parameters.viewMode if one is provided', () => {
    expect(viewMode('foo', true, { viewMode: 'bar' })).toEqual('bar');
  });
  it('links to "docs" view mode for docs-only stories', () => {
    expect(viewMode('foo', true, undefined)).toEqual('docs');
  });
  it('links to "story" viewMode there is no viewMode specified or not on a docs page', () => {
    expect(viewMode(undefined, false, undefined)).toEqual('story');
    expect(viewMode('settings', false, undefined)).toEqual('story');
  });
  it('links to the current viewMode by default', () => {
    expect(viewMode('foo', false, undefined)).toEqual('foo');
    expect(viewMode('story', false, undefined)).toEqual('story');
    expect(viewMode('docs', false, undefined)).toEqual('docs');
  });
});
