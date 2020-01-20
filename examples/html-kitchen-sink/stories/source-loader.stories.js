import button from './button.html';

export default {
  title: 'Addons/Source loader',
};

export const Button = () => button;
Button.story = {
  parameters: {
    storySource: {
      source: button,
    },
  },
};

export const SimpleStory = () =>
  `<p>
      <strong>
        This is a fragment of HTML
      </strong>
    </p>`;
SimpleStory.story = {
  name: 'Very simple story',
};
