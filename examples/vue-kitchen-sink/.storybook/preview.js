import Vue from 'vue';
import Vuex from 'vuex';

import MyButton from '../src/stories/Button.vue';

Vue.component('my-button', MyButton);
Vue.use(Vuex);

export const parameters = {
  passArgsFirst: true,
  docs: {
    iframeHeight: '60px',
  },
};
