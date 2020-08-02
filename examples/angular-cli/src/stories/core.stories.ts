import { addParameters } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';

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
  component: Button,
  props: {
    text: `Parameters are ${JSON.stringify(parameters, null, 2)}`,
    onClick: () => 0,
  },
});

PassedToStory.storyName = 'passed to story';
PassedToStory.parameters = { storyParameter };
