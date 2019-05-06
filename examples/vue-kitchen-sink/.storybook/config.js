import { load, addParameters } from '@storybook/vue';

import Vue from 'vue';
import Vuex from 'vuex';

import MyButton from '../src/stories/Button.vue';

Vue.component('my-button', MyButton);
Vue.use(Vuex);

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

load(require.context('../src', true, /\.stories\.js$/), module);
load(require.context('../src', true, /\.stories\.mdx$/), module);
