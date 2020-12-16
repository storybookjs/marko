import { Component, EventEmitter, Input, NgModule, Output, Type } from '@angular/core';
import { platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { RenderNgAppService } from './RenderNgAppService';

jest.mock('@angular/platform-browser-dynamic');

declare const document: Document;
describe('RenderNgAppService', () => {
  let renderNgAppService: RenderNgAppService;

  beforeEach(async () => {
    document.body.innerHTML = '<div id="root"></div>';
    (platformBrowserDynamic as any).mockImplementation(platformBrowserDynamicTesting);
    renderNgAppService = new RenderNgAppService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize', () => {
    expect(renderNgAppService).toBeDefined();
  });

  describe('render', () => {
    it('should add storybook-wrapper for story template', async () => {
      await renderNgAppService.render({
        storyFnAngular: {
          template: '🦊',
          props: {},
        },
        forced: false,
        parameters: {} as any,
      });

      expect(document.body.getElementsByTagName('storybook-wrapper')[0].innerHTML).toBe('🦊');
    });

    it('should add storybook-wrapper for story component', async () => {
      @Component({ selector: 'foo', template: '🦊' })
      class FooComponent {}

      await renderNgAppService.render({
        storyFnAngular: {
          props: {},
        },
        forced: false,
        parameters: {
          component: FooComponent,
        },
      });

      expect(document.body.getElementsByTagName('storybook-wrapper')[0].innerHTML).toBe(
        '<foo>🦊</foo>'
      );
    });
  });
  describe('getNgModuleMetadata', () => {
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

        const ngModule = RenderNgAppService.getNgModuleMetadata(
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

        const ngModule = RenderNgAppService.getNgModuleMetadata(
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

        const ngModule = RenderNgAppService.getNgModuleMetadata(
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

      it('should not override outputs if storyProps$ Subject emit', async () => {
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

        const ngModule = RenderNgAppService.getNgModuleMetadata(
          { storyFnAngular: { props: initialProps }, parameters: { component: FooComponent } },
          storyProps$
        );
        const { fixture } = await configureTestingModule(ngModule);
        fixture.detectChanges();

        const newProps = {
          input: 'new input',
          output: () => {
            expectedOutputValue = 'should not be called';
          },
          outputBindingPropertyName: () => {
            expectedOutputBindingValue = 'should not be called';
          },
        };
        storyProps$.next(newProps);
        fixture.detectChanges();

        fixture.nativeElement.querySelector('p#output').click();
        fixture.nativeElement.querySelector('p#outputBindingPropertyName').click();

        expect(fixture.nativeElement.querySelector('p#input').innerHTML).toEqual(newProps.input);
        expect(expectedOutputValue).toEqual('outputEmitted');
        expect(expectedOutputBindingValue).toEqual('outputEmitted');
      });
    });
  });

  async function configureTestingModule(ngModule: NgModule) {
    await TestBed.configureTestingModule({
      declarations: ngModule.declarations,
      providers: ngModule.providers,
    }).compileComponents();
    const fixture = TestBed.createComponent(ngModule.bootstrap[0] as Type<unknown>);

    return {
      fixture,
    };
  }
});
