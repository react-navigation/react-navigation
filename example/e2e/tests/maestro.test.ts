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
    const query = (by: string | { text: string } | { id: string }) => {
      if (typeof by === 'string') {
        return page.getByText(by);
      }

      if ('text' in by) {
        return page.getByText(by.text);
      }

      if ('id' in by) {
        return page.getByTestId(by.id);
      }

      throw new Error(`Unknown step format: ${JSON.stringify(by)}`);
    };

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

            await query(step.tapOn)
              .filter({ visible: true })
              .first()
              .click({ force: true });

            break;
          }

          case 'assertVisible': {
            await expect(
              query(step.assertVisible).filter({ visible: true }).first()
            ).toBeVisible();

            break;
          }

          case 'extendedWaitUntil': {
            const element = query(step.extendedWaitUntil.visible)
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
