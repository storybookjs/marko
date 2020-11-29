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

  it('static class', () => {
    expect(
      vnodeToString(
        getVNode({
          template: `<button class="foo bar">Button</button>`,
        })
      )
    ).toMatchInlineSnapshot(`<button class="foo bar">Button</button>`);
  });

  it('string dynamic class', () => {
    expect(
      vnodeToString(
        getVNode({
          template: `<button :class="'foo'">Button</button>`,
        })
      )
    ).toMatchInlineSnapshot(`<button class="foo">Button</button>`);
  });

  it('non-string dynamic class', () => {
    expect(
      vnodeToString(
        getVNode({
          template: `<button :class="1">Button</button>`,
        })
      )
    ).toMatchInlineSnapshot(`<button >Button</button>`);
  });

  it('array dynamic class', () => {
    expect(
      vnodeToString(
        getVNode({
          template: `<button :class="['foo', null, false, 0, {bar: true, baz: false}]">Button</button>`,
        })
      )
    ).toMatchInlineSnapshot(`<button class="foo bar">Button</button>`);
  });

  it('object dynamic class', () => {
    expect(
      vnodeToString(
        getVNode({
          template: `<button :class="{foo: true, bar: false}">Button</button>`,
        })
      )
    ).toMatchInlineSnapshot(`<button class="foo">Button</button>`);
  });

  it('merge dynamic and static classes', () => {
    expect(
      vnodeToString(
        getVNode({
          template: `<button class="foo" :class="{bar: null, baz: 1}">Button</button>`,
        })
      )
    ).toMatchInlineSnapshot(`<button class="foo baz">Button</button>`);
  });

  it('attributes', () => {
    const MyComponent: ComponentOptions<any, any, any> = {
      props: ['propA', 'propB', 'propC', 'propD', 'propE', 'propF', 'propG'],
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
                propE: true,
                propF() {
                  const foo = 'bar';

                  return foo;
                },
                propG: undefined,
              },
            };
          },
          template: `<my-component v-bind="props"/>`,
        })
      )
    ).toMatchInlineSnapshot(
      `<my-component propE :propD='{"foo":"bar"}' :propC="null" :propB="1" propA="propA"/>`
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
