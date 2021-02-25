<script lang="ts">
  import { createEventDispatcher, afterUpdate } from 'svelte';
  /**
   * Text
   */
  export let text = '';
  /**
   * Border radius
   */
  export let rounded = true;

  const dispatch = createEventDispatcher<{ click: MouseEvent, afterUpdate: void}>();

  function onClick(event: MouseEvent) {
    rounded = !rounded;

    dispatch('click', event);
  }

  afterUpdate(() => {
    dispatch('afterUpdate');
  });
</script>

<style>
  .rounded {
    border-radius: 35px;
  }

  .button {
    border: 3px solid;
    padding: 10px 20px;
    background-color: white;
    outline: none;
  }
</style>

<button class="button" class:rounded on:click={onClick}>
  <strong>{rounded ? 'Round' : 'Square'} corners</strong>
  <br />
  {text}
  <!-- Button text -->
  <slot />
</button>
