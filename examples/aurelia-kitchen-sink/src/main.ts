// Promise polyfill for old browsers
import 'promise-polyfill/lib/polyfill';
import { DebugConfiguration } from '@aurelia/debug';
import { JitHtmlBrowserConfiguration } from '@aurelia/jit-html-browser';
import { Aurelia } from '@aurelia/runtime';
import { App } from './app';

new Aurelia()
  .register(JitHtmlBrowserConfiguration, DebugConfiguration)
  .app({
    host: document.querySelector('app'),
    component: App,
  })
  .start();
