/* global window */
/* eslint-disable import/no-extraneous-dependencies */
import { addParameters } from '@storybook/client-api';
import React from 'react';
import { render } from 'lit-html';
import { extractArgTypes, extractComponentDescription } from './custom-elements';

addParameters({
  docs: {
    extractArgTypes,
    extractComponentDescription,
    inlineStories: true,
    prepareForInline: (storyFn) => {
      class Story extends React.Component {
        constructor(props) {
          super(props);
          this.wrapperRef = React.createRef();
        }

        componentDidMount() {
          render(storyFn(), this.wrapperRef.current);
        }

        render() {
          return React.createElement('div', { ref: this.wrapperRef });
        }
      }

      return React.createElement(Story);
    },
  },
});
