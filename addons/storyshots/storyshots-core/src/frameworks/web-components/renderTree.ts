import { document, Node } from 'global';

function getRenderedTree(story: { render: () => any }) {
  const component = story.render();
  const componentContent = component.getHTML ? component.getHTML() : component;

  const section: HTMLElement = document.createElement('section');
  section.innerHTML = componentContent;

  if (section.childElementCount > 1) {
    return section;
  }

  return section.firstChild;
}

export default getRenderedTree;
