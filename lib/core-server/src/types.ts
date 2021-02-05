import {
  Presets,
  ManagerWebpackOptions,
  LoadedPreset,
  StorybookConfigOptions,
  PresetsOptions,
  PresetConfig,
  Ref,
  PreviewResult,
  ManagerResult,
  PackageJson,
  LoadOptions,
} from '@storybook/core-common';

// TODO: ManagerResult & PreviewResults should be 1 type

export {
  Presets,
  ManagerWebpackOptions,
  LoadedPreset,
  StorybookConfigOptions,
  PresetsOptions,
  PresetConfig,
  Ref,
  PreviewResult,
  ManagerResult,
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
