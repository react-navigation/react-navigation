import { teardown } from 'jest-dev-server';

export default async function () {
  // @ts-expect-error this is specific to jest-dev-server
  await teardown(globalThis.servers);
}
