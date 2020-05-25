import { AppComponent } from '../app/app.component';

export default {
  title: 'App Component',
  component: AppComponent,
};

export const ComponentWithSeparateTemplate = () => ({
  component: AppComponent,
  props: {},
});

ComponentWithSeparateTemplate.storyName = 'Component with separate template';
ComponentWithSeparateTemplate.parameters = { docs: { iframeHeight: 400 } };
