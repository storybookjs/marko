<script>
  import { onMount } from 'svelte';

  export let component;
  export let props;
  let child;

  const hash = `svelte mounter ${Math.floor(Math.random() * 100)}`;

  onMount(() => {
    child = new component({
      target: document.getElementById(hash),
      props,
    });
  });
</script>

<svelte:options accessors={true} />
<div id={hash} />
