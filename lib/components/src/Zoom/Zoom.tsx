import window from 'global';
import { ZoomElement as Element } from './ZoomElement';
import { ZoomIFrame as IFrame } from './ZoomIFrame';

export const browserSupportsCssZoom = (): boolean => {
  try {
    return window.document.implementation.createHTMLDocument('').body.style.zoom !== undefined;
  } catch (error) {
    return false;
  }
};

export const Zoom = {
  Element,
  IFrame,
};
