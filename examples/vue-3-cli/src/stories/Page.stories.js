import MyPage from './Page.vue';
import * as HeaderStories from './Header.stories';

export default {
  title: 'Example/Page',
  component: MyPage,
};

// If your props are optional and don't always exist in argTypes,
// you can specify them explicitly as you normally specify props
const Template = () => ({
  props: ['user'],
  components: { MyPage },
  template: '<my-page :user="user" />',
});

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  ...HeaderStories.LoggedIn.args,
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
