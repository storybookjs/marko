import { listCodemods, runCodemod } from '@storybook/codemod';

export async function migrate(
  migration: any,
  { configDir, glob, dryRun, list, rename, logger, parser }: any
) {
  if (list) {
    listCodemods().forEach((key: any) => logger.log(key));
  } else if (migration) {
    await runCodemod(migration, { configDir, glob, dryRun, logger, rename, parser });
  } else {
    throw new Error('Migrate: please specify a migration name or --list');
  }
}
