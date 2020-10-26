import { Configuration } from 'webpack';
import { TransformOptions } from '@babel/core';
import { typeScriptDefaults } from './config/defaults';

export interface ManagerWebpackOptions {
  configDir: any;
  configType?: string;
  docsMode?: boolean;
  entries: string[];
  refs: any;
  uiDll: boolean;
  dll: any;
  outputDir?: string;
  cache: any;
  previewUrl?: string;
  versionCheck: any;
  releaseNotesData: any;
  presets: any;
}

export interface Presets {
  apply(
    extension: 'typescript',
    config: typeof typeScriptDefaults,
    args: StorybookConfigOptions & { presets: Presets }
  ): Promise<TransformOptions>;
  apply(extension: 'babel', config: {}, args: any): Promise<TransformOptions>;
  apply(extension: 'entries', config: [], args: any): Promise<unknown>;
  apply(extension: 'stories', config: [], args: any): Promise<unknown>;
  apply(
    extension: 'webpack',
    config: {},
    args: { babelOptions?: TransformOptions } & any
  ): Promise<Configuration>;
  apply(extension: 'managerEntries', config: [], args: any): Promise<string[]>;
  apply(extension: 'refs', config: [], args: any): Promise<unknown>;
  apply(
    extension: 'managerWebpack',
    config: {},
    args: { babelOptions?: TransformOptions } & ManagerWebpackOptions
  ): Promise<Configuration>;
  apply(extension: string, config: unknown, args: unknown): Promise<unknown>;
}

export interface LoadedPreset {
  name: string;
  preset: any;
  options: any;
}

export interface StorybookConfigOptions {
  configType: 'DEVELOPMENT' | 'PRODUCTION';
  outputDir?: string;
  configDir: string;
  cache?: any;
  framework: string;
}

export interface PresetsOptions {
  corePresets: string[];
  overridePresets: string[];
  frameworkPresets: string[];
}

export type PresetConfig =
  | string
  | {
      name: string;
      options?: unknown;
    };
