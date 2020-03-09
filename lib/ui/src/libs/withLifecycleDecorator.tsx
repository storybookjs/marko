import React, { Component } from 'react';

export interface WithLifecyleProps {
  storyFn: Function;
  beforeEach?: Function;
  afterEach?: Function;
}

// A small utility to add before/afterEach to stories.
class WithLifecyle extends Component<WithLifecyleProps> {
  constructor(props: WithLifecyleProps) {
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

export default ({ beforeEach, afterEach }: { beforeEach: Function; afterEach: Function }) => (
  storyFn: Function
) => <WithLifecyle beforeEach={beforeEach} afterEach={afterEach} storyFn={storyFn} />;
