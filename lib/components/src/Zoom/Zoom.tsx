import window from 'global';
import Element from './ZoomElement';
import IFrame from './ZoomIFrame';

export const browserSupportsCssZoom = (): boolean =>
  window.document.implementation.createHTMLDocument().body.style.zoom !== undefined;

export const Zoom = {
  Element,
  IFrame,
};
