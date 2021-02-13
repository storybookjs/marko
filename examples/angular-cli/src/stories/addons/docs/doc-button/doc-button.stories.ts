import { DocButtonComponent } from './doc-button.component';

export default {
  title: 'Addon/Docs/DocButton',
  component: DocButtonComponent,
};

export const Basic = (args) => ({
  props: args,
});
Basic.args = { label: 'Args test', isDisabled: false };
