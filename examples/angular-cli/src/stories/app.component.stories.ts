import { AppComponent } from '../app/app.component';

export default {
  title: 'App Component',
  component: AppComponent,
  parameters: {
    layout: 'fullscreen',
  },
};

export const ComponentWithSeparateTemplate = () => ({});

ComponentWithSeparateTemplate.storyName = 'Component with fullscreen parameters';
ComponentWithSeparateTemplate.parameters = { docs: { iframeHeight: 400 } };
