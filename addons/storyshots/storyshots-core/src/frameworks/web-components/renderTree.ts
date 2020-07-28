function getRenderedTree(story: { render: () => any }) {
  const component = story.render();
  return component.getHTML ? component.getHTML() : component;
}

export default getRenderedTree;
