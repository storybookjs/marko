<template>
  <div id="app">
    <h1>Welcome to a Vue app managed by vue-cli</h1>
    <Button>Do not click me</Button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Button from './button/Button.vue';

export default Vue.extend({
  components: {
    Button,
  },
});
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 20px;
  font-size: 100%;
  font-family: sans-serif;
}
</style>
