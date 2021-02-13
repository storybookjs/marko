import { DocDirective } from './doc-directive.directive';

export default {
  title: 'Addon/Docs/DocDirective',
  component: DocDirective,
};

const modules = {
  declarations: [DocDirective],
};

export const Basic = () => ({
  moduleMetadata: modules,
  template: '<div docDirective [hasGrayBackground]="true"><h1>DocDirective</h1></div>',
});
