import { window as globalWindow } from 'global';

globalWindow.STORYBOOK_NAME = process.env.STORYBOOK_NAME;
globalWindow.STORYBOOK_ENV = 'ember';
