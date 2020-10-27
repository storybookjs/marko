import deprecate from 'util-deprecate';
import dedent from 'ts-dedent';

export function parseList(str: string): string[] {
  return str.split(',');
}

export function getEnvConfig(program: Record<string, any>, configEnv: Record<string, any>): void {
  Object.keys(configEnv).forEach((fieldName) => {
    const envVarName = configEnv[fieldName];
    const envVarValue = process.env[envVarName];
    if (envVarValue) {
      program[fieldName] = envVarValue; // eslint-disable-line
    }
  });
}

const warnDLLsDeprecated = deprecate(
  () => {},
  dedent`
    DLL-related CLI flags are deprecated, see:
    
    https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-dll-flags
  `
);

export function checkDeprecatedFlags(options: {
  dlls?: boolean;
  uiDll?: boolean;
  docsDll?: boolean;
}) {
  if (!options.dlls || options.uiDll || options.docsDll) {
    warnDLLsDeprecated();
  }
}
