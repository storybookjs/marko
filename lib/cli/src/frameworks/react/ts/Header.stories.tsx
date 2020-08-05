import React from 'react';

import { Header, HeaderProps } from './Header';

export default {
  title: 'Example/Header',
  component: Header,
};

const Template = (args: HeaderProps) => <Header {...args} />;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {},
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
