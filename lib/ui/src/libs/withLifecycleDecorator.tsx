import React, { Component } from 'react';

// A small utility to add before/afterEach to stories.
class WithLifecyle extends Component<{
  storyFn: Function;
  beforeEach?: Function;
  afterEach?: Function;
}> {
  constructor(props) {
    super(props);

    if (props.beforeEach) {
      props.beforeEach();
    }
  }

  componentWillUnmount() {
    const { afterEach } = this.props;

    if (afterEach) {
      afterEach();
    }
  }

  render() {
    const { storyFn } = this.props;

    return storyFn();
  }
}

export default ({ beforeEach, afterEach }) => storyFn => (
  <WithLifecyle beforeEach={beforeEach} afterEach={afterEach} storyFn={storyFn} />
);
