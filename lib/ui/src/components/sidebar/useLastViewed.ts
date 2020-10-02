import { window } from 'global';
import { useCallback, useEffect, useState } from 'react';

import { Selection, StoryRef } from './types';

const retrieveLastViewedStoryIds = (): StoryRef[] => {
  try {
    const raw = window.localStorage.getItem('lastViewedStoryIds');
    const val = typeof raw === 'string' && JSON.parse(raw);
    if (!val || !Array.isArray(val)) return [];
    if (!val.some((item) => typeof item === 'object' && item.storyId && item.refId)) return [];
    return val;
  } catch (e) {
    return [];
  }
};

const storeLastViewedStoryIds = (items: StoryRef[]) => {
  try {
    window.localStorage.setItem('lastViewedStoryIds', JSON.stringify(items));
  } catch (e) {
    // do nothing
  }
};

export const useLastViewed = (selection: Selection) => {
  const [lastViewed, setLastViewed] = useState(retrieveLastViewedStoryIds);

  const updateLastViewed = useCallback(
    (story: StoryRef) =>
      setLastViewed((state: StoryRef[]) => {
        const index = state.findIndex(
          ({ storyId, refId }) => storyId === story.storyId && refId === story.refId
        );
        if (index === 0) return state;
        const update =
          index === -1
            ? [story, ...state]
            : [story, ...state.slice(0, index), ...state.slice(index + 1)];
        storeLastViewedStoryIds(update);
        return update;
      }),
    []
  );

  useEffect(() => {
    if (selection) updateLastViewed(selection);
  }, [selection]);

  return lastViewed;
};
