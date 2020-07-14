/** @jsx h */
import { h } from 'preact';
import { action } from '@storybook/addon-actions';
import { Header } from './Header';

export default {
  title: 'Example/Header',
  component: Header,
};

const Template = (args) => <Header {...args} />;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {},
  onLogin: action('onLogin'),
  onLogout: action('onLogout'),
  onCreateAccount: action('onCreateAccount'),
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  onLogin: action('onLogin'),
  onLogout: action('onLogout'),
  onCreateAccount: action('onCreateAccount'),
};
