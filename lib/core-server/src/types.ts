import {
  Presets,
  ManagerWebpackOptions,
  LoadedPreset,
  StorybookConfigOptions,
  PresetsOptions,
  PresetConfig,
  Ref,
  PackageJson,
  LoadOptions,
  BuilderResult,
} from '@storybook/core-common';

export {
  Presets,
  ManagerWebpackOptions,
  LoadedPreset,
  StorybookConfigOptions,
  PresetsOptions,
  PresetConfig,
  Ref,
  BuilderResult,
  PackageJson,
  LoadOptions,
};

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
