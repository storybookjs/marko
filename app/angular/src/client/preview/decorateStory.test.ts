import { Component, Input, Output } from '@angular/core';
import { DecoratorFunction, StoryContext } from '@storybook/addons';
import { componentWrapperDecorator } from './decorators';

import decorateStory from './decorateStory';
import { StoryFnAngularReturnType } from './types';

describe('decorateStory', () => {
  describe('angular behavior', () => {
    it('should use componentWrapperDecorator with args', () => {
      const decorators: DecoratorFunction<StoryFnAngularReturnType>[] = [
        componentWrapperDecorator(ParentComponent, ({ args }) => args),
        componentWrapperDecorator(
          (story) => `<grandparent [grandparentInput]="grandparentInput">${story}</grandparent>`,
          ({ args }) => args
        ),
        componentWrapperDecorator((story) => `<great-grandparent>${story}</great-grandparent>`),
      ];
      const decorated = decorateStory(() => ({ template: '</child>' }), decorators);

      expect(
        decorated(
          makeContext({
            parameters: { component: FooComponent },
            args: {
              parentInput: 'Parent input',
              grandparentInput: 'grandparent input',
              parentOutput: () => {},
            },
          })
        )
      ).toEqual({
        props: {
          parentInput: 'Parent input',
          grandparentInput: 'grandparent input',
          parentOutput: expect.any(Function),
        },
        template:
          '<great-grandparent><grandparent [grandparentInput]="grandparentInput"><parent [parentInput]="parentInput" (parentOutput)="parentOutput($event)"></child></parent></grandparent></great-grandparent>',
      });
    });

    it('should use componentWrapperDecorator with input / output', () => {
      const decorators: DecoratorFunction<StoryFnAngularReturnType>[] = [
        componentWrapperDecorator(ParentComponent, {
          parentInput: 'Parent input',
          parentOutput: () => {},
        }),
        componentWrapperDecorator(
          (story) => `<grandparent [grandparentInput]="grandparentInput">${story}</grandparent>`,
          {
            grandparentInput: 'Grandparent input',
            sameInput: 'Should be override by story props',
          }
        ),
        componentWrapperDecorator((story) => `<great-grandparent>${story}</great-grandparent>`),
      ];
      const decorated = decorateStory(
        () => ({ template: '</child>', props: { sameInput: 'Story input' } }),
        decorators
      );

      expect(
        decorated(
          makeContext({
            parameters: { component: FooComponent },
          })
        )
      ).toEqual({
        props: {
          parentInput: 'Parent input',
          parentOutput: expect.any(Function),
          grandparentInput: 'Grandparent input',
          sameInput: 'Story input',
        },
        template:
          '<great-grandparent><grandparent [grandparentInput]="grandparentInput"><parent [parentInput]="parentInput" (parentOutput)="parentOutput($event)"></child></parent></grandparent></great-grandparent>',
      });
    });

    it('should use componentWrapperDecorator', () => {
      const decorators: DecoratorFunction<StoryFnAngularReturnType>[] = [
        componentWrapperDecorator(ParentComponent),
        componentWrapperDecorator((story) => `<grandparent>${story}</grandparent>`),
        componentWrapperDecorator((story) => `<great-grandparent>${story}</great-grandparent>`),
      ];
      const decorated = decorateStory(() => ({ template: '</child>' }), decorators);

      expect(decorated(makeContext({ parameters: { component: FooComponent } }))).toEqual({
        template:
          '<great-grandparent><grandparent><parent></child></parent></grandparent></great-grandparent>',
      });
    });

    it('should use template in preference to component parameters', () => {
      const decorators: DecoratorFunction<StoryFnAngularReturnType>[] = [
        (s) => {
          const story = s();
          return {
            ...story,
            template: `<parent>${story.template}</parent>`,
          };
        },
        (s) => {
          const story = s();
          return {
            ...story,
            template: `<grandparent>${story.template}</grandparent>`,
          };
        },
        (s) => {
          const story = s();
          return {
            ...story,
            template: `<great-grandparent>${story.template}</great-grandparent>`,
          };
        },
      ];
      const decorated = decorateStory(() => ({ template: '</child>' }), decorators);

      expect(decorated(makeContext({ parameters: { component: FooComponent } }))).toEqual({
        template:
          '<great-grandparent><grandparent><parent></child></parent></grandparent></great-grandparent>',
      });
    });

    it('should include story templates in decorators', () => {
      const decorators: DecoratorFunction<StoryFnAngularReturnType>[] = [
        (s) => {
          const story = s();
          return {
            ...story,
            template: `<parent>${story.template}</parent>`,
          };
        },
        (s) => {
          const story = s();
          return {
            ...story,
            template: `<grandparent>${story.template}</grandparent>`,
          };
        },
        (s) => {
          const story = s();
          return {
            ...story,
            template: `<great-grandparent>${story.template}</great-grandparent>`,
          };
        },
      ];
      const decorated = decorateStory(() => ({ template: '</child>' }), decorators);

      expect(decorated()).toEqual({
        template:
          '<great-grandparent><grandparent><parent></child></parent></grandparent></great-grandparent>',
      });
    });

    it('should include story components in decorators', () => {
      const decorators: DecoratorFunction<StoryFnAngularReturnType>[] = [
        (s) => {
          const story = s();
          return {
            ...story,
            template: `<parent>${story.template}</parent>`,
          };
        },
        (s) => {
          const story = s();
          return {
            ...story,
            template: `<grandparent>${story.template}</grandparent>`,
          };
        },
        (s) => {
          const story = s();
          return {
            ...story,
            template: `<great-grandparent>${story.template}</great-grandparent>`,
          };
        },
      ];
      const decorated = decorateStory(() => ({}), decorators);

      expect(decorated(makeContext({ parameters: { component: FooComponent } }))).toEqual({
        template:
          '<great-grandparent><grandparent><parent><foo></foo></parent></grandparent></great-grandparent>',
      });
    });

    it('should include legacy story components in decorators', () => {
      const decorators: DecoratorFunction<StoryFnAngularReturnType>[] = [
        (s) => {
          const story = s();
          return {
            ...story,
            template: `<parent>${story.template}</parent>`,
          };
        },
        (s) => {
          const story = s();
          return {
            ...story,
            template: `<grandparent>${story.template}</grandparent>`,
          };
        },
        (s) => {
          const story = s();
          return {
            ...story,
            template: `<great-grandparent>${story.template}</great-grandparent>`,
          };
        },
      ];
      const decorated = decorateStory(() => ({ component: FooComponent }), decorators);

      expect(decorated()).toEqual({
        template:
          '<great-grandparent><grandparent><parent><foo></foo></parent></grandparent></great-grandparent>',
        component: FooComponent,
      });
    });

    it('should keep template with an empty value', () => {
      const decorators: DecoratorFunction<StoryFnAngularReturnType>[] = [
        componentWrapperDecorator(ParentComponent),
      ];
      const decorated = decorateStory(() => ({ template: '' }), decorators);

      expect(decorated(makeContext({ parameters: { component: FooComponent } }))).toEqual({
        template: '<parent></parent>',
      });
    });

    it('should only keeps args with a control or an action in argTypes', () => {
      const decorated = decorateStory(
        (context: StoryContext) => ({
          template: `Args available in the story : ${Object.keys(context.args).join()}`,
        }),
        []
      );

      expect(
        decorated(
          makeContext({
            parameters: { component: FooComponent },
            argTypes: {
              withControl: { control: { type: 'object' }, name: 'withControl' },
              withAction: { action: 'onClick', name: 'withAction' },
              toRemove: { name: 'toRemove' },
            },
            args: {
              withControl: 'withControl',
              withAction: () => ({}),
              toRemove: 'toRemove',
            },
          })
        )
      ).toEqual({
        template: 'Args available in the story : withControl,withAction',
      });
    });
  });

  describe('default behavior', () => {
    it('calls decorators in out to in order', () => {
      const decorators: DecoratorFunction<StoryFnAngularReturnType>[] = [
        (s) => {
          const story = s();
          return { ...story, props: { a: [...story.props.a, 1] } };
        },
        (s) => {
          const story = s();
          return { ...story, props: { a: [...story.props.a, 2] } };
        },
        (s) => {
          const story = s();
          return { ...story, props: { a: [...story.props.a, 3] } };
        },
      ];
      const decorated = decorateStory(() => ({ props: { a: [0] } }), decorators);

      expect(decorated()).toEqual({ props: { a: [0, 1, 2, 3] } });
    });

    it('passes context through to sub decorators', () => {
      const decorators: DecoratorFunction<StoryFnAngularReturnType>[] = [
        (s, c) => {
          const story = s({ ...c, k: 1 });
          return { ...story, props: { a: [...story.props.a, c.k] } };
        },
        (s, c) => {
          const story = s({ ...c, k: 2 });
          return { ...story, props: { a: [...story.props.a, c.k] } };
        },
        (s, c) => {
          const story = s({ ...c, k: 3 });
          return { ...story, props: { a: [...story.props.a, c.k] } };
        },
      ];
      const decorated = decorateStory((c: StoryContext) => ({ props: { a: [c.k] } }), decorators);

      expect(decorated(makeContext({ k: 0 }))).toEqual({ props: { a: [1, 2, 3, 0] } });
    });

    it('DOES NOT merge parameter or pass through parameters key in context', () => {
      const decorators: DecoratorFunction<StoryFnAngularReturnType>[] = [
        (s, c) => {
          const story = s({ ...c, k: 1, parameters: { p: 1 } });
          return {
            ...story,
            props: { a: [...story.props.a, c.k], p: [...story.props.p, c.parameters.p] },
          };
        },
        (s, c) => {
          const story = s({ ...c, k: 2, parameters: { p: 2 } });
          return {
            ...story,
            props: { a: [...story.props.a, c.k], p: [...story.props.p, c.parameters.p] },
          };
        },
        (s, c) => {
          const story = s({ ...c, k: 3, parameters: { p: 3 } });
          return {
            ...story,
            props: { a: [...story.props.a, c.k], p: [...story.props.p, c.parameters.p] },
          };
        },
      ];
      const decorated = decorateStory(
        (c: StoryContext) => ({ props: { a: [c.k], p: [c.parameters.p] } }),
        decorators
      );

      expect(decorated(makeContext({ k: 0, parameters: { p: 0 } }))).toEqual({
        props: { a: [1, 2, 3, 0], p: [0, 0, 0, 0] },
      });
    });
  });
});

function makeContext(input: Record<string, unknown>): StoryContext {
  return {
    id: 'id',
    kind: 'kind',
    name: 'name',
    viewMode: 'story',
    parameters: {},
    ...input,
  } as StoryContext;
}

@Component({
  selector: 'foo',
  template: `foo`,
})
class FooComponent {}

@Component({
  selector: 'parent',
  template: `<ng-content></ng-content>`,
})
class ParentComponent {
  @Input()
  parentInput: string;

  @Output()
  parentOutput: any;
}
