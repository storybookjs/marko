import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { logger } from '@storybook/node-logger';
import { parseStaticDir } from './server-statics';

export async function copyAllStaticFiles(staticDirs: any[] | undefined, outputDir: string) {
  if (staticDirs && staticDirs.length > 0) {
    await Promise.all(
      staticDirs.map(async (dir) => {
        try {
          const { staticDir, staticPath, targetDir } = await parseStaticDir(dir);
          const targetPath = path.join(outputDir, targetDir);
          logger.info(chalk`=> Copying static files: {cyan ${staticDir}} => {cyan ${targetDir}}`);

          // Storybook's own files should not be overwritten, so we skip such files if we find them
          const skipPaths = ['index.html', 'iframe.html'].map((f) => path.join(targetPath, f));
          await fs.copy(staticPath, targetPath, { filter: (_, dest) => !skipPaths.includes(dest) });
        } catch (e) {
          logger.error(e.message);
          process.exit(-1);
        }
      })
    );
  }
}
