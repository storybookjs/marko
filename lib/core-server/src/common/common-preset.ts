import loadCustomBabelConfig from '../utils/load-custom-babel-config';
import {
  getPreviewBodyTemplate,
  getPreviewHeadTemplate,
  getManagerMainTemplate,
  getPreviewMainTemplate,
} from '../utils/template';

import { babelConfig } from './babel';

export const babel = async (_: unknown, options: { configDir: string; presets: any }) => {
  const { configDir, presets } = options;

  return loadCustomBabelConfig(configDir, () =>
    presets.apply('babelDefault', babelConfig(), options)
  );
};

export const logLevel = (previous: any, options: { loglevel: any }) =>
  previous || options.loglevel || 'info';

export const previewHeadTemplate = (base: any, { configDir }: { configDir: string }) =>
  getPreviewHeadTemplate(configDir, process.env);

export const previewBodyTemplate = (base: any, { configDir }: { configDir: string }) =>
  getPreviewBodyTemplate(configDir, process.env);

export const previewMainTemplate = () => getPreviewMainTemplate();

export const managerMainTemplate = () => getManagerMainTemplate();
