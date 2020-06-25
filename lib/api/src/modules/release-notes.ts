import { RELEASE_NOTES_DATA } from 'global';
import memoize from 'memoizerific';

import { ModuleFn, State } from '../index';

export interface ReleaseNotes {
  success?: boolean;
  currentVersion?: string;
  showOnFirstLaunch?: boolean;
}

const getReleaseNotesData = memoize(1)(
  (): ReleaseNotes => {
    try {
      return { ...(JSON.parse(RELEASE_NOTES_DATA) || {}) };
    } catch (e) {
      return {};
    }
  }
);

export interface SubAPI {
  releaseNotesVersion: () => string;
  showReleaseNotesOnLaunch: () => Promise<boolean>;
}

export const init: ModuleFn = ({ fullAPI, store }) => {
  let initStoreState: Promise<State[]>;
  const releaseNotesData = getReleaseNotesData();

  const api: SubAPI = {
    releaseNotesVersion: () => releaseNotesData.currentVersion,
    showReleaseNotesOnLaunch: async () => {
      // Make sure any consumers of this function's return value have waited for
      // this module's state to have been setup. Otherwise, it may be called
      // before the store state is set and therefore have inaccurate data.
      await initStoreState;
      const { showReleaseNotesOnLaunch } = store.getState();
      return showReleaseNotesOnLaunch;
    },
  };

  const initModule = () => {
    const { releaseNotesViewed: persistedReleaseNotesViewed } = store.getState();
    let releaseNotesViewed = persistedReleaseNotesViewed || [];
    const didViewReleaseNotes = releaseNotesViewed.includes(releaseNotesData.currentVersion);
    const showReleaseNotesOnLaunch = releaseNotesData.showOnFirstLaunch && !didViewReleaseNotes;

    if (showReleaseNotesOnLaunch) {
      releaseNotesViewed = [...releaseNotesViewed, releaseNotesData.currentVersion];
    }

    initStoreState = Promise.all([
      store.setState({ showReleaseNotesOnLaunch }),
      store.setState({ releaseNotesViewed }, { persistence: 'permanent' }),
    ]);
  };

  return { init: initModule, api };
};
