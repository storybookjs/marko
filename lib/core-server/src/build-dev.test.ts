import { getReleaseNotesData, RELEASE_NOTES_CACHE_KEY } from './utils/release-notes';

describe('getReleaseNotesData', () => {
  it('handles errors gracefully', async () => {
    const version = '4.0.0';
    // The cache is missing necessary functions. This will cause an error.
    const cache = {};

    expect(await getReleaseNotesData(version, cache)).toEqual({
      currentVersion: version,
      showOnFirstLaunch: false,
      success: false,
    });
  });

  it('does not show the release notes on first build', async () => {
    const version = '4.0.0';
    const set = jest.fn((...args: any[]) => Promise.resolve());
    const cache = { get: () => Promise.resolve([]), set };

    expect(await getReleaseNotesData(version, cache)).toEqual({
      currentVersion: version,
      showOnFirstLaunch: false,
      success: true,
    });
    expect(set).toHaveBeenCalledWith(RELEASE_NOTES_CACHE_KEY, ['4.0.0']);
  });

  it('shows the release notes after upgrading a major version', async () => {
    const version = '4.0.0';
    const set = jest.fn((...args: any[]) => Promise.resolve());
    const cache = { get: () => Promise.resolve(['3.0.0']), set };

    expect(await getReleaseNotesData(version, cache)).toEqual({
      currentVersion: version,
      showOnFirstLaunch: true,
      success: true,
    });
    expect(set).toHaveBeenCalledWith(RELEASE_NOTES_CACHE_KEY, ['3.0.0', '4.0.0']);
  });

  it('shows the release notes after upgrading a minor version', async () => {
    const version = '4.1.0';
    const set = jest.fn((...args: any[]) => Promise.resolve());
    const cache = { get: () => Promise.resolve(['4.0.0']), set };

    expect(await getReleaseNotesData(version, cache)).toEqual({
      currentVersion: version,
      showOnFirstLaunch: true,
      success: true,
    });
    expect(set).toHaveBeenCalledWith(RELEASE_NOTES_CACHE_KEY, ['4.0.0', '4.1.0']);
  });

  it('transforms patch versions to the closest major.minor version', async () => {
    const version = '4.0.1';
    const set = jest.fn((...args: any[]) => Promise.resolve());
    const cache = { get: () => Promise.resolve(['4.0.0']), set };

    expect(await getReleaseNotesData(version, cache)).toEqual({
      currentVersion: '4.0.0',
      showOnFirstLaunch: false,
      success: true,
    });
    expect(set).not.toHaveBeenCalled();
  });

  it('does not show release notes when downgrading', async () => {
    const version = '3.0.0';
    const set = jest.fn((...args: any[]) => Promise.resolve());
    const cache = { get: () => Promise.resolve(['4.0.0']), set };

    expect(await getReleaseNotesData(version, cache)).toEqual({
      currentVersion: '3.0.0',
      showOnFirstLaunch: false,
      success: true,
    });
    expect(set).toHaveBeenCalledWith(RELEASE_NOTES_CACHE_KEY, ['4.0.0', '3.0.0']);
  });
});
