import fs from 'fs';
import path from 'path';
import { toRequireContext } from '@storybook/core/server';
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
import global from 'global';
import { ClientApi } from './Loader';
import { StoryshotsOptions } from '../api/StoryshotsOptions';

registerRequireContextHook();

const isFile = (file: string): boolean => {
  try {
    return fs.lstatSync(file).isFile();
  } catch (e) {
    return false;
  }
};

interface Output {
  stories: string[];
  files: string[];
}

const supportedExtensions = ['ts', 'tsx', 'js', 'jsx'];

const resolveFile = (configDir: string, supportedFilenames: string[]) =>
  supportedFilenames
    .flatMap((filename) =>
      supportedExtensions.map((ext) => path.join(configDir, `${filename}.${ext}`))
    )
    .find(isFile) || false;

export const getPreviewFile = (configDir: string): string | false =>
  resolveFile(configDir, ['preview', 'config']);

export const getMainFile = (configDir: string): string | false => resolveFile(configDir, ['main']);

function getConfigPathParts(input: string): Output {
  const configDir = path.resolve(input);

  if (fs.lstatSync(configDir).isDirectory()) {
    const output: Output = { files: [], stories: [] };

    const preview = getPreviewFile(configDir);
    const main = getMainFile(configDir);

    if (preview) {
      output.files.push(preview);
    }
    if (main) {
      const { stories = [] } = jest.requireActual(main);

      output.stories = stories.map(
        (pattern: string | { path: string; recursive: boolean; match: string }) => {
          const { path: basePath, recursive, match } = toRequireContext(pattern);
          // eslint-disable-next-line no-underscore-dangle
          return global.__requireContext(configDir, basePath, recursive, match);
        }
      );
    }

    return output;
  }

  return { files: [configDir], stories: [] };
}

function configure(
  options: {
    storybook: ClientApi;
  } & StoryshotsOptions
): void {
  const { configPath = '.storybook', config, storybook } = options;

  if (config && typeof config === 'function') {
    config(storybook);
    return;
  }

  const { files, stories } = getConfigPathParts(configPath);

  files.forEach((f) => {
    jest.requireActual(f);
  });

  if (stories && stories.length) {
    storybook.configure(stories, false);
  }
}

export default configure;
