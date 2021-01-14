import { Component } from '@angular/core';
import { platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { RendererService } from './RendererService';

jest.mock('@angular/platform-browser-dynamic');

declare const document: Document;
describe('RendererService', () => {
  let rendererService: RendererService;

  beforeEach(async () => {
    document.body.innerHTML = '<div id="root"></div>';
    (platformBrowserDynamic as any).mockImplementation(platformBrowserDynamicTesting);
    rendererService = new RendererService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize', () => {
    expect(rendererService).toBeDefined();
  });

  describe('render', () => {
    it('should add storybook-wrapper for story template', async () => {
      await rendererService.render({
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

      await rendererService.render({
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
});
