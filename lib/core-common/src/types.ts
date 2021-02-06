import { Configuration, Stats } from 'webpack';
import { TransformOptions } from '@babel/core';
import { Router } from 'express';
import { FileSystemCache } from 'file-system-cache';
import { Server } from 'http';

/**
 * ⚠️ This file contains internal WIP types they MUST NOT be exported outside this package for now!
 */

interface TypescriptConfig {
  check: boolean;
  reactDocgen: string;
  reactDocgenTypescriptOptions: {
    shouldExtractLiteralValuesFromEnum: boolean;
    shouldRemoveUndefinedFromOptional: boolean;
    propFilter: (prop: any) => boolean;
  };
}

interface CoreConfig {
  builder: 'webpack4' | 'webpack5';
}

export interface Presets {
  apply(
    extension: 'typescript',
    config: TypescriptConfig,
    args: Options & { presets: Presets }
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
  apply(extension: 'core', config: {}, args: any): Promise<CoreConfig>;
  apply(
    extension: 'managerWebpack',
    config: {},
    args: Options & { babelOptions?: TransformOptions } & ManagerWebpackOptions
  ): Promise<Configuration>;
  apply<T extends unknown>(extension: string, config?: T, args?: unknown): Promise<T>;
}

export interface LoadedPreset {
  name: string;
  preset: any;
  options: any;
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

export interface Ref {
  id: string;
  url: string;
  title: string;
  version: string;
  type?: string;
}

export interface VersionCheck {
  success: boolean;
  data?: any;
  error?: any;
  time: number;
}

export interface ReleaseNotesData {
  success: boolean;
  currentVersion: string;
  showOnFirstLaunch: boolean;
}

export interface BuilderResult {
  stats?: Stats;
  totalTime?: ReturnType<typeof process.hrtime>;
}

// TODO: this is a generic interface that we can share across multiple SB packages (like @storybook/cli)
export interface PackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

// TODO: This could be exported to the outside world and used in `options.ts` file of each `@storybook/APP`
// like it's described in docs/api/new-frameworks.md
export interface LoadOptions {
  packageJson: PackageJson;
  framework: string;
  frameworkPresets: string[];
  outputDir?: string;
  configDir?: string;
  ignorePreview?: boolean;
  extendServer?: (server: Server) => void;
}

export interface ManagerWebpackOptions {
  entries: string[];
  refs: Record<string, Ref>;
}

export interface CLIOptions {
  port?: number;
  ignorePreview?: boolean;
  previewUrl?: string;
  host?: string;
  staticDir?: string[];
  configDir?: string;
  https?: boolean;
  sslCa?: string[];
  sslCert?: string;
  sslKey?: string;
  smokeTest?: boolean;
  managerCache?: boolean;
  ci?: boolean;
  loglevel?: string;
  quiet?: boolean;
  versionUpdates?: boolean;
  releaseNotes?: boolean;
  dll?: boolean;
  docs?: boolean;
  docsDll?: boolean;
  uiDll?: boolean;
  debugWebpack?: boolean;
  outputDir?: string;
}

export interface BuilderOptions {
  configType: 'DEVELOPMENT' | 'PRODUCTION';
  ignorePreview: boolean;
  cache: FileSystemCache;
  configDir: string;
  docsMode: boolean;
  versionCheck?: VersionCheck;
  releaseNotesData?: ReleaseNotesData;
}

export interface StorybookConfigOptions {
  presets: Presets;
  presetsList: PresetConfig[];
}

export type Options = LoadOptions & StorybookConfigOptions & CLIOptions & BuilderOptions;

export interface Builder<Config> {
  getConfig: (options: Options) => Promise<Config>;
  start: (args: {
    options: Options;
    startTime: ReturnType<typeof process.hrtime>;
    useProgressReporting: any;
    router: Router;
  }) => Promise<{
    stats: Stats;
    totalTime: ReturnType<typeof process.hrtime>;
    bail: (e?: Error) => Promise<void>;
  }>;
  build: (arg: {
    options: Options;
    startTime: ReturnType<typeof process.hrtime>;
    useProgressReporting: any;
  }) => Promise<void>;
  bail: (e?: Error) => Promise<void>;
}
