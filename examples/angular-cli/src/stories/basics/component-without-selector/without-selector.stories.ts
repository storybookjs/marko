import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { WithoutSelectorComponent, WITHOUT_SELECTOR_DATA } from './without-selector.component';

export default {
  title: 'Basics / Component / without selector',
  component: WithoutSelectorComponent,
  decorators: [
    moduleMetadata({
      entryComponents: [WithoutSelectorComponent],
    }),
  ],
} as Meta;

export const SimpleComponent: Story = () => ({});

// Live changing of args by controls does not work for now. When changing args storybook does not fully
// reload and therefore does not take into account the change of provider.
export const WithInjectionTokenAndArgs: Story = (args) => ({
  props: args,
  moduleMetadata: {
    providers: [
      { provide: WITHOUT_SELECTOR_DATA, useValue: { color: args.color, name: args.name } },
    ],
  },
});
WithInjectionTokenAndArgs.argTypes = {
  name: { control: 'text' },
  color: { control: 'color' },
};
WithInjectionTokenAndArgs.args = { name: 'Dixie Normous', color: 'red' };
