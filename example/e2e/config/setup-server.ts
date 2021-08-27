import { setup } from 'jest-dev-server';

export default async function () {
  await setup([
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
