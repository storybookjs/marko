import path from 'path';
import fs from 'fs-extra';
import findUp from 'find-up';
import resolveFrom from 'resolve-from';
import fetch from 'node-fetch';
import deprecate from 'util-deprecate';
import dedent from 'ts-dedent';

import { logger } from '@storybook/node-logger';

import { Configuration } from 'webpack';
import { Ref, Options } from '@storybook/core-common';

export const getAutoRefs = async (
  options: Options,
  disabledRefs: string[] = []
): Promise<Ref[]> => {
  const location = await findUp('package.json', { cwd: options.configDir });
  const directory = path.dirname(location);

  const { dependencies, devDependencies } = await fs.readJSON(location);
  const deps = Object.keys({ ...dependencies, ...devDependencies }).filter(
    (dep) => !disabledRefs.includes(dep)
  );

  const list = await Promise.all(
    deps.map(async (d) => {
      try {
        const l = resolveFrom(directory, path.join(d, 'package.json'));

        const { storybook, name, version } = await fs.readJSON(l);

        if (storybook?.url) {
          return { id: name, ...storybook, version };
        }
      } catch {
        return undefined;
      }
      return undefined;
    })
  );

  return list.filter(Boolean);
};

const checkRef = (url: string) =>
  fetch(`${url}/iframe.html`).then(
    ({ ok }) => ok,
    () => false
  );

const stripTrailingSlash = (url: string) => url.replace(/\/$/, '');

const toTitle = (input: string) => {
  const result = input
    .replace(/[A-Z]/g, (f) => ` ${f}`)
    .replace(/[-_][A-Z]/gi, (f) => ` ${f.toUpperCase()}`)
    .replace(/-/g, ' ')
    .replace(/_/g, ' ');

  return `${result.substring(0, 1).toUpperCase()}${result.substring(1)}`.trim();
};

const deprecatedDefinedRefDisabled = deprecate(
  () => {},
  dedent`
    Deprecated parameter: disabled => disable

    https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-package-composition-disabled-parameter
  `
);

export async function getManagerWebpackConfig(options: Options): Promise<Configuration> {
  const { presets } = options;
  const typescriptOptions = await presets.apply('typescript', {}, options);
  const babelOptions = await presets.apply('babel', {}, { ...options, typescriptOptions });

  const definedRefs: Record<string, any> | undefined = await presets.apply(
    'refs',
    undefined,
    options
  );

  let disabledRefs: string[] = [];
  if (definedRefs) {
    disabledRefs = Object.entries(definedRefs)
      .filter(([key, value]) => {
        const { disable, disabled } = value;

        if (disable || disabled) {
          if (disabled) {
            deprecatedDefinedRefDisabled();
          }

          delete definedRefs[key]; // Also delete the ref that is disabled in definedRefs

          return true;
        }

        return false;
      })
      .map((ref) => ref[0]);
  }

  const autoRefs = await getAutoRefs(options, disabledRefs);
  const entries = await presets.apply('managerEntries', [], options);

  const refs: Record<string, Ref> = {};

  if (autoRefs && autoRefs.length) {
    autoRefs.forEach(({ id, url, title, version }) => {
      refs[id.toLowerCase()] = {
        id: id.toLowerCase(),
        url: stripTrailingSlash(url),
        title,
        version,
      };
    });
  }

  if (definedRefs) {
    Object.entries(definedRefs).forEach(([key, value]) => {
      const url = typeof value === 'string' ? value : value.url;
      const rest =
        typeof value === 'string'
          ? { title: toTitle(key) }
          : { ...value, title: value.title || toTitle(value.key || key) };

      refs[key.toLowerCase()] = {
        id: key.toLowerCase(),
        ...rest,
        url: stripTrailingSlash(url),
      };
    });
  }

  if (autoRefs || definedRefs) {
    entries.push(path.resolve(path.join(options.configDir, `generated-refs.js`)));

    // verify the refs are publicly reachable, if they are not we'll require stories.json at runtime, otherwise the ref won't work
    await Promise.all(
      Object.entries(refs).map(async ([k, value]) => {
        const ok = await checkRef(value.url);

        refs[k] = { ...value, type: ok ? 'server-checked' : 'unknown' };
      })
    );
  }

  return presets.apply('managerWebpack', {}, { ...options, babelOptions, entries, refs }) as any;
}
