import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parseAllDocuments } from 'yaml';

test.describe.configure({ mode: 'parallel' });

fs.readdirSync(path.join(__dirname, '../maestro')).forEach((file) => {
  const content = fs.readFileSync(
    path.join(__dirname, '../maestro', file),
    'utf-8'
  );

  const [metadata, steps] = parseAllDocuments(content).map((doc) =>
    doc.toJSON()
  );

  test(metadata.name, async ({ page }) => {
    for (const step of steps) {
      try {
        switch (Object.keys(step)[0]) {
          case 'openLink': {
            // eslint-disable-next-line no-template-curly-in-string
            await page.goto(step.openLink.link.replace('${APP_SCHEME}', ''));

            break;
          }

          case 'tapOn': {
            if (step.tapOn.delay) {
              await new Promise((resolve) => {
                setTimeout(resolve, step.tapOn.delay);
              });
            }

            await page
              .getByText(step.tapOn.text)
              .filter({ visible: true })
              .first()
              .click({ force: true });

            break;
          }

          case 'assertVisible': {
            await expect(
              page
                .getByText(step.assertVisible.text)
                .filter({ visible: true })
                .first()
            ).toBeVisible();

            break;
          }

          case 'extendedWaitUntil': {
            const element = page
              .getByText(step.extendedWaitUntil.visible)
              .filter({ visible: true })
              .first();

            await element.waitFor({
              timeout: step.extendedWaitUntil.timeout,
            });

            break;
          }

          default: {
            throw new Error(`Unknown command: ${JSON.stringify(step)}`);
          }
        }
      } catch (error) {
        throw new Error(`Failed at step: ${JSON.stringify(step)}`, {
          cause: error,
        });
      }
    }
  });
});
