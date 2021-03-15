import { DocPipe } from './doc-pipe.pipe';

export default {
  title: 'Addons/Docs/DocPipe',
  component: DocPipe,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};

const modules = {
  declarations: [DocPipe],
};

export const Basic = () => ({
  moduleMetadata: modules,
  template: `<div><h1>{{ 'DocPipe' | docPipe }}</h1></div>`,
});
