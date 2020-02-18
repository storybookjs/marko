import Hello from '../components/hello/index.marko';

export default {
  title: 'Main/Hello',
  parameters: {
    component: Hello,
  },
};

export const Simple = () => ({ input: { name: 'abc', age: 20 } });
