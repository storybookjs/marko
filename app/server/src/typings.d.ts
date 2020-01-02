declare module '@storybook/core/*';
declare module 'global';
declare module 'fs-extra';

// will be provided by the webpack define plugin
declare var NODE_ENV: string | undefined;
