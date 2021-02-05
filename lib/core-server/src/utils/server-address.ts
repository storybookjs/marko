import ip from 'ip';

import { logger } from '@storybook/node-logger';
import detectFreePort from 'detect-port';

export function getServerAddresses(port: number, host: string, proto: string) {
  return {
    address: `${proto}://localhost:${port}/`,
    networkAddress: `${proto}://${host || ip.address()}:${port}/`,
  };
}

export const getServerPort = (port: number) =>
  detectFreePort(port).catch((error) => {
    logger.error(error);
    process.exit(-1);
  });
