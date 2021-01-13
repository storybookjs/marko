import { DocButtonComponent } from './doc-button.component';

export default {
  title: 'DocButton',
  component: DocButtonComponent,
  parameters: { docs: { iframeHeight: 120 } },
};

export const Basic = (args) => ({
  props: args,
});
Basic.args = { label: 'Args test', isDisabled: false };
