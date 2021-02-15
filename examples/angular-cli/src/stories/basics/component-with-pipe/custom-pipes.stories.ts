import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { CustomPipePipe } from './custom.pipe';
import { WithPipeComponent } from './with-pipe.component';

export default {
  title: 'Basics / Component / With Pipes',
  component: WithPipeComponent,
  decorators: [
    moduleMetadata({
      declarations: [CustomPipePipe],
    }),
  ],
} as Meta;

export const Simple: Story = () => ({
  props: {
    field: 'foobar',
  },
});

Simple.storyName = 'Simple';

export const WithArgsStory: Story = (args) => ({
  props: args,
});
WithArgsStory.storyName = 'With args';
WithArgsStory.argTypes = {
  field: { control: 'text' },
};
WithArgsStory.args = {
  field: 'Foo Bar',
};
