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
import {
  ComponentInputsOutputs,
  getComponentDecoratorMetadata,
  getComponentInputsOutputs,
} from './NgComponentAnalyzer';
import { RenderNgAppService } from './RenderNgAppService';

const getNamesOfInputsOutputsDefinedInProps = (
  ngComponentInputsOutputs: ComponentInputsOutputs,
  props: ICollection = {}
) => {
  const inputs = ngComponentInputsOutputs.inputs
    .filter((i) => i.templateName in props)
    .map((i) => i.templateName);
  const outputs = ngComponentInputsOutputs.outputs
    .filter((o) => o.templateName in props)
    .map((o) => o.templateName);
  return {
    inputs,
    outputs,
    otherProps: Object.keys(props).filter((k) => ![...inputs, ...outputs].includes(k)),
  };
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
  const ngComponentMetadata = getComponentDecoratorMetadata(component);
  const ngComponentInputsOutputs = getComponentInputsOutputs(component);

  const {
    inputs: initialInputs,
    outputs: initialOutputs,
    otherProps: initialOtherProps,
  } = getNamesOfInputsOutputsDefinedInProps(ngComponentInputsOutputs, initialProps);

  const templateInputs = initialInputs.map((i) => `[${i}]="${i}"`).join(' ');
  const templateOutputs = initialOutputs.map((i) => `(${i})="${i}($event)"`).join(' ');

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
      // Initializes properties that are not Inputs | Outputs
      // Allows story props to override local component properties
      initialOtherProps.forEach((p) => {
        (this.storyComponentElementRef as any)[p] = initialProps[p];
      });

      // `markForCheck` the component in case this uses changeDetection: OnPush
      // And then forces the `detectChanges`
      this.storyComponentViewContainerRef.injector.get(ChangeDetectorRef).markForCheck();
      this.changeDetectorRef.detectChanges();

      // Once target component has been initialized, the storyProps$ observable keeps target component inputs up to date
      this.storyPropsSubscription = this.storyProps$
        .pipe(
          skip(1),
          map((props) => {
            // removes component output in props
            const outputsKeyToRemove = ngComponentInputsOutputs.outputs.map((o) => o.templateName);
            return Object.entries(props).reduce(
              (prev, [key, value]) => ({
                ...prev,
                ...(!outputsKeyToRemove.includes(key) && { [key]: value }),
              }),
              {} as ICollection
            );
          }),
          map((props) => {
            // In case a component uses an input with `bindingPropertyName` (ex: @Input('name'))
            // find the value of the local propName in the component Inputs
            // otherwise use the input key
            return Object.entries(props).reduce((prev, [propKey, value]) => {
              const input = ngComponentInputsOutputs.inputs.find((o) => o.templateName === propKey);

              return {
                ...prev,
                ...(input ? { [input.propName]: value } : { [propKey]: value }),
              };
            }, {} as ICollection);
          })
        )
        .subscribe((props) => {
          // Replace inputs with new ones from props
          Object.assign(this.storyComponentElementRef, props);

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
