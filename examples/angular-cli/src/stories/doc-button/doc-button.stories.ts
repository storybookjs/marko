import { ButtonComponent } from './doc-button.component';

export default {
  title: 'DocButton',
  component: ButtonComponent,
  parameters: { docs: { iframeHeight: 120 } },
};

export const Basic = (args) => ({
  component: ButtonComponent,
  props: args,
});
Basic.args = { label: 'Args test', isDisabled: false };
