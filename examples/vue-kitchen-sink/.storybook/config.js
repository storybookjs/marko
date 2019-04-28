import { load, addParameters } from '@storybook/vue';
import { Wrapper } from '@storybook/components';

import Vue from 'vue';
import Vuex from 'vuex';

import MyButton from '../src/stories/Button.vue';

Vue.component('my-button', MyButton);
Vue.use(Vuex);

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
    docs: {
      mdxComponents: { wrapper: Wrapper },
    },
  },
});

load(require.context('../src', true, /\.stories\.js$/), module);
load(require.context('../src', true, /\.stories\.mdx$/), module);
