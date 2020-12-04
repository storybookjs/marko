import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  Output,
  Type,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { getComponentInputsOutputs } from './NgComponentAnalyzer';

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
