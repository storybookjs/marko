import { document } from 'global';
import addons from '@storybook/addons';
import { STORY_CHANGED } from '@storybook/core-events';
import { EVENTS, HIGHLIGHT_STYLE_ID } from './constants';

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

interface HighlightInfo {
  /** html selector of the element */
  elements: string[];
  color: string;
}

const channel = addons.getChannel();

const higlighted = (color: string) => `
  outline: 2px dashed ${color};
  outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(255,255,255,0.6);
}
`;

const highlight = (infos: HighlightInfo) => {
  const id = HIGHLIGHT_STYLE_ID;
  resetHighlight();

  const sheet = document.createElement('style');
  sheet.setAttribute('id', id);
  sheet.innerHTML = infos.elements
    .map(
      (target) =>
        `${target}{ 
          ${higlighted(infos.color)}
         }`
    )
    .join(' ');
  document.head.appendChild(sheet);
};

const resetHighlight = () => {
  const id = HIGHLIGHT_STYLE_ID;
  const sheetToBeRemoved = document.getElementById(id);
  if (sheetToBeRemoved) {
    sheetToBeRemoved.parentNode.removeChild(sheetToBeRemoved);
  }
};

channel.on(STORY_CHANGED, resetHighlight);
channel.on(EVENTS.HIGHLIGHT, highlight);
