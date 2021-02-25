import { Component, EventEmitter, Input, NgModule, Output, Type } from '@angular/core';

import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { ICollection } from '../types';
import { getStorybookModuleMetadata } from './StorybookModule';

describe('StorybookModule', () => {
  describe('getStorybookModuleMetadata', () => {
    describe('with simple component', () => {
      @Component({
        selector: 'foo',
        template: `
          <p id="input">{{ input }}</p>
          <p id="inputBindingPropertyName">{{ localPropertyName }}</p>
          <p id="localProperty">{{ localProperty }}</p>
          <p id="localFunction">{{ localFunction() }}</p>
          <p id="output" (click)="output.emit('outputEmitted')"></p>
          <p id="outputBindingPropertyName" (click)="localOutput.emit('outputEmitted')"></p>
        `,
      })
      class FooComponent {
        @Input()
        public input: string;

        @Input('inputBindingPropertyName')
        public localPropertyName: string;

        @Output()
        public output = new EventEmitter<string>();

        @Output('outputBindingPropertyName')
        public localOutput = new EventEmitter<string>();

        public localProperty: string;

        public localFunction = () => '';
      }

      it('should initialize inputs', async () => {
        const props = {
          input: 'input',
          inputBindingPropertyName: 'inputBindingPropertyName',
          localProperty: 'localProperty',
          localFunction: () => 'localFunction',
        };

        const ngModule = getStorybookModuleMetadata(
          { storyFnAngular: { props }, parameters: { component: FooComponent } },
          new BehaviorSubject(props)
        );

        const { fixture } = await configureTestingModule(ngModule);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('p#input').innerHTML).toEqual(props.input);
        expect(fixture.nativeElement.querySelector('p#inputBindingPropertyName').innerHTML).toEqual(
          props.inputBindingPropertyName
        );
        expect(fixture.nativeElement.querySelector('p#localProperty').innerHTML).toEqual(
          props.localProperty
        );
        expect(fixture.nativeElement.querySelector('p#localFunction').innerHTML).toEqual(
          props.localFunction()
        );
      });

      it('should initialize outputs', async () => {
        let expectedOutputValue: string;
        let expectedOutputBindingValue: string;
        const props = {
          output: (value: string) => {
            expectedOutputValue = value;
          },
          outputBindingPropertyName: (value: string) => {
            expectedOutputBindingValue = value;
          },
        };

        const ngModule = getStorybookModuleMetadata(
          { storyFnAngular: { props }, parameters: { component: FooComponent } },
          new BehaviorSubject(props)
        );

        const { fixture } = await configureTestingModule(ngModule);
        fixture.detectChanges();

        fixture.nativeElement.querySelector('p#output').click();
        fixture.nativeElement.querySelector('p#outputBindingPropertyName').click();

        expect(expectedOutputValue).toEqual('outputEmitted');
        expect(expectedOutputBindingValue).toEqual('outputEmitted');
      });

      it('should change inputs if storyProps$ Subject emit', async () => {
        const initialProps = {
          input: 'input',
        };
        const storyProps$ = new BehaviorSubject(initialProps);

        const ngModule = getStorybookModuleMetadata(
          { storyFnAngular: { props: initialProps }, parameters: { component: FooComponent } },
          storyProps$
        );
        const { fixture } = await configureTestingModule(ngModule);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('p#input').innerHTML).toEqual(
          initialProps.input
        );
        expect(fixture.nativeElement.querySelector('p#inputBindingPropertyName').innerHTML).toEqual(
          ''
        );

        const newProps = {
          input: 'new input',
          inputBindingPropertyName: 'new inputBindingPropertyName',
          localProperty: 'new localProperty',
          localFunction: () => 'new localFunction',
        };
        storyProps$.next(newProps);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('p#input').innerHTML).toEqual(newProps.input);
        expect(fixture.nativeElement.querySelector('p#inputBindingPropertyName').innerHTML).toEqual(
          newProps.inputBindingPropertyName
        );
        expect(fixture.nativeElement.querySelector('p#localProperty').innerHTML).toEqual(
          newProps.localProperty
        );
        expect(fixture.nativeElement.querySelector('p#localFunction').innerHTML).toEqual(
          newProps.localFunction()
        );
      });

      it('should override outputs if storyProps$ Subject emit', async () => {
        let expectedOutputValue;
        let expectedOutputBindingValue;
        const initialProps = {
          output: (value: string) => {
            expectedOutputValue = value;
          },
          outputBindingPropertyName: (value: string) => {
            expectedOutputBindingValue = value;
          },
        };
        const storyProps$ = new BehaviorSubject(initialProps);

        const ngModule = getStorybookModuleMetadata(
          { storyFnAngular: { props: initialProps }, parameters: { component: FooComponent } },
          storyProps$
        );
        const { fixture } = await configureTestingModule(ngModule);
        fixture.detectChanges();

        const newProps = {
          input: 'new input',
          output: () => {
            expectedOutputValue = 'should be called';
          },
          outputBindingPropertyName: () => {
            expectedOutputBindingValue = 'should be called';
          },
        };
        storyProps$.next(newProps);
        fixture.detectChanges();

        fixture.nativeElement.querySelector('p#output').click();
        fixture.nativeElement.querySelector('p#outputBindingPropertyName').click();

        expect(fixture.nativeElement.querySelector('p#input').innerHTML).toEqual(newProps.input);
        expect(expectedOutputValue).toEqual('should be called');
        expect(expectedOutputBindingValue).toEqual('should be called');
      });

      it('should change template inputs if storyProps$ Subject emit', async () => {
        const initialProps = {
          color: 'red',
          input: 'input',
        };
        const storyProps$ = new BehaviorSubject<ICollection>(initialProps);

        const ngModule = getStorybookModuleMetadata(
          {
            storyFnAngular: {
              props: initialProps,
              template: '<p [style.color]="color"><foo [input]="input"></foo></p>',
            },
            parameters: { component: FooComponent },
          },
          storyProps$
        );
        const { fixture } = await configureTestingModule(ngModule);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('p').style.color).toEqual('red');
        expect(fixture.nativeElement.querySelector('p#input').innerHTML).toEqual(
          initialProps.input
        );

        const newProps = {
          color: 'black',
          input: 'new input',
        };
        storyProps$.next(newProps);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('p').style.color).toEqual('black');
        expect(fixture.nativeElement.querySelector('p#input').innerHTML).toEqual(newProps.input);
      });
    });

    describe('with component without selector', () => {
      @Component({
        template: `The content`,
      })
      class WithoutSelectorComponent {}

      it('should display the component', async () => {
        const props = {};

        const ngModule = getStorybookModuleMetadata(
          {
            storyFnAngular: {
              props,
              moduleMetadata: { entryComponents: [WithoutSelectorComponent] },
            },
            parameters: { component: WithoutSelectorComponent },
          },
          new BehaviorSubject<ICollection>(props)
        );

        const { fixture } = await configureTestingModule(ngModule);
        fixture.detectChanges();

        expect(fixture.nativeElement.innerHTML).toContain('The content');
      });
    });
  });

  async function configureTestingModule(ngModule: NgModule) {
    await TestBed.configureTestingModule({
      declarations: ngModule.declarations,
      providers: ngModule.providers,
    })
      .overrideModule(BrowserModule, {
        set: {
          entryComponents: [...ngModule.entryComponents],
        },
      })
      .compileComponents();

    const fixture = TestBed.createComponent(ngModule.bootstrap[0] as Type<unknown>);

    return {
      fixture,
    };
  }
});
