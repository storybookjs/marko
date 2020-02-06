import React, { Fragment, Component, FunctionComponent, SyntheticEvent } from 'react';

import { Icons, IconButton } from '@storybook/components';

const Context = React.createContext({ value: 1, set: (v: number) => {} });

class Provider extends Component<{}, { value: number }> {
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

const { Consumer } = Context;

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

export { Zoom, Consumer as ZoomConsumer, Provider as ZoomProvider };
