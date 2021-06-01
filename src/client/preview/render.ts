import { RenderStoryFunction } from "@storybook/core-client";
import win from "./globals";

const document = win.document as Document;
const rootEl = document.getElementById("root");
const activeSubscriptions: Record<string, (...args: unknown[]) => void> = {};
let activeComponent: any = null; // currently loaded marko component.
let activeTemplate: any = null; // template for the currently loaded component.
let activeStoryId: string | null = null; // used to determine if we've switched stories.

const renderMain: RenderStoryFunction = (ctx) => {
  const isSameStory = activeStoryId === (activeStoryId = ctx.id);
  const config = ctx.storyFn();

  if (!config || !(config.component || ctx.parameters.component)) {
    ctx.showError({
      title: `Expecting an object with a component property to be returned from the story: "${ctx.name}" of "${ctx.kind}".`,
      description: `\
        Did you forget to return the component from the story?\
        Use "() => ({ component: MyComponent, input: { hello: 'world' } })" when defining the story.\
      `,
    });

    return;
  }

  const template = config.component || ctx.parameters.component;
  const input: Record<string, unknown> = {};
  const subscriptions: typeof activeSubscriptions = {};

  for (const key in config.input) {
    const val = config.input[key];
    const eventName = typeof val === "function" && toEventName(key);

    if (eventName) {
      subscriptions[eventName] = val;
    } else {
      input[key] = val;
    }
  }

  if (isSameStory && activeTemplate === template) {
    // When rendering the same template with new input, we reuse the same instance.
    for (const eventName in activeSubscriptions) {
      const fn = activeSubscriptions[eventName];
      if (subscriptions[eventName] !== fn) {
        delete activeSubscriptions[eventName];
        activeComponent.removeListener(eventName, fn);
      }
    }

    activeComponent.input = input;
    activeComponent.update();
  } else {
    if (activeComponent) {
      for (const eventName in activeSubscriptions) {
        delete activeSubscriptions[eventName];
      }
      activeComponent.destroy();
    }

    activeTemplate = template;
    activeComponent = activeTemplate
      .renderSync(input)
      .appendTo(rootEl)
      .getComponent();
  }

  for (const eventName in subscriptions) {
    const fn = subscriptions[eventName];
    if (activeSubscriptions[eventName] !== fn) {
      activeSubscriptions[eventName] = fn;
      activeComponent.on(eventName, fn);
    }
  }

  ctx.showMain();
};

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

export { renderMain as default };
