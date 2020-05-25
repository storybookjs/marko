import { tag, mount, addParameters } from '@storybook/riot';

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

tag(
  'parameters',
  '<div>Parameters are <pre>{JSON.stringify(this.opts, null, 2)}</pre></div>',
  '',
  '',
  () => {}
);

addParameters({ globalParameter });

export default {
  title: 'Core/Parameters',
  parameters: {
    chapterParameter,
  },
};

export const PassedToStory = (_args, { parameters: { fileName, ...parameters } }) =>
  mount('parameters', { ...parameters, storyParameter });

PassedToStory.storyName = 'passed to story';
