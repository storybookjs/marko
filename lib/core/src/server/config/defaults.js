export const typeScriptDefaults = {
  check: false,
  reactDocgen: 'react-docgen-typescript',
  reactDocgenTypescriptOptions: {
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
  },
};
