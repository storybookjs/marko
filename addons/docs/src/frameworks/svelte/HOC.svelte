<script>
  import { onMount } from 'svelte';

  let greeting = 'Svelte HOC';

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

<div id={hash} />
