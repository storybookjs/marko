import React from 'react';
import { Source, SourceError } from './Source';

export const componentMeta = {
  title: 'Docs|Source',
  Component: Source,
};

const noStoryProps = { error: SourceError.NO_STORY };
export const noStory = () => <Source {...noStoryProps} />;
noStory.title = 'no story';
noStory.props = noStoryProps;

const sourceUnavailableProps = { error: SourceError.SOURCE_UNAVAILABLE };
export const sourceUnavailable = () => <Source {...sourceUnavailableProps} />;
sourceUnavailable.title = 'source unavailable';
sourceUnavailable.props = sourceUnavailableProps;

const jsxCode = `
<MyComponent boolProp scalarProp={1} complexProp={{ foo: 1, bar: '2' }}>
  <SomeOtherComponent funcProp={(a) => a.id} />
</MyComponent>
`.trim();

const jsxProps = {
  code: jsxCode,
  language: 'jsx',
};
export const jsx = () => <Source {...jsxProps} />;
jsx.props = jsxProps;

const cssCode = `
@-webkit-keyframes blinker {
  from { opacity: 1.0; }
  to { opacity: 0.0; }
}

.waitingForConnection {
  -webkit-animation-name: blinker;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: cubic-bezier(.5, 0, 1, 1);
  -webkit-animation-duration: 1.7s;
}
`.trim();

export const css = () => <Source code={cssCode} language="css" />;
