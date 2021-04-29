import { DocInjectableService } from './doc-injectable.service';

export default {
  title: 'Addons/Docs/DocInjectable',
  component: DocInjectableService,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};

const modules = {
  provider: [DocInjectableService],
};

export const Basic = () => ({
  moduleMetadata: modules,
  template: '<div><h1>DocInjectable</h1></div>',
});
