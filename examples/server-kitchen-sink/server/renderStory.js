const stories = require('./stories');
const templates = require('./templates');

const renderStory = (component, story, params) => {
  const template = templates[component];
  const defaultParams = stories[component][story];

  return template({ ...defaultParams, ...params });
};

module.exports = renderStory;
