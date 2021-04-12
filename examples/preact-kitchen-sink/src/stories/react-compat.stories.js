/** @jsx h */

import { h } from 'preact';
import { createElement, Component, useState } from 'react';
import PropTypes from 'prop-types';

export default {
  title: 'React Compatibility',
};

const ReactFunctionalComponent = ({ label }) => {
  const [clicks, setValue] = useState(0);
  return createElement(
    'div',
    { onClick: () => setValue(clicks + 1) },
    createElement('div', { style: { color: 'red' } }, label),
    createElement('div', {}, `Clicked ${clicks} times.`)
  );
};

ReactFunctionalComponent.propTypes = {
  label: PropTypes.string.isRequired,
};

class ReactClassComponent extends Component {
  state = {
    clicks: 0,
  };

  render() {
    const { label } = this.props;
    const { clicks } = this.state;
    return createElement(
      'div',
      {
        onClick: () => this.setState({ clicks: clicks + 1 }),
      },
      createElement('div', { style: { color: 'green' } }, label),
      createElement('div', null, `Clicked ${clicks} times.`)
    );
  }
}

ReactClassComponent.propTypes = {
  label: PropTypes.string.isRequired,
};

export const ReactComponentDemo = () => (
  <div>
    <h1>React component demo</h1>
    <ReactFunctionalComponent label="This is a React functional component rendered by Preact" />
    <hr />
    <ReactClassComponent label="This is a React class component rendered by Preact" />
  </div>
);
