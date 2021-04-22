/**
 * Clone of `normalizeAssetPatterns` function from angular-cli v11.2.*
 * > https://github.com/angular/angular-cli/blob/de63f41d669e42ada84f94ca1795d2791b9b45cc/packages/angular_devkit/build_angular/src/utils/normalize-asset-patterns.ts
 *
 * It is not possible to use the original because arguments have changed between version 6.1.* and 11.*.* of angular-cli
 */
import { statSync } from 'fs';
import {
  BaseException,
  basename,
  dirname,
  getSystemPath,
  join,
  normalize,
  Path,
  relative,
  resolve,
} from '@angular-devkit/core';

import { AssetPattern, AssetPatternClass } from '@angular-devkit/build-angular/src/browser/schema';

export class MissingAssetSourceRootException extends BaseException {
  constructor(path: string) {
    super(`The ${path} asset path must start with the project source root.`);
  }
}

export function normalizeAssetPatterns(
  assetPatterns: AssetPattern[],
  root: Path,
  projectRoot: Path,
  maybeSourceRoot: Path | undefined
): AssetPatternClass[] {
  // When sourceRoot is not available, we default to ${projectRoot}/src.
  const sourceRoot = maybeSourceRoot || join(projectRoot, 'src');
  const resolvedSourceRoot = resolve(root, sourceRoot);

  if (assetPatterns.length === 0) {
    return [];
  }

  return assetPatterns.map((assetPattern) => {
    // Normalize string asset patterns to objects.
    if (typeof assetPattern === 'string') {
      const assetPath = normalize(assetPattern);
      const resolvedAssetPath = resolve(root, assetPath);

      // Check if the string asset is within sourceRoot.
      if (!resolvedAssetPath.startsWith(resolvedSourceRoot)) {
        throw new MissingAssetSourceRootException(assetPattern);
      }

      let glob: string;
      let input: Path;
      let isDirectory = false;

      try {
        isDirectory = statSync(getSystemPath(resolvedAssetPath)).isDirectory();
      } catch {
        isDirectory = true;
      }

      if (isDirectory) {
        // Folders get a recursive star glob.
        glob = '**/*';
        // Input directory is their original path.
        input = assetPath;
      } else {
        // Files are their own glob.
        glob = basename(assetPath);
        // Input directory is their original dirname.
        input = dirname(assetPath);
      }

      // Output directory for both is the relative path from source root to input.
      const output = relative(resolvedSourceRoot, resolve(root, input));

      // Return the asset pattern in object format.
      return { glob, input, output };
    }
    // It's already an AssetPatternObject, no need to convert.
    return assetPattern;
  });
}
