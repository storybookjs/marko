import { setInterval } from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, number } from '@storybook/addon-knobs';
import { styled } from '@storybook/theming';
import { ActiveTabs } from '@storybook/api';

import { isChromatic } from 'storybook-chromatic/isChromatic';

import { Desktop } from './desktop';
import { Mobile } from './mobile';

import Sidebar from '../sidebar/Sidebar';
import Panel from '../panel/panel';
import { Preview } from '../preview/preview';

import { panels } from '../panel/panel.stories';
import { previewProps } from '../preview/preview.stories';

import { mockDataset } from '../sidebar/treeview/treeview.mockdata';
import { store } from './persist';

const realNavProps = {
  title: 'Title',
  url: 'https://example.com',
  stories: mockDataset.withRoot,
  menu: [],
};

const PlaceholderBlock = styled.div(({ color }) => ({
  background: color || 'hotpink',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
}));

class PlaceholderClock extends Component {
  state = {
    count: 1,
  };

  componentDidMount() {
    this.interval = setInterval(() => {
      const { count } = this.state;
      this.setState({ count: count + 1 });
    }, 1000);
  }

  componentWillUnmount() {
    const { interval } = this;
    clearInterval(interval);
  }

  render() {
    const { children, color } = this.props;
    const { count } = this.state;

    return (
      <PlaceholderBlock color={color}>
        <h2
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            color: 'rgba(0,0,0,0.2)',
            fontSize: '150px',
            lineHeight: '150px',
            margin: '-20px',
          }}
        >
          {count}
        </h2>
        {children}
      </PlaceholderBlock>
    );
  }
}
PlaceholderClock.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
};

const MockNav = props => (
  <PlaceholderClock color="hotpink">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);
const MockPreview = props => (
  <PlaceholderClock color="deepskyblue">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);
const MockPanel = props => (
  <PlaceholderClock color="orangered">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);
const MockPage = props => (
  <PlaceholderClock color="cyan">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);

const mockProps = {
  Nav: MockNav,
  Preview: MockPreview,
  Panel: MockPanel,
  Notifications: () => null,
  pages: [],
  options: { isFullscreen: false, showNav: true, showPanel: true, panelPosition: 'right' },
  path: '/story/UI-DesktopLayout-noNav',
  viewMode: 'story',
  storyId: 'UI-DesktopLayout-noNav',
  panelCount: 2,
};

const realProps = {
  Nav: () => <Sidebar {...realNavProps} />,
  Preview: () => <Preview {...previewProps} />,
  Notifications: () => null,
  Panel: () => (
    <Panel
      panels={panels}
      actions={{ onSelect: () => {}, toggleVisibility: () => {}, togglePosition: () => {} }}
      selectedPanel="test2"
    />
  ),
  pages: [],
  options: { isFullscreen: false, showNav: true, showPanel: true, panelPosition: 'right' },
  path: '/story/UI-DesktopLayout-noNav',
  viewMode: 'story',
  storyId: 'UI-DesktopLayout-noNav',
  panelCount: 2,
};

storiesOf('UI/Layout/Desktop', module)
  .addParameters({
    component: Desktop,
  })
  .addDecorator(withKnobs)
  .addDecorator(storyFn => {
    const mocked = boolean('mock', true);
    const height = number('height', 1200);
    const width = number('width', 1200);

    if (isChromatic) {
      store.local.set(`storybook-layout`, {});
    }

    const props = {
      height,
      width,
      ...(mocked ? mockProps : realProps),
    };

    return <div style={{ minHeight: 1200, minWidth: 1200 }}>{storyFn({ props })}</div>;
  })
  .add('default', ({ props }) => <Desktop {...props} />)
  .add('no addons', ({ props }) => <Desktop {...props} panelCount={0} />)
  .add('no Nav', ({ props }) => (
    <Desktop {...props} options={{ ...props.options, showNav: false }} />
  ))
  .add('no Panel', ({ props }) => (
    <Desktop {...props} options={{ ...props.options, showPanel: false }} />
  ))
  .add('bottom Panel', ({ props }) => (
    <Desktop {...props} options={{ ...props.options, panelPosition: 'bottom' }} />
  ))
  .add('full', ({ props }) => (
    <Desktop {...props} options={{ ...props.options, isFullscreen: true }} />
  ))
  .add('no Panel, no Nav', ({ props }) => (
    <Desktop {...props} options={{ ...props.options, showPanel: false, showNav: false }} />
  ))
  .add('page', ({ props }) => (
    <Desktop
      {...props}
      pages={[
        {
          key: 'settings',
          // eslint-disable-next-line react/prop-types
          route: ({ children }) => <Fragment>{children}</Fragment>,
          render: () => <MockPage />,
        },
      ]}
      viewMode="settings"
    />
  ));

storiesOf('UI/Layout/Mobile', module)
  .addParameters({
    component: Mobile,
  })
  .addDecorator(withKnobs)
  .addDecorator(storyFn => {
    const mocked = boolean('mock', true);

    const props = {
      ...(mocked ? mockProps : realProps),
    };

    return storyFn({ props });
  })
  .add('initial sidebar', ({ props }) => (
    <Mobile {...props} options={{ initialActive: ActiveTabs.SIDEBAR }} />
  ))
  .add('initial canvas', ({ props }) => (
    <Mobile {...props} options={{ initialActive: ActiveTabs.CANVAS }} />
  ))
  .add('initial addons', ({ props }) => (
    <Mobile {...props} options={{ initialActive: ActiveTabs.ADDONS }} />
  ))
  .add('page', ({ props }) => (
    <Mobile
      {...props}
      options={{ initialActive: ActiveTabs.CANVAS }}
      pages={[
        {
          key: 'settings',
          // eslint-disable-next-line react/prop-types
          route: ({ children }) => <Fragment>{children}</Fragment>,
          render: () => <MockPage />,
        },
      ]}
      viewMode="settings"
    />
  ));
