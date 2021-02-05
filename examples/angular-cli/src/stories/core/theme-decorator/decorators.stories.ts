import { componentWrapperDecorator, Meta } from '@storybook/angular';

export default {
  title: 'Core / Theme Decorators',
  decorators: [
    componentWrapperDecorator(
      (story) => `<div [class]="myTheme">${story}</div>`,
      ({ globals }) => ({ myTheme: `${globals.theme}-theme` })
    ),
  ],
} as Meta;

export const Base = (args) => ({
  template: 'Change theme with the brush in toolbar',
  props: {
    ...args,
  },
});
