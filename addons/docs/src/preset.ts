const getFrameworkPresets = (framework: string) => {
  try {
    return [require.resolve(`./frameworks/${framework}/preset`)];
  } catch (err) {
    // there is no custom config for the user's framework, do nothing
    return [];
  }
};

module.exports = (storybookOptions: any, presetOptions: any) => {
  return [
    { name: require.resolve('./frameworks/common/preset'), options: presetOptions },
    ...getFrameworkPresets(storybookOptions.framework),
  ];
};
