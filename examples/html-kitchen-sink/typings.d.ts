declare module 'global';
declare module 'format-json';
declare module '@storybook/addon-knobs';
declare module '*.json' {
  const value: any;
  export default value;
}
