import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  Directive,
  EventEmitter,
  Injectable,
  Input,
  Output,
  Pipe,
  Type,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { getComponentInputsOutputs, isDeclarable } from './NgComponentAnalyzer';

describe('getComponentInputsOutputs', () => {
  it('should return empty if no I/O found', () => {
    @Component({})
    class FooComponent {}

    expect(getComponentInputsOutputs(FooComponent)).toEqual({
      inputs: [],
      outputs: [],
    });

    class BarComponent {}

    expect(getComponentInputsOutputs(BarComponent)).toEqual({
      inputs: [],
      outputs: [],
    });
  });

  it('should return I/O', () => {
    @Component({
      template: '',
      inputs: ['inputInComponentMetadata'],
      outputs: ['outputInComponentMetadata'],
    })
    class FooComponent {
      @Input()
      public input: string;

      @Input('inputPropertyName')
      public inputWithBindingPropertyName: string;

      @Output()
      public output = new EventEmitter<Event>();

      @Output('outputPropertyName')
      public outputWithBindingPropertyName = new EventEmitter<Event>();
    }

    const fooComponentFactory = resolveComponentFactory(FooComponent);

    const { inputs, outputs } = getComponentInputsOutputs(FooComponent);

    expect({ inputs, outputs }).toEqual({
      inputs: [
        { propName: 'inputInComponentMetadata', templateName: 'inputInComponentMetadata' },
        { propName: 'input', templateName: 'input' },
        { propName: 'inputWithBindingPropertyName', templateName: 'inputPropertyName' },
      ],
      outputs: [
        { propName: 'outputInComponentMetadata', templateName: 'outputInComponentMetadata' },
        { propName: 'output', templateName: 'output' },
        { propName: 'outputWithBindingPropertyName', templateName: 'outputPropertyName' },
      ],
    });

    expect(sortByPropName(inputs)).toEqual(sortByPropName(fooComponentFactory.inputs));
    expect(sortByPropName(outputs)).toEqual(sortByPropName(fooComponentFactory.outputs));
  });

  it("should return I/O when some of component metadata has the same name as one of component's properties", () => {
    @Component({
      template: '',
      inputs: ['input', 'inputWithBindingPropertyName'],
      outputs: ['outputWithBindingPropertyName'],
    })
    class FooComponent {
      @Input()
      public input: string;

      @Input('inputPropertyName')
      public inputWithBindingPropertyName: string;

      @Output()
      public output = new EventEmitter<Event>();

      @Output('outputPropertyName')
      public outputWithBindingPropertyName = new EventEmitter<Event>();
    }

    const fooComponentFactory = resolveComponentFactory(FooComponent);

    const { inputs, outputs } = getComponentInputsOutputs(FooComponent);

    expect(sortByPropName(inputs)).toEqual(sortByPropName(fooComponentFactory.inputs));
    expect(sortByPropName(outputs)).toEqual(sortByPropName(fooComponentFactory.outputs));
  });
});

describe('isDeclarable', () => {
  it('should return true with a Component', () => {
    @Component({})
    class FooComponent {}

    expect(isDeclarable(FooComponent)).toEqual(true);
  });

  it('should return true with a Directive', () => {
    @Directive({})
    class FooDirective {}

    expect(isDeclarable(FooDirective)).toEqual(true);
  });

  it('should return true with a Pipe', () => {
    @Pipe({ name: 'pipe' })
    class FooPipe {}

    expect(isDeclarable(FooPipe)).toEqual(true);
  });

  it('should return false with simple class', () => {
    class FooPipe {}

    expect(isDeclarable(FooPipe)).toEqual(false);
  });
  it('should return false with Injectable', () => {
    @Injectable()
    class FooInjectable {}

    expect(isDeclarable(FooInjectable)).toEqual(false);
  });
});

function sortByPropName(
  array: {
    propName: string;
    templateName: string;
  }[]
) {
  return array.sort((a, b) => a.propName.localeCompare(b.propName));
}

function resolveComponentFactory<T extends Type<any>>(component: T): ComponentFactory<T> {
  TestBed.configureTestingModule({
    declarations: [component],
  }).overrideModule(BrowserDynamicTestingModule, {
    set: {
      entryComponents: [component],
    },
  });
  const componentFactoryResolver = TestBed.inject(ComponentFactoryResolver);

  return componentFactoryResolver.resolveComponentFactory(component);
}
