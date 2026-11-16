import { UPDATE_STORY_ARGS } from "storybook/internal/core-events";
import type {
  Args,
  ArgsStoryFn,
  RenderContext,
  StoryContext,
} from "storybook/internal/types";
import { addons } from "storybook/preview-api";

import { attrTag, isPlainObject } from "./attr-tag";
import type { MarkoRenderer } from "./types";

type Subscriptions = Record<string, (...args: unknown[]) => void>;
const instanceByCanvasElement = new WeakMap<
  MarkoRenderer["canvasElement"],
  Marko.Component
>();
const subscriptionsByInstance = new WeakMap<Marko.Component, Subscriptions>();

export function renderToCanvas(
  ctx: RenderContext<MarkoRenderer>,
  canvasElement: MarkoRenderer["canvasElement"],
) {
  const config = ctx.storyFn();
  const template = config?.component || ctx.storyContext.component;
  let instance = instanceByCanvasElement.get(canvasElement);
  assertHasTemplate(template, ctx);

  if (isTagsAPI(template)) {
    if (instance && ctx.forceRemount) {
      instance.destroy();
      instance = undefined;
      cleanup(canvasElement);
    }

    const input = processInput(config.input || {}, ctx.storyContext, true);
    if (instance) {
      (instance as any as Marko.MountedTemplate).update(input);
    } else {
      instance = template.mount(input, canvasElement) as any;
    }
  } else {
    if (instance && (ctx.forceRemount || !instance.state)) {
      instance = undefined;
      cleanup(canvasElement);
    }

    const input: Record<string, unknown> = {};
    const subscriptions: Subscriptions = {};

    for (const key in config.input) {
      const val = config.input[key];
      const eventName = typeof val === "function" && toEventName(key);

      if (eventName) {
        subscriptions[eventName] = val;
      } else {
        input[key] = val;
      }
    }
    if (instance) {
      const activeSubscriptions = subscriptionsByInstance.get(instance)!;
      (instance as any).input = processInput(input, ctx.storyContext, false);
      instance.update();

      for (const eventName in activeSubscriptions) {
        const fn = activeSubscriptions[eventName];
        if (subscriptions[eventName] !== fn) {
          delete activeSubscriptions[eventName];
          instance.removeListener(eventName, fn);
        }
      }

      for (const eventName in subscriptions) {
        const fn = subscriptions[eventName];
        if (activeSubscriptions[eventName] !== fn) {
          activeSubscriptions[eventName] = fn;
          instance.on(eventName, fn);
        }
      }
    } else {
      instance = template
        .renderSync(processInput(input, ctx.storyContext, false))
        .replaceChildrenOf(canvasElement)
        .getComponent();

      for (const eventName in subscriptions) {
        instance.on(eventName, subscriptions[eventName]);
      }
    }

    subscriptionsByInstance.set(instance, subscriptions);
  }

  instanceByCanvasElement.set(canvasElement, instance!);
  ctx.showMain();

  return () => cleanup(canvasElement);
}

export const render: ArgsStoryFn<MarkoRenderer> = (args, ctx) => {
  const { component } = ctx;
  assertHasTemplate(component, ctx);

  return { component, input: processInput(args, ctx, isTagsAPI(component)) };
};

function isTagsAPI(template: Marko.Template) {
  return !template.renderSync;
}

function assertHasTemplate(
  template: any,
  ctx: { title: string; name: string },
): asserts template is Marko.Template {
  if (!template || !(template.mount || template.renderSync)) {
    throw new Error(
      `Expected a component to be specified in the story: "${ctx.title} > ${ctx.name}".`,
    );
  }
}

function toEventName(method: string) {
  const match = /^on(-)?(.*)$/.exec(method);
  if (match) {
    const [, isDash, eventName] = match;
    return isDash
      ? eventName
      : eventName.charAt(0).toLowerCase() + eventName.slice(1);
  }

  return false;
}

function cleanup(canvasElement: MarkoRenderer["canvasElement"]) {
  const component = instanceByCanvasElement.get(canvasElement);
  if (!component) return;

  component.destroy();
  canvasElement.innerHTML = "";
  instanceByCanvasElement.delete(canvasElement);
  subscriptionsByInstance.delete(component);
}

/**
 * Un-flatten attr tags and add change handlers
 */
function processInput(args: Args, ctx: StoryContext, tagsApi: boolean) {
  const input = {} as typeof args;
  // Attr tags built here, so the story's own arg objects are never changed.
  const built = new WeakSet<object>();

  args: for (const key in args) {
    let path = key;
    let obj = input;
    // Attr tag attributes may be flattened to `@foo > @bar > baz` keys by
    // `flattenAttrTags`
    while (path.startsWith("@")) {
      const i = path.indexOf(" > ");
      const name = path.substring(1, i);
      const value = obj[name];
      if (!built.has(value)) {
        // One tag's attribute can't apply to eg an array of repeated tags.
        if (value !== undefined && !isPlainObject(value)) continue args;
        built.add((obj[name] = attrTag({ ...value })));
      }
      obj = obj[name];
      path = path.substring(i + 3);
    }

    // Normalize body content (given as text; this may run twice per render)
    if (ctx.argTypes[key]?.bodyContent && typeof args[key] === "string") {
      const type = ctx.argTypes[key]?.bodyContent;
      if (tagsApi) {
        obj[path] = /* TODO */ args[key];
      } else {
        if (type === "html") obj[path] = (out: any) => out.html(args[key]);
        else obj[path] = (out: any) => out.text(args[key]);
      }
    } else {
      obj[path] = args[key];
    }

    // Add controllable change handlers
    if (ctx.argTypes[key]?.controllable && !args[key + "Change"]) {
      obj[path + "Change"] = (v: unknown) => {
        // Storybook doesn't re-render a story whose args are fixed (eg those
        // listed in docs), so the component gets the value directly too.
        if (tagsApi) {
          obj[path] = v;
          (
            instanceByCanvasElement.get(ctx.canvasElement) as
              | Marko.MountedTemplate
              | undefined
          )?.update({ ...input });
        }
        addons.getChannel().emit(UPDATE_STORY_ARGS, {
          storyId: ctx.id,
          updatedArgs: { [key]: v },
        });
      };
    }
  }

  return input;
}
