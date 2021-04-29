export default {
  title: 'Addons/Docs/transformSource',
  parameters: {
    docs: {
      transformSource(src, ctx) {
        return `// We transformed this!\n const example = ${src};`;
      },
    },
  },
};

export const code = () => 'StoryType "CODE" story which has source transformed';
code.parameters = {
  docs: { source: { type: 'code' } },
};

export const dynamic = () => 'StoryType "DYNAMIC" story which has source transformed';
dynamic.parameters = {
  docs: { source: { type: 'dynamic' } },
};

export const auto = () => 'StoryType "AUTO" story which has source transformed';
dynamic.parameters = {
  docs: { source: { type: 'auto' } },
};
