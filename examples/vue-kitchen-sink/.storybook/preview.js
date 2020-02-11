import { addParameters, addDecorator } from '@storybook/vue';
import Vue from 'vue';
import Vuex from 'vuex';

import MyButton from '../src/stories/Button.vue';

Vue.component('my-button', MyButton);
Vue.use(Vuex);

addParameters({
  docs: {
    inlineStories: true,
    iframeHeight: '60px',
  },
});
