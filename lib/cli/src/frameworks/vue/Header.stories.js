import MyHeader from './Header';

export default {
  title: 'Example/Header',
  component: MyHeader,
};

const Template = (args) => ({
  props: Object.keys(args),
  components: { MyHeader },
  template:
    '<my-header :user="user" @onLogin="onLogin" @onLogout="onLogout" @onCreateAccount="onCreateAccount" />',
});

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {},
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
