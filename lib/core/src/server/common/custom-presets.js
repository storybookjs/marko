import path from 'path';
import dedent from 'ts-dedent';
import serverRequire from '../utils/server-require';

export default function loadCustomPresets({ configDir }) {
  const presets = serverRequire(path.resolve(configDir, 'presets'));
  const main = serverRequire(path.resolve(configDir, 'main'));

  if (presets && main) {
    throw new Error(dedent`
      You have both a "main.js" and a "presets.js", remove the "presets.js" file from your configDir (${path.resolve(
        configDir,
        'presets'
      )})`);
  } else if (!presets && !main) {
    throw new Error(
      'We could not find a main.js file in your storybook configuration. Please check https://storybook.js.org/docs/configurations/overview/ for steps to set it up.'
    );
  }

  if (main) {
    return [path.resolve(configDir, 'main')];
  }

  return presets || [];
}
