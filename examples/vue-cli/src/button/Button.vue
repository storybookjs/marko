<template>
  <div class="button" :class="`size-${size}`">
    <!-- @slot Button content, e.g. label text -->
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ButtonSize } from './types';

/**
 * This is a very nice button. It comes in three sizes!
 **/
@Component
export default class Button extends Vue {
  /**
   * The size of the button
   */
  @Prop({ type: String, default: 'default' }) readonly size!: ButtonSize;
}
</script>

<style lang="scss">
.button {
  border: 1px solid #000;
  line-height: 2em;
  padding: 0 1em;
  display: inline-block;
  border-radius: 3px;

  &.size-small {
    font-size: 0.8em;
  }
  &.size-big {
    font-size: 1.5em;
  }
}
</style>
