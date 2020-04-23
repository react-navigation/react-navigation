import { teardown } from 'jest-dev-server';

export default async function () {
  await teardown();
}
