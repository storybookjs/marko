import { Component } from '@angular/core';
import { platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { StoryFnAngularReturnType } from '../types';
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

  it('should add storybook-wrapper for story template', async () => {
    await renderNgAppService.render(
      (): StoryFnAngularReturnType => ({ template: '🦊', props: {} }),
      false
    );

    expect(document.body.innerHTML).toBe(
      '<div id="root"><storybook-wrapper ng-version="11.0.0">🦊</storybook-wrapper></div>'
    );
  });

  it('should add storybook-wrapper for story component', async () => {
    @Component({ selector: 'foo', template: '🦊' })
    class FooComponent {}

    await renderNgAppService.render(
      (): StoryFnAngularReturnType => ({ component: FooComponent, props: {} }),
      false
    );

    expect(document.body.innerHTML).toBe(
      '<div id="root"><storybook-wrapper ng-version="11.0.0"><foo>🦊</foo></storybook-wrapper></div>'
    );
  });
});
