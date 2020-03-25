import React, { Fragment, Component, FunctionComponent, SyntheticEvent } from 'react';

import { Icons, IconButton, Separator } from '@storybook/components';
import { Addon } from '@storybook/addons';

const Context = React.createContext({ value: 1, set: (v: number) => {} });

class ZoomProvider extends Component<{}, { value: number }> {
  state = {
    value: 1,
  };

  set = (value: number) => this.setState({ value });

  render() {
    const { children } = this.props;
    const { set } = this;
    const { value } = this.state;

    return <Context.Provider value={{ value, set }}>{children}</Context.Provider>;
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
          <Zoom key="zoom" set={(v: number) => set(value * v)} reset={() => set(1)} />
        )}
      </ZoomConsumer>
      <Separator />
    </Fragment>
  ),
};
