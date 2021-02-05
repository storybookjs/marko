import { Stats } from 'webpack';

export interface PreviewResult {
  previewStats?: Stats;
  previewTotalTime?: [number, number];
  bail: any;
}

export interface StorybookConfigOptions {
  // todo
  [key: string]: any;
}
