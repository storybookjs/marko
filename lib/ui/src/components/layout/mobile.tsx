import React, { Component, Children, ComponentType, FunctionComponent, ReactNode } from 'react';
import { State, ActiveTabs } from '@storybook/api';
import { styled } from '@storybook/theming';

import { TabButton } from '@storybook/components';
import { Root } from './Root';

export type ActiveTabsType = 'sidebar' | 'canvas' | 'addons';

const { SIDEBAR, CANVAS, ADDONS } = ActiveTabs;

const Pane = styled.div<{ index: number; active: ActiveTabsType }>(
  {
    transition: 'transform .2s ease',
    position: 'absolute',
    top: 0,
    height: '100%',
    overflow: 'auto',
  },
  ({ theme }) => ({
    background: theme.background.content,
    '&:nth-of-type(1)': {
      borderRight: `1px solid ${theme.appBorderColor}`,
    },
    '&:nth-of-type(3)': {
      borderLeft: `1px solid ${theme.appBorderColor}`,
    },
  }),
  ({ index }) => {
    switch (index) {
      case 0: {
        return {
          width: '80vw',
          transform: 'translateX(-80vw)',
          left: 0,
        };
      }
      case 1: {
        return {
          width: '100%',
          transform: 'translateX(0) scale(1)',
          left: 0,
        };
      }
      case 2: {
        return {
          width: '80vw',
          transform: 'translateX(80vw)',
          right: 0,
        };
      }
      default: {
        return {};
      }
    }
  },
  ({ active, index }) => {
    switch (true) {
      case index === 0 && active === SIDEBAR: {
        return {
          transform: 'translateX(-0px)',
        };
      }
      case index === 1 && active === SIDEBAR: {
        return {
          transform: 'translateX(40vw) translateY(-42.5vh) translateY(40px) scale(0.2)',
        };
      }
      case index === 1 && active === ADDONS: {
        return {
          transform: 'translateX(-40vw) translateY(-42.5vh) translateY(40px) scale(0.2)',
        };
      }
      case index === 2 && active === ADDONS: {
        return {
          transform: 'translateX(0px)',
        };
      }
      default: {
        return {};
      }
    }
  }
);

const Panels = React.memo((({ children, active }) => (
  <PanelsContainer>
    {Children.toArray(children).map((item, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Pane key={index} index={index} active={active}>
        {item}
      </Pane>
    ))}
  </PanelsContainer>
)) as FunctionComponent<{ active: ActiveTabsType; children: ReactNode }>);
Panels.displayName = 'Panels';

const PanelsContainer = styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: 'calc(100% - 40px)',
});

const Bar = styled.nav(
  {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100vw',
    height: 40,
    display: 'flex',
    boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',

    '& > *': {
      flex: 1,
    },
  },
  ({ theme }) => ({
    background: theme.barBg,
  })
);

export interface Page {
  key: string;
  route: FunctionComponent;
  render: FunctionComponent;
}

export interface MobileProps {
  options: {
    initialActive: ActiveTabsType;
    isToolshown: boolean;
  };
  Sidebar: ComponentType<any>;
  Preview: ComponentType<any>;
  Panel: ComponentType<any>;
  Notifications: ComponentType<any>;

  viewMode: State['viewMode'];

  pages: Page[];
}

export interface MobileState {
  active: ActiveTabsType;
}

class Mobile extends Component<MobileProps, MobileState> {
  constructor(props: MobileProps) {
    super(props);

    const { options } = props;
    this.state = {
      active: options.initialActive || SIDEBAR,
    };
  }

  render() {
    const { Sidebar, Preview, Panel, Notifications, pages, viewMode, options } = this.props;
    const { active } = this.state;

    return (
      <Root>
        <Notifications
          placement={{
            position: 'fixed',
            bottom: 60,
            left: 20,
            right: 20,
          }}
        />

        <Panels active={active}>
          <Sidebar />
          <div>
            <div hidden={!viewMode}>
              <Preview isToolshown={options.isToolshown} id="main" viewMode={viewMode} />
            </div>
            {pages.map(({ key, route: Route, render: Content }) => (
              <Route key={key}>
                <Content />
              </Route>
            ))}
          </div>
          <Panel hidden={!viewMode} />
        </Panels>
        <Bar>
          <TabButton onClick={() => this.setState({ active: SIDEBAR })} active={active === SIDEBAR}>
            Sidebar
          </TabButton>
          <TabButton onClick={() => this.setState({ active: CANVAS })} active={active === CANVAS}>
            {viewMode ? 'Canvas' : null}
            {pages.map(({ key, route: Route }) => (
              <Route key={key}>{key}</Route>
            ))}
          </TabButton>
          {viewMode ? (
            <TabButton onClick={() => this.setState({ active: ADDONS })} active={active === ADDONS}>
              Addons
            </TabButton>
          ) : null}
        </Bar>
      </Root>
    );
  }
}

export { Mobile };
