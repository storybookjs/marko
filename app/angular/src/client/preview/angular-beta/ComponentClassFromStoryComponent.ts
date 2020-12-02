import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { map, skip } from 'rxjs/operators';

import { ICollection } from '../types';
import { STORY_PROPS } from './app.token';
import { RenderNgAppService } from './RenderNgAppService';

const findComponentDecoratorMetadata = (component: any) => {
  const decoratorKey = '__annotations__';
  const decorators: any[] =
    Reflect &&
    Reflect.getOwnPropertyDescriptor &&
    Reflect.getOwnPropertyDescriptor(component, decoratorKey)
      ? Reflect.getOwnPropertyDescriptor(component, decoratorKey).value
      : (component as any)[decoratorKey];

  const ngComponentDecorator: Component | undefined = decorators.find(
    (decorator) => decorator instanceof Component
  );

  return ngComponentDecorator;
};

const toInputsOutputs = (props: ICollection = {}) => {
  return Object.entries(props).reduce(
    (previousValue, [key, value]) => {
      if (typeof value === 'function') {
        return { ...previousValue, outputs: { ...previousValue.outputs, [key]: value } };
      }

      return { ...previousValue, inputs: { ...previousValue.inputs, [key]: value } };
    },
    { inputs: {}, outputs: {} } as { inputs: Record<string, any>; outputs: Record<string, any> }
  );
};

/**
 * Wraps the story component into a component
 *
 * @param component
 * @param initialProps
 */
export const createComponentClassFromStoryComponent = (
  component: any,
  initialProps?: ICollection
): Type<any> => {
  const ngComponentMetadata = findComponentDecoratorMetadata(component);

  const { inputs: initialInputs, outputs: initialOutputs } = toInputsOutputs(initialProps);

  const templateInputs = Object.keys(initialInputs)
    .map((i) => `[${i}]="${i}"`)
    .join(' ');
  const templateOutputs = Object.keys(initialOutputs)
    .map((i) => `(${i})="${i}($event)"`)
    .join(' ');

  @Component({
    selector: RenderNgAppService.SELECTOR_STORYBOOK_WRAPPER,
    // Simulates the `component` integration in a template
    // `props` are converted into Inputs/Outputs to be added directly in the template so as the component can use them during its initailization
    // - The outputs are connected only once here
    // - Only inputs present in initial `props` value are added. They will be overwritten and completed as necessary after the component is initialized
    template: `<${ngComponentMetadata.selector} ${templateInputs} ${templateOutputs} #storyComponentRef></${ngComponentMetadata.selector}>`,
  })
  class StoryBookComponentWrapperComponent implements AfterViewInit, OnDestroy {
    private storyPropsSubscription: Subscription;

    @ViewChild('storyComponentRef', { static: true }) storyComponentElementRef: ElementRef;

    @ViewChild('storyComponentRef', { read: ViewContainerRef, static: true })
    storyComponentViewContainerRef: ViewContainerRef;

    constructor(
      @Inject(STORY_PROPS) private storyProps$: Subject<ICollection | undefined>,
      private changeDetectorRef: ChangeDetectorRef
    ) {
      // Initializes template Inputs/Outputs values
      Object.assign(this, initialProps);
    }

    ngAfterViewInit(): void {
      // Once target component has been initialized, the storyProps$ observable keeps target component inputs up to date
      this.storyPropsSubscription = this.storyProps$
        .pipe(skip(1), map(toInputsOutputs))
        .subscribe(({ inputs }) => {
          // Replace inputs with new ones from props
          Object.assign(this.storyComponentElementRef, inputs);

          // `markForCheck` the component in case this uses changeDetection: OnPush
          // And then forces the `detectChanges`
          this.storyComponentViewContainerRef.injector.get(ChangeDetectorRef).markForCheck();
          this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy(): void {
      if (this.storyPropsSubscription != null) {
        this.storyPropsSubscription.unsubscribe();
      }
    }
  }
  return StoryBookComponentWrapperComponent;
};
