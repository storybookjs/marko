<script>
  import Button from '../../components/Button.svelte';

  /**
   * Rounds the button
   */
  export let rounded = false;

  /**
   * Displays the count
   */
  export let count = 0;

  /**
   * Button text
   */
  export let text = 'You clicked';

  /**
   * Array object
   */
  export let arrayTest = [];

  /**
   * number range
   */
  export let range = 0;

  /**
   * Loading State
   */
  export let loadingState = 'loading';

  /**
   * Food items
   */
  export let food = [];

  /**
   * car choice
   */
  export let car = 'car';

  /**
   * color choice
   */
  export let color = '#000000';

  /**
   * date choice
   */
  export let date = '';

  function handleClick(event) {
    count += 1;
  }
</script>

<style>
  .Box {
    width: 200px;
    height: 200px;
  }
</style>

<h1>Control Showcase</h1>
<Button {rounded} on:click={handleClick}>{text}: {count}</Button>

<h2>Array Range</h2>
<div>{JSON.stringify(arrayTest)}</div>

<h2>Progress Bar</h2>
<progress value={range} min={0} max={100} step={1} />

<h2>Enum Selectors</h2>

<h3>inline radio</h3>
<div>
  <p>Loading State: {loadingState}</p>
</div>

<h3>inline check</h3>
<div>
  <p>Food Items: {JSON.stringify(food)}</p>
</div>

<h3>inline select</h3>
<div>
  <p>Car choice: {car}</p>
</div>

<h2>Color Picker</h2>
<div>
  <div class="Box" style="background-color: {color}" />
</div>

<h2>Date Picker</h2>
<div>
  <p>Date: {new Date(date)}</p>
</div>
