export default {
  title: 'Welcome',
};

export const ToStorybook = () => `
<main>
  <h1>Welcome to storybook</h1>
  <p>This is a UI component dev environment for your app.</p>
  <p>
    We've added some basic stories inside the
    <span class="inline-code">src/stories</span> directory. <br />
    A story is a single state of one or more UI components. You can have as many stories as you
    want. <br />
    (Basically a story is like a visual test case.)
  </p>
  <p>
    See these sample
    <a (click)="showApp.emit($event)" role="button" tabIndex="0">stories</a> for a component
    called <span class="inline-code">Button</span> .
  </p>
  <p>
    Just like that, you can add your own components as stories. <br />
    You can also edit those components and see changes right away. <br />
    (Try editing the <span class="inline-code">Button</span> stories located at
    <span class="inline-code">src/stories/1-Button.stories.js</span>.)
  </p>
  <p>
    Usually we create stories with smaller UI components in the app.<br />
    Have a look at the
    <a
      href="https://storybook.js.org/basics/writing-stories"
      target="_blank"
      rel="noopener noreferrer"
    >
      Writing Stories
    </a>
    section in our documentation.
  </p>
  <p class="note">
    <b>NOTE:</b> <br />
    Have a look at the <span class="inline-code">.storybook/webpack.config.js</span> to add
    webpack loaders and plugins you are using in this project.
  </p>
</main>`;

ToStorybook.storyName = 'to Storybook';
