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
      switch (Object.keys(step)[0]) {
        case 'openLink': {
          // eslint-disable-next-line no-template-curly-in-string
          await page.goto(step.openLink.link.replace('${APP_SCHEME}/', ''));
          break;
        }

        case 'tapOn': {
          await page
            .getByText(step.tapOn.text)
            .locator('visible=true')
            .first()
            .click();
          break;
        }

        case 'assertVisible': {
          await expect(
            page
              .getByText(step.assertVisible.text)
              .locator('visible=true')
              .first()
          ).toBeVisible();
          break;
        }

        case 'clearState': {
          // Do nothing for now
          break;
        }

        default: {
          throw new Error(`Unknown command: ${JSON.stringify(step)}`);
        }
      }
    }
  });
});
