import { moduleMetadata } from '@storybook/angular';
import { withKnobs, text } from '@storybook/addon-knobs';

import { CustomPipePipe } from './custom.pipe';
import { WithPipeComponent } from './with-pipe.component';

export default {
  title: 'Basics / Component with / Pipes',
  component: WithPipeComponent,
  decorators: [
    moduleMetadata({
      declarations: [CustomPipePipe],
    }),
  ],
};

export const Simple = () => ({
  props: {
    field: 'foobar',
  },
});

Simple.storyName = 'Simple';

export const WithKnobsStory = () => ({
  props: {
    field: text('field', 'foobar'),
  },
});

WithKnobsStory.storyName = 'With Knobs';
WithKnobsStory.decorators = [withKnobs];
