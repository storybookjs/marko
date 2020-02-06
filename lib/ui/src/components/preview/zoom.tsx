import React, { Fragment, Component, FunctionComponent } from 'react';

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

const Zoom: FunctionComponent<{ set: Function; reset: Function }> = ({ set, reset }) => (
  <Fragment>
    <IconButton key="zoomin" onClick={e => e.preventDefault() || set(0.8)} title="Zoom in">
      <Icons icon="zoom" />
    </IconButton>
    <IconButton key="zoomout" onClick={e => e.preventDefault() || set(1.25)} title="Zoom out">
      <Icons icon="zoomout" />
    </IconButton>
    <IconButton key="zoomreset" onClick={e => e.preventDefault() || reset()} title="Reset zoom">
      <Icons icon="zoomreset" />
    </IconButton>
  </Fragment>
);

export { Zoom, Consumer as ZoomConsumer, Provider as ZoomProvider };
