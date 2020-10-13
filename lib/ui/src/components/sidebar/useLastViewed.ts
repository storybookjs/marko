import { useCallback, useEffect, useState } from 'react';
import store from 'store2';

import { Selection, StoryRef } from './types';

const retrieveLastViewedStoryIds = (): StoryRef[] => {
  const items = store.get('lastViewedStoryIds');
  if (!items || !Array.isArray(items)) return [];
  if (!items.some((item) => typeof item === 'object' && item.storyId && item.refId)) return [];
  return items;
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
        store.set('lastViewedStoryIds', update);
        return update;
      }),
    []
  );

  const clearLastViewed = useCallback(() => {
    setLastViewed([]);
    store.set('lastViewedStoryIds', []);
  }, []);

  useEffect(() => {
    if (selection) updateLastViewed(selection);
  }, [selection]);

  return { lastViewed, clearLastViewed };
};
