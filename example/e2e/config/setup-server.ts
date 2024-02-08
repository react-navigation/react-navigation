import { setup } from 'jest-dev-server';

export default async function () {
  // @ts-expect-error this is specific to jest-dev-server
  globalThis.servers = await setup([
    {
      command: 'yarn serve -l 3579 web-build',
      launchTimeout: 50000,
      port: 3579,
    },
    {
      command: 'yarn server',
      launchTimeout: 50000,
      port: 3275,
    },
  ]);
}
