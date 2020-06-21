import React from 'react';
import reactElementToJSXString, { Options } from 'react-element-to-jsx-string';
import { html as beautifyHTML } from 'js-beautify';

import { addons, StoryContext, StoryFn, StoryApi, ClientStoryApi } from '@storybook/addons';
import { logger } from '@storybook/client-logger';

import { SNIPPET_RENDERED } from '../../shared';

type VueComponent = {
  /** The template for the Vue component */
  template?: string;
};

interface JSXOptions extends HTMLBeautifyOptions {
  /** How many wrappers to skip when rendering the jsx */
  skip?: number;
  /** Whether to show the function in the jsx tab */
  showFunctions?: boolean;
  /** Whether to format HTML or Vue markup */
  enableBeautify?: boolean;
  /** Override the display name used for a component */
  displayName?: string | Options['displayName'];
  /** A function ran before the story is rendered */
  onBeforeRender?(dom: string): string;
}

/** Run the user supplied onBeforeRender function if it exists */
const applyBeforeRender = (domString: string, options: JSXOptions) => {
  if (typeof options.onBeforeRender !== 'function') {
    return domString;
  }

  return options.onBeforeRender(domString);
};

/** Apply the users parameters and render the jsx for a story */
const renderJsx = (code: React.ReactElement, options: Required<JSXOptions>) => {
  let renderedJSX = code;
  let Type = renderedJSX.type;

  for (let i = 0; i < options.skip; i += 1) {
    if (typeof renderedJSX === 'undefined') {
      logger.warn('Cannot skip undefined element');
      return null;
    }

    if (React.Children.count(renderedJSX) > 1) {
      logger.warn('Trying to skip an array of elements');
      return null;
    }

    if (typeof renderedJSX.props.children === 'undefined') {
      logger.warn('Not enough children to skip elements.');

      if (typeof Type === 'function' && Type.name === '') {
        renderedJSX = <Type {...renderedJSX.props} />;
      }
    } else if (typeof renderedJSX.props.children === 'function') {
      renderedJSX = renderedJSX.props.children();
    } else {
      renderedJSX = renderedJSX.props.children;
    }
  }

  if (typeof code === 'undefined') {
    logger.warn('Too many skip or undefined component');
    return null;
  }

  while (typeof Type === 'function' && Type.name === '') {
    renderedJSX = <Type {...renderedJSX.props} />;
    Type = renderedJSX.type;
  }

  const ooo =
    typeof options.displayName === 'string'
      ? {
          ...options,
          showFunctions: true,
          displayName: () => options.displayName,
        }
      : options;

  return React.Children.map(code, (c) => {
    let string = applyBeforeRender(reactElementToJSXString(c, ooo as Options), options);
    const matches = string.match(/\S+=\\"([^"]*)\\"/g);

    if (matches) {
      matches.forEach((match) => {
        string = string.replace(match, match.replace(/&quot;/g, "'"));
      });
    }

    return string;
  }).join('\n');
};

const defaultOpts = {
  skip: 0,
  showFunctions: true,
  enableBeautify: true,
};

export const jsxDecorator = (storyFn: any, context: StoryContext) => {
  const story: ReturnType<typeof storyFn> & VueComponent = storyFn();

  const channel = addons.getChannel();

  const options = {
    ...defaultOpts,
    ...((context && context.parameters.jsx) || {}),
  } as Required<JSXOptions>;

  let jsx = '';
  if (story.template) {
    if (options.enableBeautify) {
      jsx = beautifyHTML(story.template, options);
    } else {
      jsx = story.template;
    }
  } else {
    const rendered = renderJsx(story, options);

    if (rendered) {
      jsx = rendered;
    }
  }

  channel.emit(SNIPPET_RENDERED, (context || {}).id, jsx);

  return story;
};
