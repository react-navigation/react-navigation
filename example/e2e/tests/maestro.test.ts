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
          await page.goto(
            step.openLink.link.replace('exp://127.0.0.1:8081/--', '')
          );
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
      }
    }
  });
});
