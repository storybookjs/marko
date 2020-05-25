export const typeScriptDefaults = {
  check: false,
  reactDocgen: 'react-docgen-typescript',
  reactDocgenTypescriptOptions: {
    propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
  },
};
