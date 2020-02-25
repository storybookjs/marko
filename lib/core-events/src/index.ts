enum events {
  CHANNEL_CREATED = 'channelCreated',
  SET_CURRENT_STORY = 'setCurrentStory',
  // Slightly awkward name because the tense of "set" is not obvious
  CURRENT_STORY_WAS_SET = 'currentStoryWasSet',
  SET_STORIES = 'setStories',
  STORIES_CONFIGURED = 'storiesConfigured',
  SELECT_STORY = 'selectStory',
  PREVIEW_KEYDOWN = 'previewKeydown',
  STORY_ADDED = 'storyAdded',
  STORY_CHANGED = 'storyChanged',
  STORY_UNCHANGED = 'storyUnchanged',
  FORCE_RE_RENDER = 'forceReRender',
  REGISTER_SUBSCRIPTION = 'registerSubscription',
  STORY_INIT = 'storyInit',
  STORY_RENDER = 'storyRender',
  STORY_RENDERED = 'storyRendered',
  STORY_MISSING = 'storyMissing',
  STORY_ERRORED = 'storyErrored',
  STORY_THREW_EXCEPTION = 'storyThrewException',
  STORIES_COLLAPSE_ALL = 'storiesCollapseAll',
  STORIES_EXPAND_ALL = 'storiesExpandAll',
  DOCS_RENDERED = 'docsRendered',
  SHARED_STATE_CHANGED = 'sharedStateChanged',
  SHARED_STATE_SET = 'sharedStateSet',
  NAVIGATE_URL = 'navigateUrl',
}

// Enables: `import Events from ...`
export default events;

// Enables: `import * as Events from ...` or `import { CHANNEL_CREATED } as Events from ...`
// This is the preferred method
export const {
  CHANNEL_CREATED,
  SET_CURRENT_STORY,
  CURRENT_STORY_WAS_SET,
  SET_STORIES,
  STORIES_CONFIGURED,
  SELECT_STORY,
  PREVIEW_KEYDOWN,
  FORCE_RE_RENDER,
  REGISTER_SUBSCRIPTION,
  STORY_INIT,
  STORY_ADDED,
  STORY_RENDER,
  STORY_RENDERED,
  STORY_MISSING,
  STORY_ERRORED,
  STORY_CHANGED,
  STORIES_COLLAPSE_ALL,
  STORIES_EXPAND_ALL,
  STORY_THREW_EXCEPTION,
  DOCS_RENDERED,
  SHARED_STATE_CHANGED,
  SHARED_STATE_SET,
  NAVIGATE_URL,
} = events;
