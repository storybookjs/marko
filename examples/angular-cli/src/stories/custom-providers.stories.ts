import { moduleMetadata } from '@storybook/angular';
import { withKnobs, text } from '@storybook/addon-knobs';

import { DummyService } from './moduleMetadata/dummy.service';
import { ServiceComponent } from './moduleMetadata/service.component';

export default {
  title: 'Custom/Providers',
  component: ServiceComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      schemas: [],
      declarations: [],
      providers: [DummyService],
    }),
  ],
};

export const Simple = () => ({
  props: {
    name: 'Static name',
  },
});

Simple.storyName = 'Simple';

export const WithKnobsStory = () => {
  const name = text('name', 'Dynamic knob');

  return {
    props: {
      name,
    },
  };
};

WithKnobsStory.storyName = 'With knobs';
WithKnobsStory.decorators = [withKnobs];
