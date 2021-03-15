<script>
  export let storyContext;
  export let unboundStoryFn;
      
  let { Component: component, props } = unboundStoryFn(storyContext);
</script>

<svelte:component this={component} {...props}/>
