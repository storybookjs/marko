<script>
    import { getContext } from 'svelte';

    let value = getContext('storybook/test') || 'No value';
</script>

<div on:click>
    Value read from context: {value}
</div>