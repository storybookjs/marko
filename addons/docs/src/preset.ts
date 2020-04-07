const getFrameworkPresets = (framework: string) => {
  try {
    return [require.resolve(`./frameworks/${framework}/preset`)];
  } catch (err) {
    // there is no custom config for the user's framework, do nothing
    return [];
  }
};

module.exports = ({ framework }: any) => {
  return [require.resolve('./frameworks/common/preset'), ...getFrameworkPresets(framework)];
};
