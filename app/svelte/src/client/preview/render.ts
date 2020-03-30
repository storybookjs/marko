import { detach, insert, noop } from 'svelte/internal';
import { document } from 'global';
import dedent from 'ts-dedent';
import { MountViewArgs, RenderContext } from './types';

type Component = any;

let previousComponent: Component = null;

function cleanUpPreviousStory() {
  if (!previousComponent) {
    return;
  }
  previousComponent.$destroy();
  previousComponent = null;
}

function createSlotFn(element: any) {
  return [
    function createSlot() {
      return {
        c: noop,
        m: function mount(target: any, anchor: any) {
          insert(target, element, anchor);
        },
        d: function destroy(detaching: boolean) {
          if (detaching) {
            detach(element);
          }
        },
        l: noop,
      };
    },
  ];
}

function createSlots(slots: Record<string, any>): Record<string, any> {
  return Object.entries(slots).reduce((acc, [slotName, element]) => {
    acc[slotName] = createSlotFn(element);
    return acc;
  }, {} as Record<string, any>);
}

function mountView({ Component, target, props, on, Wrapper, WrapperData }: MountViewArgs) {
  let component: Component;

  if (Wrapper) {
    const fragment = document.createDocumentFragment();
    component = new Component({ target: fragment, props });

    const wrapper = new Wrapper({
      target,
      props: {
        ...WrapperData,
        $$slots: createSlots({ default: fragment }),
        $$scope: {},
      },
    });
    component.$on('destroy', () => {
      wrapper.$destroy(true);
    });
  } else {
    component = new Component({ target, props });
  }

  if (on) {
    // Attach svelte event listeners.
    Object.keys(on).forEach((eventName) => {
      component.$on(eventName, on[eventName]);
    });
  }

  previousComponent = component;
}

export default function render({ storyFn, kind, name, showMain, showError }: RenderContext) {
  const {
    /** @type {SvelteComponent} */
    Component,
    /** @type {any} */
    props,
    /** @type {{[string]: () => {}}} Attach svelte event handlers */
    on,
    Wrapper,
    WrapperData,
  } = storyFn();

  cleanUpPreviousStory();
  const DefaultCompatComponent = Component ? Component.default || Component : undefined;
  const DefaultCompatWrapper = Wrapper ? Wrapper.default || Wrapper : undefined;

  if (!DefaultCompatComponent) {
    showError({
      title: `Expecting a Svelte component from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the Svelte component configuration from the story?
        Use "() => ({ Component: YourComponent, data: {} })"
        when defining the story.
      `,
    });

    return;
  }

  const target = document.getElementById('root');

  target.innerHTML = '';

  mountView({
    Component: DefaultCompatComponent,
    target,
    props,
    on,
    Wrapper: DefaultCompatWrapper,
    WrapperData,
  });

  showMain();
}
