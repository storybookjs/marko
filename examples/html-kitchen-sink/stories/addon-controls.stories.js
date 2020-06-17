export default {
  title: 'Addons/Controls',
  argTypes: {
    label: { type: { name: 'string' } },
  },
};

const ButtonStory = ({ label }) => {
  return `<div>${label}</div>`;
};

export const Hello = ButtonStory.bind({});
Hello.args = { label: 'Hello!' };

export const Bonjour = ButtonStory.bind({});
Bonjour.args = { label: 'Bonjour!' };
