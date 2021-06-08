import { RenderStoryFunction } from "@storybook/core-client";
import rootTemplate from "./template.marko";
import win from "./globals";

const document = win.document as Document;
const rootEl = document.getElementById("root");
const activeSubscriptions: Record<string, (...args: unknown[]) => void> = {};
let rootComponent: any = null; // a permanently mounted component which the current story is rendered into.
let activeTemplate: any = null; // template for the currently loaded component.
let activeStoryId: string | null = null; // used to determine if we've switched stories.

const renderMain: RenderStoryFunction = (ctx) => {
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

  const component = config.component || ctx.parameters.component;
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

  if (!rootComponent) {
    activeStoryId = ctx.id;
    rootComponent = rootTemplate
      .renderSync({ input, component })
      .appendTo(rootEl)
      .getComponent();
  } else {
    if (activeStoryId === ctx.id && activeTemplate === component) {
      // When rendering the same template with new input, we reuse the same instance.
      for (const eventName in activeSubscriptions) {
        const fn = activeSubscriptions[eventName];
        if (subscriptions[eventName] !== fn) {
          delete activeSubscriptions[eventName];
          rootComponent.getComponent("story").removeListener(eventName, fn);
        }
      }
    } else {
      for (const eventName in activeSubscriptions) {
        delete activeSubscriptions[eventName];
      }
    }

    rootComponent.input = { input, component };
    rootComponent.update();
  }

  for (const eventName in subscriptions) {
    const fn = subscriptions[eventName];
    if (activeSubscriptions[eventName] !== fn) {
      activeSubscriptions[eventName] = fn;
      rootComponent.getComponent("story").on(eventName, fn);
    }
  }

  activeStoryId = ctx.id;
  activeTemplate = component;
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
