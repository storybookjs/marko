import type { ArgsStoryFn, RenderContext } from "storybook/internal/types";
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

    if (instance) {
      (instance as any as Marko.MountedTemplate).update(config.input || {});
    } else {
      instance = template.mount(config.input || {}, canvasElement) as any;
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
      (instance as any).input = input;
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
        .renderSync(input)
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
  return { component, input: args };
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
