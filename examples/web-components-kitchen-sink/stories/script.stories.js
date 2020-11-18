import { html } from 'lit-html';

export default {
  title: 'Script Tag',
};

export const inTemplate = () =>
  html`<div>JS alert</div>
    <script>
      alert('hello');
    </script>`;

export const inString = () => '<div>JS alert</div><script>alert("hello")</script>';
