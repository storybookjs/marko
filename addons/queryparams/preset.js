function config(entry = [], { addDecorator = true } = {}) {
  const queryParamsConfig = [];
  if (addDecorator) {
    queryParamsConfig.push(require.resolve('./dist/esm/preset/addDecorator'));
  }
  return [...entry, ...queryParamsConfig];
}

module.exports = { config };
