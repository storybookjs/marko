import { window as globalWindow } from 'global';

if (globalWindow) {
  globalWindow.STORYBOOK_ENV = 'rax';
}
