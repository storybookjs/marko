import { Component } from '@angular/core';
import { ArgTypes } from '@storybook/api';
import { computesTemplateSourceFromComponent } from './ComputesTemplateFromComponent';
import { ButtonAccent, InputComponent, ISomeInterface } from './__testfixtures__/input.component';

describe('angular source decorator', () => {
  it('With no props should generate simple tag', () => {
    const component = InputComponent;
    const props = {};
    const argTypes: ArgTypes = {};
    const source = computesTemplateSourceFromComponent(component, props, argTypes);
    expect(source).toEqual('<doc-button></doc-button>');
  });

  describe('with component without selector', () => {
    @Component({
      template: `The content`,
    })
    class WithoutSelectorComponent {}

    it('should add component ng-container', async () => {
      const component = WithoutSelectorComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(
        `<ng-container *ngComponentOutlet="WithoutSelectorComponent"></ng-container>`
      );
    });
  });

  describe('no argTypes', () => {
    it('should generate tag-only template with no props', () => {
      const component = InputComponent;
      const props = {};
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<doc-button></doc-button>`);
    });
    it('With props should generate tag with properties', () => {
      const component = InputComponent;
      const props = {
        isDisabled: true,
        label: 'Hello world',
        accent: ButtonAccent.High,
        counter: 4,
      };
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(
        `<doc-button [counter]="4" accent="High" [isDisabled]="true" label="Hello world"></doc-button>`
      );
    });

    it('With props should generate tag with outputs', () => {
      const component = InputComponent;
      const props = {
        isDisabled: true,
        label: 'Hello world',
        onClick: ($event: any) => {},
      };
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(
        `<doc-button [isDisabled]="true" label="Hello world" (onClick)="onClick($event)"></doc-button>`
      );
    });

    it('should generate correct property for overridden name for Input', () => {
      const component = InputComponent;
      const props = {
        color: '#ffffff',
      };
      const argTypes: ArgTypes = {};
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(`<doc-button color="#ffffff"></doc-button>`);
    });
  });

  describe('with argTypes (from compodoc)', () => {
    it('Should handle enum as strongly typed enum', () => {
      const component = InputComponent;
      const props = {
        isDisabled: false,
        label: 'Hello world',
        accent: ButtonAccent.High,
      };
      const argTypes: ArgTypes = {
        accent: {
          control: {
            options: ['Normal', 'High'],
            type: 'radio',
          },
          defaultValue: undefined,
          table: {
            category: 'inputs',
          },
          type: {
            name: 'enum',
            required: true,
            summary: 'ButtonAccent',
          },
        },
      };
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(
        `<doc-button [accent]="ButtonAccent.High" [isDisabled]="false" label="Hello world"></doc-button>`
      );
    });

    it('Should handle enum without values as string', () => {
      const component = InputComponent;
      const props = {
        isDisabled: false,
        label: 'Hello world',
        accent: ButtonAccent.High,
      };
      const argTypes: ArgTypes = {
        accent: {
          control: {
            options: ['Normal', 'High'],
            type: 'radio',
          },
          defaultValue: undefined,
          table: {
            category: 'inputs',
          },
          type: {
            name: 'object',
            required: true,
          },
        },
      };
      const source = computesTemplateSourceFromComponent(component, props, argTypes);
      expect(source).toEqual(
        `<doc-button accent="High" [isDisabled]="false" label="Hello world"></doc-button>`
      );
    });

    it('Should handle objects correctly', () => {
      const component = InputComponent;

      const someDataObject: ISomeInterface = {
        one: 'Hello world',
        two: true,
        three: ['One', 'Two', 'Three'],
      };

      const props = {
        isDisabled: false,
        label: 'Hello world',
        someDataObject,
      };

      const source = computesTemplateSourceFromComponent(component, props, null);
      // Ideally we should stringify the object, but that could cause the story to break because of unescaped values in the JSON object.
      // This will have to do for now
      expect(source).toEqual(
        `<doc-button [isDisabled]="false" label="Hello world" [someDataObject]="someDataObject"></doc-button>`
      );
    });
  });
});
