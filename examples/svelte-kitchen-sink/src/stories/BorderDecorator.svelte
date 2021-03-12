<script>
    export let color = 'red';
</script>

<div style="border-color: {color}">
    <slot/>
</div>

<style>
    div {
        margin: 8px;
        padding: 8px;
        border: 1px solid red;
    }
</style>
