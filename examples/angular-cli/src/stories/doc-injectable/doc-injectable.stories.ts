import { DocInjectableService } from './doc-injectable.service';

export default {
  title: 'DocInjectable',
  component: DocInjectableService,
  parameters: {
    docs: { iframeHeight: 120 },
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
