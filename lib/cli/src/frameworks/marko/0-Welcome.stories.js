import Welcome from './welcome.marko';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const welcome = () => ({ component: Welcome });
