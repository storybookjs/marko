import React from 'react';
import { IStory, StoryContext } from '@storybook/angular';
import { ElementRendererService } from '@storybook/angular/element-renderer';
import { StoryFn } from '@storybook/addons';

const customElementsVersions: Record<string, number> = {};

/**
 * Uses angular element to generate on-the-fly web components and reference it with `customElements`
 * then it is added into react
 */
export const prepareForInline = (storyFn: StoryFn<IStory>, { id, parameters }: StoryContext) => {
  // Upgrade story version in order that the next defined component has a unique key
  customElementsVersions[id] =
    customElementsVersions[id] !== undefined ? customElementsVersions[id] + 1 : 0;

  const customElementsName = `${id}_${customElementsVersions[id]}`;

  const Story = class Story extends React.Component {
    wrapperRef: React.RefObject<unknown>;

    elementName: string;

    constructor(props: any) {
      super(props);
      this.wrapperRef = React.createRef();
    }

    async componentDidMount() {
      // eslint-disable-next-line no-undef
      customElements.define(
        customElementsName,
        await new ElementRendererService().renderAngularElement({
          storyFnAngular: storyFn(),
          parameters,
        })
      );
    }

    render() {
      return React.createElement(customElementsName, {
        ref: this.wrapperRef,
      });
    }
  };
  return React.createElement(Story);
};
