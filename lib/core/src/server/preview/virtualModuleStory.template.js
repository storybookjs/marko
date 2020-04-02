import { configure } from '@storybook/{{framework}}';

// eslint-disable-next-line no-underscore-dangle
module._StorybookPreserveDecorators = true;

configure(['{{stories}}'], module);
