import path from 'path';
import fs from 'fs';

const interpolate = (string: string, data: Record<string, string> = {}) =>
  Object.entries(data).reduce((acc, [k, v]) => acc.replace(new RegExp(`%${k}%`, 'g'), v), string);

export function getPreviewBodyHtml(configDirPath: string, interpolations?: Record<string, string>) {
  const base = fs.readFileSync(path.resolve(__dirname, 'templates/base-preview-body.html'), 'utf8');

  const bodyHtmlPath = path.resolve(configDirPath, 'preview-body.html');
  let result = base;

  if (fs.existsSync(bodyHtmlPath)) {
    result = fs.readFileSync(bodyHtmlPath, 'utf8') + result;
  }

  return interpolate(result, interpolations);
}

export function getPreviewHeadHtml(configDirPath: string, interpolations?: Record<string, string>) {
  const base = fs.readFileSync(path.resolve(__dirname, 'templates/base-preview-head.html'), 'utf8');
  const headHtmlPath = path.resolve(configDirPath, 'preview-head.html');

  let result = base;

  if (fs.existsSync(headHtmlPath)) {
    result += fs.readFileSync(headHtmlPath, 'utf8');
  }

  return interpolate(result, interpolations);
}
