import React, { Fragment, Component, FunctionComponent, SyntheticEvent } from 'react';

import { Icons, IconButton, Separator } from '@storybook/components';
import { Addon } from '@storybook/addons';

const initialZoom = 1 as const;

const Context = React.createContext({ value: initialZoom, set: (v: number) => {} });

class ZoomProvider extends Component<{ shouldScale: boolean }, { value: number }> {
  state = {
    value: initialZoom,
  };

  set = (value: number) => this.setState({ value });

  render() {
    const { children, shouldScale } = this.props;
    const { set } = this;
    const { value } = this.state;
    return (
      <Context.Provider value={{ value: shouldScale ? value : initialZoom, set }}>
        {children}
      </Context.Provider>
    );
  }
}

const { Consumer: ZoomConsumer } = Context;

const cancel = (e: SyntheticEvent) => {
  e.preventDefault();
  return false;
};

const Zoom: FunctionComponent<{ set: Function; reset: Function }> = ({ set, reset }) => (
  <Fragment>
    <IconButton key="zoomin" onClick={(e: SyntheticEvent) => cancel(e) || set(0.8)} title="Zoom in">
      <Icons icon="zoom" />
    </IconButton>
    <IconButton
      key="zoomout"
      onClick={(e: SyntheticEvent) => cancel(e) || set(1.25)}
      title="Zoom out"
    >
      <Icons icon="zoomout" />
    </IconButton>
    <IconButton
      key="zoomreset"
      onClick={(e: SyntheticEvent) => cancel(e) || reset()}
      title="Reset zoom"
    >
      <Icons icon="zoomreset" />
    </IconButton>
  </Fragment>
);

export { Zoom, ZoomConsumer, ZoomProvider };

export const zoomTool: Addon = {
  title: 'zoom',
  match: ({ viewMode }) => viewMode === 'story',
  render: () => (
    <Fragment>
      <ZoomConsumer>
        {({ set, value }) => (
          <Zoom key="zoom" set={(v: number) => set(value * v)} reset={() => set(initialZoom)} />
        )}
      </ZoomConsumer>
      <Separator />
    </Fragment>
  ),
};
