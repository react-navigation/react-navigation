import { by, element, expect, device } from 'detox';

beforeEach(async () => {
  await device.reloadReactNative();
});

it('has dark theme toggle', async () => {
  await expect(element(by.text('Dark theme'))).toBeVisible();
});
