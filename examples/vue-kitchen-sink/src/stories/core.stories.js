import { addParameters } from '@storybook/vue';

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

addParameters({ globalParameter });

export default {
  title: 'Core/Parameters',
  parameters: {
    chapterParameter,
  },
};

export const PassedToStory = (_args, { parameters: { fileName, ...parameters } }) => ({
  template: `<div>Parameters are <pre>${JSON.stringify(parameters, null, 2)}</pre></div>`,
});

PassedToStory.storyName = 'passed to story';

PassedToStory.parameters = {
  storyParameter,
};
