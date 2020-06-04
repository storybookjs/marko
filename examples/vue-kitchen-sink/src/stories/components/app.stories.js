import App from '../../App.vue';

export default {
  title: 'App',
  component: App,
  parameters: {
    layout: 'fullscreen',
  },
};

export const app = () => ({
  render: (h) => h(App),
});
app.storyName = 'App';
