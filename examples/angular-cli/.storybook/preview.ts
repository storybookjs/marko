import { addParameters, addDecorator } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import addCssWarning from '../src/cssWarning';

// @ts-ignore
import docJson from '../documentation.json';
// remove ButtonComponent to test #12009
const filtered = {
  ...docJson,
  components: docJson.components.filter((c) => c.name !== 'ButtonComponent'),
};
setCompodocJson(filtered);

addCssWarning();

addParameters({
  docs: {
    // inlineStories: true,
    iframeHeight: '60px',
  },
});
