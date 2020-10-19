/* eslint no-underscore-dangle: ["error", { "allow": ["_vnode"] }] */

import { ComponentOptions } from 'vue';
import Vue from 'vue/dist/vue';
import { vnodeToString } from './sourceDecorator';

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val) => typeof val === 'string',
});

const getVNode = (Component: ComponentOptions<any, any, any>) => {
  const vm = new Vue({
    render(h: (c: any) => unknown) {
      return h(Component);
    },
  }).$mount();

  return vm.$children[0]._vnode;
};

describe('vnodeToString', () => {
  it('basic', () => {
    expect(
      vnodeToString(
        getVNode({
          template: `<button>Button</button>`,
        })
      )
    ).toMatchInlineSnapshot(`<button >Button</button>`);
  });

  it('attributes', () => {
    const MyComponent: ComponentOptions<any, any, any> = {
      props: ['propA', 'propB', 'propC', 'propD'],
      template: '<div/>',
    };

    expect(
      vnodeToString(
        getVNode({
          components: { MyComponent },
          data(): { props: Record<string, any> } {
            return {
              props: {
                propA: 'propA',
                propB: 1,
                propC: null,
                propD: {
                  foo: 'bar',
                },
              },
            };
          },
          template: `<my-component v-bind="props"/>`,
        })
      )
    ).toMatchInlineSnapshot(
      `<my-component :propD='{"foo":"bar"}' :propC="null" :propB="1" propA="propA"/>`
    );
  });

  it('children', () => {
    expect(
      vnodeToString(
        getVNode({
          template: `
          <div>
            <form>
              <button>Button</button>
            </form>
          </div>`,
        })
      )
    ).toMatchInlineSnapshot(`<div ><form ><button >Button</button></form></div>`);
  });
});
