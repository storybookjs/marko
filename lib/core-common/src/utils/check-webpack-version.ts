import semver from '@storybook/semver';
import { logger } from '@storybook/node-logger';
import dedent from 'ts-dedent';

export const checkWebpackVersion = (
  webpack: { version?: string },
  specifier: string,
  caption: string
) => {
  if (!webpack.version) {
    logger.info('Skipping webpack version check, no version available');
    return;
  }
  if (!semver.satisfies(webpack.version, specifier)) {
    logger.warn(dedent`
      Unexpected webpack version in ${caption}
      - Received: ${webpack.version}
      - Expected: ${specifier}

      For more info: https://gist.github.com/shilman/8856ea1786dcd247139b47b270912324#troubleshooting
    `);
  }
};
