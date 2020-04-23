import { setup } from 'jest-dev-server';

export default async function () {
  await setup({
    command: 'yarn serve -l 3579 web-build',
    port: 3579,
  });
}
