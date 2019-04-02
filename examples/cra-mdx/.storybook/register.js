import * as React from 'react';
import addons, { types } from '@storybook/addons';
import { Consumer } from '@storybook/api';
import window from 'global';
import PropTypes from 'prop-types';

class IFrame extends React.Component {
  iframe = null;

  componentDidMount() {
    const { id } = this.props;
    this.iframe = window.document.getElementById(id);
  }

  shouldComponentUpdate(nextProps) {
    const { scale } = this.props;
    return scale !== nextProps.scale;
  }

  componentDidUpdate(prevProps) {
    const { scale } = this.props;
    if (scale !== prevProps.scale) {
      this.setIframeBodyStyle({
        width: `${scale * 100}%`,
        height: `${scale * 100}%`,
        transform: `scale(${1 / scale})`,
        transformOrigin: 'top left',
      });
    }
  }

  setIframeBodyStyle(style) {
    return Object.assign(this.iframe.contentDocument.body.style, style);
  }

  render() {
    const { id, title, src, allowFullScreen, scale, ...rest } = this.props;
    return (
      <iframe
        scrolling="yes"
        id={id}
        title={title}
        src={src}
        allowFullScreen={allowFullScreen}
        {...rest}
      />
    );
  }
}
IFrame.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  allowFullScreen: PropTypes.bool.isRequired,
  scale: PropTypes.number.isRequired,
};

const baseUrl = 'iframe.html';

const Panel = ({ active }) => {
  if (!active) {
    return null;
  }
  return (
    <Consumer filter={({ state }) => state.storyId}>
      {storyId => (
        <IFrame
          key="iframe"
          id="storybook-preview-iframe"
          title="docs"
          src={`${baseUrl}?id=${storyId}&docs=true`}
          allowFullScreen
          scale={1}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            border: '0 none',
          }}
        />
      )}
    </Consumer>
  );
};

Panel.propTypes = {
  active: PropTypes.bool.isRequired,
};

addons.register('docs', () => {
  addons.add('docs-panel', {
    type: types.TAB,
    title: 'Docs',
    route: ({ storyId }) => `/info/${storyId}`, // todo add type
    match: ({ viewMode }) => viewMode === 'info', // todo add type
    render: ({ active }) => <Panel active={active} />, // eslint-disable-line react/prop-types
  });
});
