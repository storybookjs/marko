import { Story, Meta } from '@storybook/angular';
import { linkTo } from '@storybook/addon-links';
import { AppComponent } from '../app/app.component';

export default {
  title: 'Welcome/ To Angular',
} as Meta;

export const toAngular: Story = () => ({
  component: AppComponent,
  props: {
    showApp: linkTo('Button'),
  },
});
