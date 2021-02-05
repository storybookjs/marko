import { getEnvironment } from 'lazy-universal-dotenv';
import { nodePathsToArray } from './paths';

// Load environment variables starts with STORYBOOK_ to the client side.

export function loadEnv(
  options: { production?: boolean } = {}
): { stringified: Record<string, string>; raw: Record<string, object> } {
  const defaultNodeEnv = options.production ? 'production' : 'development';

  const env: Record<string, string> = {
    NODE_ENV: process.env.NODE_ENV || defaultNodeEnv,
    NODE_PATH: process.env.NODE_PATH || '',
    STORYBOOK: process.env.STORYBOOK || 'true',
    // This is to support CRA's public folder feature.
    // In production we set this to dot(.) to allow the browser to access these assets
    // even when deployed inside a subpath. (like in GitHub pages)
    // In development this is just empty as we always serves from the root.
    PUBLIC_URL: options.production ? '.' : '',
  };

  Object.keys(process.env)
    .filter((name) => /^STORYBOOK_/.test(name))
    .forEach((name) => {
      env[name] = process.env[name];
    });

  const base = Object.entries(env).reduce(
    (acc, [k, v]) => Object.assign(acc, { [k]: JSON.stringify(v) }),
    {} as Record<string, string>
  );

  const { stringified, raw } = getEnvironment({ nodeEnv: env.NODE_ENV });

  const fullRaw = { ...env, ...raw };

  fullRaw.NODE_PATH = nodePathsToArray(fullRaw.NODE_PATH || '');

  return {
    stringified: { ...base, ...stringified },
    raw: fullRaw,
  };
}
