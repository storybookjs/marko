import { addParameters, addDecorator } from '@storybook/ember';
import { setJSONDoc } from '@storybook/addon-docs/ember';
// eslint-disable-next-line import/no-unresolved
import docJson from '../ember-output/storybook-docgen/index.json';

setJSONDoc(docJson);
addParameters({
  options: {
    showRoots: true,
  },
});
