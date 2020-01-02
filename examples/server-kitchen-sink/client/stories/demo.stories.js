export default {
  title: 'Demo',
  parameters: {
    componentSubtitle: 'Handy status label',
  },
};

export const Heading = () => {};
Heading.story = {
  parameters: {
    server: { id: 'demo/heading' },
  },
};

export const Headings = () => {};
Headings.story = {
  parameters: {
    server: { id: 'demo/headings' },
  },
};

export const Button = () => {};
Button.story = {
  parameters: {
    docs: { component: 'hi there docs' },
    server: { id: 'demo/button' },
  },
};
