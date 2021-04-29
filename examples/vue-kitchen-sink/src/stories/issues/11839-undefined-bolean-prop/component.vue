<template>
  <div>Disabled: {{disabled}}</div>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
  },
  mounted() {
    console.log(this.disabled); // notice this line
  },
};
</script>