import { AppComponent } from '../app/app.component';

export default {
  title: 'App Component',
  component: AppComponent,
  parameters: {
    layout: 'fullscreen',
  },
};

export const ComponentWithSeparateTemplate = () => ({
  component: AppComponent,
  props: {},
});

ComponentWithSeparateTemplate.story = {
  name: 'Component with separate template',
  parameters: { docs: { iframeHeight: 400 } },
};
