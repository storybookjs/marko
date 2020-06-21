import Vue from 'vue';
import Vuex from 'vuex';
import { jsxDecorator } from 'storybook-addon-jsx';

import MyButton from '../src/stories/Button.vue';

Vue.component('my-button', MyButton);
Vue.use(Vuex);

export const parameters = {
  docs: {
    iframeHeight: '60px',
  },
};

export const decorators = [jsxDecorator];
