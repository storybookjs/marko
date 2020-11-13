import React, { ComponentProps, FunctionComponent, useMemo } from 'react';
import { Global, createGlobal, styled } from '@storybook/theming';
import { SizeMe } from 'react-sizeme';

import { Route } from '@storybook/router';

import { State } from '@storybook/api';
import { Mobile } from './components/layout/mobile';
import { Desktop } from './components/layout/desktop';
import Sidebar from './containers/sidebar';
import Preview from './containers/preview';
import Panel from './containers/panel';
import Notifications from './containers/notifications';

import SettingsPages from './settings';

const View = styled.div({
  position: 'fixed',
  overflow: 'hidden',
  height: '100vh',
  width: '100vw',
});

export interface AppProps {
  viewMode: State['viewMode'];
  docsOnly: boolean;
  layout: State['layout'];
  panelCount: number;
  width: number;
  height: number;
}

const App = React.memo<AppProps>(({ viewMode, docsOnly, layout, panelCount, width, height }) => {
  let content;

  const props = useMemo(
    () => ({
      Sidebar,
      Preview,
      Panel,
      Notifications,
      pages: [
        {
          key: 'settings',
          render: () => <SettingsPages />,
          route: (({ children }) => (
            <Route path="/settings" startsWith>
              {children}
            </Route>
          )) as FunctionComponent,
        },
      ],
    }),
    []
  );

  if (!width || !height) {
    content = <div />;
  } else if (width < 600) {
    content = <Mobile {...props} viewMode={viewMode} options={layout} />;
  } else {
    content = (
      <Desktop
        {...props}
        viewMode={viewMode}
        options={layout}
        docsOnly={docsOnly}
        width={width}
        height={height}
        panelCount={panelCount}
      />
    );
  }

  return (
    <View>
      <Global styles={createGlobal} />
      {content}
    </View>
  );
});

App.displayName = 'App';

const SizedApp: FunctionComponent<Omit<ComponentProps<typeof App>, 'width' | 'height'>> = (
  props
) => (
  <SizeMe monitorHeight>
    {({ size }) => (
      // Don't pass size directly, because it's a new object each time.
      <App {...props} {...size} />
    )}
  </SizeMe>
);

export default SizedApp;
