import { addParameters } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';
import { Story, Meta } from '@storybook/angular/types-6-0';

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

addParameters({ globalParameter });

export default {
  title: 'Core / Parameters / All parameters',
  parameters: {
    chapterParameter,
  },
} as Meta;

export const PassedToStory: Story = (_args, { parameters: { fileName, ...parameters } }) => ({
  component: Button,
  props: {
    text: `Parameters are ${JSON.stringify(parameters, null, 2)}`,
    onClick: () => 0,
  },
});

PassedToStory.storyName = 'All parameters passed to story';
PassedToStory.parameters = { storyParameter };
