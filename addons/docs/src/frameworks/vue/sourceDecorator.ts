/* eslint no-underscore-dangle: ["error", { "allow": ["_vnode"] }] */

import { addons, StoryContext } from '@storybook/addons';
import { logger } from '@storybook/client-logger';
import prettier from 'prettier/standalone';
import prettierHtml from 'prettier/parser-html';
import Vue from 'vue';

import { SourceType, SNIPPET_RENDERED } from '../../shared';

export const skipSourceRender = (context: StoryContext) => {
  const sourceParams = context?.parameters.docs?.source;
  const isArgsStory = context?.parameters.__isArgsStory;

  // always render if the user forces it
  if (sourceParams?.type === SourceType.DYNAMIC) {
    return false;
  }

  // never render if the user is forcing the block to render code, or
  // if the user provides code, or if it's not an args story.
  return !isArgsStory || sourceParams?.code || sourceParams?.type === SourceType.CODE;
};

export const sourceDecorator = (storyFn: any, context: StoryContext) => {
  const story = storyFn();

  // See ../react/jsxDecorator.tsx
  if (skipSourceRender(context)) {
    return story;
  }

  try {
    // Creating a Vue instance each time is very costly. But we need to do it
    // in order to access VNode, otherwise vm.$vnode will be undefined.
    // Also, I couldn't see any notable difference from the implementation with
    // per-story-cache.
    // But if there is a more performant way, we should replace it with that ASAP.
    const vm = new Vue({
      data() {
        return {
          STORYBOOK_VALUES: context.args,
        };
      },
      render(h) {
        return h(story);
      },
    }).$mount();

    const channel = addons.getChannel();

    const storyComponent = getStoryComponent(story.options.STORYBOOK_WRAPS);

    const storyNode = lookupStoryInstance(vm, storyComponent);

    const code = vnodeToString(storyNode._vnode);

    channel.emit(
      SNIPPET_RENDERED,
      (context || {}).id,
      prettier.format(`<template>${code}</template>`, {
        parser: 'vue',
        plugins: [prettierHtml],
        // Because the parsed vnode missing spaces right before/after the surround tag,
        // we always get weird wrapped code without this option.
        htmlWhitespaceSensitivity: 'ignore',
      })
    );
  } catch (e) {
    logger.warn(`Failed to generate dynamic story source: ${e}`);
  }

  return story;
};

export function vnodeToString(vnode: Vue.VNode): string {
  const attrString = [
    ...(vnode.data?.slot ? ([['slot', vnode.data.slot]] as [string, any][]) : []),
    ...(vnode.componentOptions?.propsData ? Object.entries(vnode.componentOptions.propsData) : []),
    ...(vnode.data?.attrs ? Object.entries(vnode.data.attrs) : []),
  ]
    .filter(([name], index, list) => list.findIndex((item) => item[0] === name) === index)
    .map(([name, value]) => stringifyAttr(name, value))
    .filter(Boolean)
    .join(' ');

  if (!vnode.componentOptions) {
    // Non-component elements (div, span, etc...)
    if (vnode.tag) {
      if (!vnode.children) {
        return `<${vnode.tag} ${attrString}/>`;
      }

      return `<${vnode.tag} ${attrString}>${vnode.children.map(vnodeToString).join('')}</${
        vnode.tag
      }>`;
    }

    // TextNode
    if (vnode.text) {
      if (/[<>"&]/.test(vnode.text)) {
        return `{{\`${vnode.text.replace(/`/g, '\\`')}\`}}`;
      }

      return vnode.text;
    }

    // Unknown
    return '';
  }

  // Probably users never see the "unknown-component". It seems that vnode.tag
  // is always set.
  const tag = vnode.componentOptions.tag || vnode.tag || 'unknown-component';

  if (!vnode.componentOptions.children) {
    return `<${tag} ${attrString}/>`;
  }

  return `<${tag} ${attrString}>${vnode.componentOptions.children
    .map(vnodeToString)
    .join('')}</${tag}>`;
}

function stringifyAttr(attrName: string, value?: any): string | null {
  if (typeof value === 'undefined') {
    return null;
  }

  if (value === true) {
    return attrName;
  }

  if (typeof value === 'string') {
    return `${attrName}=${quote(value)}`;
  }

  // TODO: Better serialization (unquoted object key, Symbol/Classes, etc...)
  //       Seems like Prettier don't format JSON-look object (= when keys are quoted)
  return `:${attrName}=${quote(JSON.stringify(value))}`;
}

function quote(value: string) {
  return value.includes(`"`) && !value.includes(`'`)
    ? `'${value}'`
    : `"${value.replace(/"/g, '&quot;')}"`;
}

/**
 * Skip decorators and grab a story component itself.
 * https://github.com/pocka/storybook-addon-vue-info/pull/113
 */
function getStoryComponent(w: any) {
  let matched = w;

  while (
    matched &&
    matched.options &&
    matched.options.components &&
    matched.options.components.story &&
    matched.options.components.story.options &&
    matched.options.components.story.options.STORYBOOK_WRAPS
  ) {
    matched = matched.options.components.story.options.STORYBOOK_WRAPS;
  }
  return matched;
}

interface VueInternal {
  // We need to access this private property, in order to grab the vnode of the
  // component instead of the "vnode of the parent of the component".
  // Probably it's safe to rely on this because vm.$vnode is a reference for this.
  // https://github.com/vuejs/vue/issues/6070#issuecomment-314389883
  _vnode: Vue.VNode;
}

/**
 * Find the story's instance from VNode tree.
 */
function lookupStoryInstance(instance: Vue, storyComponent: any): (Vue & VueInternal) | null {
  if (
    instance.$vnode &&
    instance.$vnode.componentOptions &&
    instance.$vnode.componentOptions.Ctor === storyComponent
  ) {
    return instance as Vue & VueInternal;
  }

  for (let i = 0, l = instance.$children.length; i < l; i += 1) {
    const found = lookupStoryInstance(instance.$children[i], storyComponent);

    if (found) {
      return found;
    }
  }

  return null;
}
