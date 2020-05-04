/* eslint-disable react/no-did-update-set-state */

import React, { Component, Fragment, FunctionComponent, CSSProperties, ReactNode } from 'react';
import { styled, withTheme, Theme } from '@storybook/theming';
import { State } from '@storybook/api';
import * as persistence from './persist';

import { Draggable, Handle, DraggableData, DraggableEvent } from './draggers';

const Pane = styled.div<{
  border?: 'left' | 'right' | 'top' | 'bottom';
  animate?: boolean;
  top?: boolean;
  hidden?: boolean;
  children: ReactNode;
}>(
  {
    position: 'absolute',
    boxSizing: 'border-box',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  ({ hidden }) =>
    hidden
      ? {
          opacity: 0,
        }
      : {
          opacity: 1,
        },
  ({ top }) =>
    top
      ? {
          zIndex: 9,
        }
      : {},
  ({ border, theme }) => {
    switch (border) {
      case 'left': {
        return {
          borderLeft: `1px solid ${theme.appBorderColor}`,
        };
      }
      case 'right': {
        return {
          borderRight: `1px solid ${theme.appBorderColor}`,
        };
      }
      case 'top': {
        return {
          borderTop: `1px solid ${theme.appBorderColor}`,
        };
      }
      case 'bottom': {
        return {
          borderBottom: `1px solid ${theme.appBorderColor}`,
        };
      }
      default: {
        return {};
      }
    }
  },
  ({ animate }) =>
    animate
      ? {
          transition: ['width', 'height', 'top', 'left', 'background', 'opacity', 'transform']
            .map((p) => `${p} 0.1s ease-out`)
            .join(','),
        }
      : {}
);

const Paper = styled.div<{ isFullscreen: boolean }>(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  ({ isFullscreen, theme }) =>
    isFullscreen
      ? {
          boxShadow: 'none',
          borderRadius: 0,
        }
      : {
          borderRadius: theme.appBorderRadius,
          overflow: 'hidden',
          boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',
        }
);

export const Sidebar: FunctionComponent<{ hidden: boolean; position: CSSProperties }> = ({
  hidden = false,
  children,
  position = undefined,
  ...props
}) =>
  hidden ? null : (
    <Pane style={position} {...props}>
      {children}
    </Pane>
  );

export const Main: FunctionComponent<{ isFullscreen: boolean; position: CSSProperties }> = ({
  isFullscreen = false,
  children,
  position = undefined,
  ...props
}) => (
  <Pane style={position} top {...props}>
    <Paper isFullscreen={isFullscreen}>{children}</Paper>
  </Pane>
);

export const Preview: FunctionComponent<{ hidden: boolean; position: CSSProperties }> = ({
  hidden = false,
  children,
  position = undefined,
  ...props
}) => (
  <Pane style={position} top hidden={hidden} {...props}>
    {children}
  </Pane>
);

export const Panel: FunctionComponent<{
  hidden: boolean;
  position: CSSProperties;
  align: 'bottom' | 'right';
}> = ({ hidden = false, children, position = undefined, align = 'right', ...props }) => (
  <Pane style={position} hidden={hidden} {...props} border={align === 'bottom' ? 'top' : 'left'}>
    {children}
  </Pane>
);

const HoverBlocker = styled.div({
  position: 'absolute',
  left: 0,
  top: 0,
  zIndex: 15,
  height: '100vh',
  width: '100vw',
});

export type PanelPosition = 'right' | 'bottom';
export interface Bounds {
  top: number;
  width: number;
  left: number;
  height: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

const getPreviewPosition = ({
  panelPosition,
  isPanelHidden,
  isNavHidden,
  isFullscreen,
  bounds,
  resizerPanel,
  resizerNav,
  margin,
}: {
  panelPosition: PanelPosition;
  isPanelHidden: boolean;
  isNavHidden: boolean;
  isFullscreen: boolean;
  bounds: Bounds;
  resizerPanel: Coordinates;
  resizerNav: Coordinates;
  margin: number;
}): Bounds => {
  if (isFullscreen || isPanelHidden) {
    return {} as Bounds;
  }

  const navX = isNavHidden ? 0 : resizerNav.x;
  const panelX = resizerPanel.x;
  const panelY = resizerPanel.y;

  return panelPosition === 'bottom'
    ? {
        height: panelY - margin,
        left: 0,
        top: 0,
        width: bounds.width - navX - 2 * margin,
      }
    : {
        height: bounds.height - 2 * margin,
        left: 0,
        top: 0,
        width: panelX - navX - margin,
      };
};

const getMainPosition = ({
  bounds,
  resizerNav,
  isNavHidden,
  isFullscreen,
  margin,
}: {
  bounds: Bounds;
  resizerNav: Coordinates;
  isNavHidden: boolean;
  isFullscreen: boolean;
  margin: number;
}): Bounds => {
  if (isFullscreen) {
    return {} as Bounds;
  }

  const navX = isNavHidden ? 0 : resizerNav.x;

  return {
    height: bounds.height - margin * 2,
    left: navX + margin,
    top: margin,
    width: bounds.width - navX - margin * 2,
  };
};

const getPanelPosition = ({
  isPanelBottom,
  isPanelHidden,
  isNavHidden,
  bounds,
  resizerPanel,
  resizerNav,
  margin,
}: {
  isPanelBottom: boolean;
  isPanelHidden: boolean;
  isNavHidden: boolean;
  bounds: Bounds;
  resizerPanel: Coordinates;
  resizerNav: Coordinates;
  margin: number;
}): Bounds => {
  const navX = isNavHidden ? 0 : resizerNav.x;
  const panelX = resizerPanel.x;
  const panelY = resizerPanel.y;

  if (isPanelBottom && isPanelHidden) {
    return {
      height: bounds.height - panelY - margin,
      left: 0,
      top: panelY - margin,
      width: bounds.width - navX - 2 * margin,
    };
  }
  if (!isPanelBottom && isPanelHidden) {
    return {
      height: bounds.height - 2 * margin,
      left: panelX - navX - margin,
      top: 0,
      width: bounds.width - panelX - margin,
    };
  }

  return isPanelBottom
    ? {
        height: bounds.height - panelY - margin,
        left: 0,
        top: panelY - margin,
        width: bounds.width - navX - 2 * margin,
      }
    : {
        height: bounds.height - 2 * margin,
        left: panelX - navX - margin,
        top: 0,
        width: bounds.width - panelX - margin,
      };
};

export interface BasePanelRenderProps {
  viewMode?: State['viewMode'];
  animate: boolean;
  isFullscreen?: boolean;
  position: Bounds;
}

export interface LayoutRenderProps {
  mainProps: BasePanelRenderProps;
  previewProps: BasePanelRenderProps & {
    docsOnly: boolean;
    isToolshown: boolean;
  };
  navProps: BasePanelRenderProps & {
    hidden: boolean;
  };
  panelProps: BasePanelRenderProps & {
    align: PanelPosition;
    hidden: boolean;
  };
}

export interface LayoutState {
  isDragging: 'nav' | 'panel' | false;
  resizerNav: Coordinates;
  resizerPanel: Coordinates;
}
export interface LayoutProps {
  children: (data: LayoutRenderProps) => ReactNode;
  panelCount: number;
  bounds: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  options: {
    isFullscreen: boolean;
    showNav: boolean;
    showPanel: boolean;
    panelPosition: 'bottom' | 'right';
    isToolshown: boolean;
  };
  viewMode: State['viewMode'];
  docsOnly: boolean;
  theme: Theme;
}

class Layout extends Component<LayoutProps, LayoutState> {
  static defaultProps: Partial<LayoutProps> = {
    viewMode: undefined,
    docsOnly: false,
  };

  constructor(props: LayoutProps) {
    super(props);

    const { bounds, options } = props;

    const { resizerNav, resizerPanel } = persistence.get();

    this.state = {
      isDragging: false,
      resizerNav: resizerNav || { x: 200, y: 0 },
      resizerPanel:
        resizerPanel ||
        (options.panelPosition === 'bottom'
          ? { x: 0, y: Math.round(bounds.height * 0.6) }
          : { x: bounds.width - 400, y: 0 }),
    };
  }

  static getDerivedStateFromProps(props: LayoutProps, state: LayoutState) {
    const { bounds, options } = props;
    const { resizerPanel, resizerNav } = state;

    const isNavHidden = options.isFullscreen || !options.showNav;
    const isPanelHidden = options.isFullscreen || !options.showPanel;

    const { panelPosition } = options;
    const isPanelRight = panelPosition === 'right';
    const isPanelBottom = panelPosition === 'bottom';

    const navX = resizerNav.x;
    const panelX = resizerPanel.x;
    const panelY = resizerPanel.y;
    const minimalMainWidth = !isPanelHidden && isPanelRight ? 400 : 200;

    const mutation = {} as LayoutState;

    if (!isNavHidden) {
      if (bounds.width - minimalMainWidth < navX) {
        mutation.resizerNav = {
          x: bounds.width - minimalMainWidth,
          y: 0,
        };
      } else if (bounds.width - minimalMainWidth < 200 || navX < 200) {
        mutation.resizerNav = {
          x: 200,
          y: 0,
        };
      }
    }
    if (isPanelRight && !isPanelHidden) {
      if (bounds.width - 200 < panelX || panelX === 0) {
        mutation.resizerPanel = {
          x: bounds.width - 200,
          y: 0,
        };
      } else if (navX + 200 > panelX) {
        mutation.resizerPanel = {
          x: navX + 200,
          y: 0,
        };
      }
    }

    if (isPanelBottom && !isPanelHidden) {
      if (bounds.height - 200 < panelY || panelY === 0) {
        mutation.resizerPanel = {
          x: 0,
          y: bounds.height - 200,
        };
      }
    }

    return mutation.resizerPanel || mutation.resizerNav ? { ...state, ...mutation } : state;
  }

  componentDidUpdate(prevProps: LayoutProps, prevState: LayoutState) {
    const { resizerPanel, resizerNav } = this.state;

    persistence.set({
      resizerPanel,
      resizerNav,
    });
    const { width: prevWidth, height: prevHeight } = prevProps.bounds;
    const { bounds, options } = this.props;
    const { width, height } = bounds;
    if (width !== prevWidth || height !== prevHeight) {
      const { panelPosition } = options;
      const isPanelBottom = panelPosition === 'bottom';
      if (isPanelBottom) {
        this.setState({
          resizerPanel: {
            x: prevState.resizerPanel.x,
            y: prevState.resizerPanel.y - (prevHeight - height),
          },
        });
      } else {
        this.setState({
          resizerPanel: {
            x: prevState.resizerPanel.x - (prevWidth - width),
            y: prevState.resizerPanel.y,
          },
        });
      }
    }
  }

  resizeNav = (e: DraggableEvent, data: DraggableData) => {
    if (data.deltaX) {
      this.setState({ resizerNav: { x: data.x, y: data.y } });
    }
  };

  resizePanel = (e: DraggableEvent, data: DraggableData) => {
    const { options } = this.props;

    if (
      (data.deltaY && options.panelPosition === 'bottom') ||
      (data.deltaX && options.panelPosition === 'right')
    ) {
      this.setState({ resizerPanel: { x: data.x, y: data.y } });
    }
  };

  setDragNav = () => {
    this.setState({ isDragging: 'nav' });
  };

  setDragPanel = () => {
    this.setState({ isDragging: 'panel' });
  };

  unsetDrag = () => {
    this.setState({ isDragging: false });
  };

  render() {
    const { children, bounds, options, theme, viewMode, docsOnly, panelCount } = this.props;
    const { isDragging, resizerNav, resizerPanel } = this.state;

    const margin = theme.layoutMargin;
    const isNavHidden = options.isFullscreen || !options.showNav;
    const isPanelHidden =
      options.isFullscreen ||
      !options.showPanel ||
      docsOnly ||
      viewMode !== 'story' ||
      panelCount === 0;
    const isFullscreen = options.isFullscreen || (isNavHidden && isPanelHidden);
    const { isToolshown } = options;

    const { panelPosition } = options;
    const isPanelBottom = panelPosition === 'bottom';
    const isPanelRight = panelPosition === 'right';

    const panelX = resizerPanel.x;
    const navX = resizerNav.x;

    return bounds ? (
      <Fragment>
        {isNavHidden ? null : (
          <Draggable
            axis="x"
            position={resizerNav}
            bounds={{
              left: 200,
              top: 0,
              right: isPanelRight && !isPanelHidden ? panelX - 200 : bounds.width - 200,
              bottom: 0,
            }}
            onStart={this.setDragNav}
            onDrag={this.resizeNav}
            onStop={this.unsetDrag}
          >
            <Handle axis="x" isDragging={isDragging === 'nav'} />
          </Draggable>
        )}

        {isPanelHidden ? null : (
          <Draggable
            axis={isPanelBottom ? 'y' : 'x'}
            position={resizerPanel}
            bounds={
              isPanelBottom
                ? {
                    left: 0,
                    top: 200,
                    right: 0,
                    bottom: bounds.height - 200,
                  }
                : {
                    left: isNavHidden ? 200 : navX + 200,
                    top: 0,
                    right: bounds.width - 200,
                    bottom: 0,
                  }
            }
            onStart={this.setDragPanel}
            onDrag={this.resizePanel}
            onStop={this.unsetDrag}
          >
            <Handle
              isDragging={isDragging === 'panel'}
              style={
                isPanelBottom
                  ? {
                      left: navX + margin,
                      width: bounds.width - navX - 2 * margin,
                      marginTop: -margin,
                    }
                  : {
                      marginLeft: -margin,
                    }
              }
              axis={isPanelBottom ? 'y' : 'x'}
            />
          </Draggable>
        )}

        {isDragging ? <HoverBlocker /> : null}
        {children({
          mainProps: {
            viewMode,
            animate: !isDragging,
            isFullscreen,
            position: getMainPosition({ bounds, resizerNav, isNavHidden, isFullscreen, margin }),
          },
          previewProps: {
            viewMode,
            docsOnly,
            animate: !isDragging,
            isFullscreen,
            isToolshown,
            position: getPreviewPosition({
              isFullscreen,
              isNavHidden,
              isPanelHidden,
              resizerNav,
              resizerPanel,
              bounds,
              panelPosition,
              margin,
            }),
          },
          navProps: {
            viewMode,
            animate: !isDragging,
            hidden: isNavHidden,
            position: {
              height: bounds.height,
              left: 0,
              top: 0,
              width: navX + margin,
            },
          },
          panelProps: {
            viewMode,
            animate: !isDragging,
            align: options.panelPosition,
            hidden: isPanelHidden,
            position: getPanelPosition({
              isPanelBottom,
              isPanelHidden,
              isNavHidden,
              bounds,
              resizerPanel,
              resizerNav,
              margin,
            }),
          },
        })}
      </Fragment>
    ) : null;
  }
}

const ThemedLayout = withTheme(Layout);

export { ThemedLayout as Layout };
