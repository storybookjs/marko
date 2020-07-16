import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

import Button from './button.component';
import Header from './header.component';

export default {
  title: 'Example/Header',
  component: Header,
  decorators: [
    moduleMetadata({
      declarations: [Button],
      imports: [CommonModule],
    }),
  ],
};

const Template = (args: Header) => ({
  component: Header,
  props: args,
});

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {},
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
