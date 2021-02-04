import { Stats } from 'webpack';

export interface PreviewResult {
  previewStats?: Stats;
  previewTotalTime?: [number, number];
}
