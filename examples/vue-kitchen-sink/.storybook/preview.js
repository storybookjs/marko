import { addParameters } from '@storybook/vue';
import Vue from 'vue';
import Vuex from 'vuex';

import MyButton from '../src/stories/Button.vue';

Vue.component('my-button', MyButton);
Vue.use(Vuex);

addParameters({
  docs: {
    iframeHeight: '60px',
  },
});
