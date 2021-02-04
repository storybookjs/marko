import ip from 'ip';

export function getServerAddresses(port: number, host: string, proto: string) {
  return {
    address: `${proto}://localhost:${port}/`,
    networkAddress: `${proto}://${host || ip.address()}:${port}/`,
  };
}
