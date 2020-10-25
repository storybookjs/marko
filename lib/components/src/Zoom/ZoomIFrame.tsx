import window from 'global';
import { Component, ReactElement } from 'react';

export type IZoomIFrameProps = {
  id: string;
  title: string;
  src: string;
  allowFullScreen: boolean;
  scale: number;
  active: boolean;
  supportsCssZoom: boolean;
  children: ReactElement<HTMLIFrameElement>;
};

export default class ZoomIFrame extends Component<IZoomIFrameProps> {
  iframe: HTMLIFrameElement = null;

  componentDidMount() {
    const { id } = this.props;
    this.iframe = window.document.getElementById(id);
    this.iframe.addEventListener('load', this.setAttributeDataIsLoaded);
  }

  shouldComponentUpdate(nextProps: IZoomIFrameProps) {
    const { scale, active } = this.props;

    if (scale !== nextProps.scale) {
      this.setIframeInnerZoom(nextProps.scale, nextProps.supportsCssZoom);
    }

    if (active !== nextProps.active) {
      this.iframe.setAttribute('data-is-storybook', nextProps.active ? 'true' : 'false');
    }

    // this component renders an iframe, which gets updates via post-messages
    // never update this component, it will cause the iframe to refresh
    return false;
  }

  componentWillUnmount() {
    this.iframe.removeEventListener('load', this.setAttributeDataIsLoaded);
  }

  setAttributeDataIsLoaded() {
    this.iframe.setAttribute('data-is-loaded', 'true');
  }

  setIframeInnerZoom(scale: number, supportsCssZoom: boolean) {
    try {
      if (supportsCssZoom) {
        Object.assign(this.iframe.contentDocument.body.style, {
          width: `${scale * 100}%`,
          height: `${scale * 100}%`,
          transform: `scale(${1 / scale})`,
          transformOrigin: 'top left',
        });
      } else {
        Object.assign(this.iframe.contentDocument.body.style, {
          zoom: 1 / scale,
        });
      }
    } catch (e) {
      this.setIframeZoom(scale);
    }
  }

  setIframeZoom(scale: number) {
    Object.assign(this.iframe.style, {
      width: `${scale * 100}%`,
      height: `${scale * 100}%`,
      transform: `scale(${1 / scale})`,
      transformOrigin: 'top left',
    });
  }

  render() {
    const { children } = this.props;
    return children;
  }
}
