import { expect, type Page, test } from '@playwright/test';
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
        await runStep(page, step);
      } catch (error) {
        throw new Error(`Failed at step: ${JSON.stringify(step)}`, {
          cause: error,
        });
      }
    }
  });
});

async function runStep(page: Page, step: any) {
  const command = typeof step === 'object' ? Object.keys(step)[0] : step;

  switch (command) {
    case 'runFlow': {
      if (step.runFlow.file) {
        const flowPath = path.join(__dirname, '../maestro', step.runFlow.file);

        const content = fs.readFileSync(flowPath, 'utf-8');
        const [, flowSteps] = parseAllDocuments(content).map((doc) =>
          doc.toJSON()
        );

        const env = step.runFlow.env || {};

        for (const flowStep of flowSteps) {
          let resolvedStep = flowStep;

          // Simple variable substitution
          for (const [key, value] of Object.entries(env)) {
            const strValue = String(value);

            resolvedStep = JSON.parse(
              JSON.stringify(resolvedStep).replace(
                new RegExp(`\\$\\{${key}\\}`, 'g'),
                strValue
              )
            );
          }

          await runStep(page, resolvedStep);
        }
      } else if (step.runFlow.when) {
        const condition = step.runFlow.when;

        let conditionMet = false;

        if (condition.visible) {
          const locator = query(page, condition.visible).filter({
            visible: true,
          });

          conditionMet = await locator.isVisible();
        } else if (condition.notVisible) {
          const locator = query(page, condition.notVisible).filter({
            visible: false,
          });

          conditionMet = await locator.isHidden();
        }

        if (conditionMet) {
          for (const cmd of step.runFlow.commands) {
            await runStep(page, cmd);
          }
        }
      } else {
        throw new Error(
          `Invalid runFlow step: ${JSON.stringify(step.runFlow)}`
        );
      }

      break;
    }

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

      const locator = query(page, step.tapOn);

      await locator.filter({ visible: true }).first().dispatchEvent('click');

      break;
    }

    case 'assertVisible': {
      await expect(
        query(page, step.assertVisible).filter({ visible: true }).first()
      ).toBeVisible();

      break;
    }

    case 'assertNotVisible': {
      const locator = query(page, step.assertNotVisible);

      if (await locator.isVisible()) {
        await expect(locator).not.toBeInViewport();
      } else {
        await expect(locator).toBeHidden();
      }

      break;
    }

    case 'extendedWaitUntil': {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      const locator = step.extendedWaitUntil.visible
        ? query(page, step.extendedWaitUntil.visible)
            .filter({ visible: true })
            .first()
        : query(page, step.extendedWaitUntil.notVisible).first();

      const element = await locator.elementHandle();

      await element?.waitForElementState('stable', {
        timeout: step.extendedWaitUntil.timeout,
      });

      if (step.extendedWaitUntil.visible) {
        await expect(locator).toBeVisible();
      } else if (step.extendedWaitUntil.notVisible) {
        if (await locator.isVisible()) {
          await expect(locator).not.toBeInViewport();
        } else {
          await expect(locator).toBeHidden();
        }
      }

      break;
    }

    case 'stopApp': {
      // No-op on web

      break;
    }

    case 'retry': {
      const maxRetries = step.retry.maxRetries ?? 1;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          for (const cmd of step.retry.commands) {
            await runStep(page, cmd);
          }

          break;
        } catch (error) {
          if (attempt === maxRetries) {
            throw error;
          }
        }
      }

      break;
    }

    case 'swipe': {
      const direction = step.swipe.direction;
      const duration = step.swipe.duration || 300;

      const viewport = page.viewportSize();

      if (!viewport) {
        throw new Error('Viewport size is not available');
      }

      // Start from center of viewport and swipe across a portion of the screen
      const centerY = viewport.height / 2;
      const startX =
        direction === 'LEFT' ? viewport.width * 0.8 : viewport.width * 0.2;
      const endX =
        direction === 'LEFT' ? viewport.width * 0.2 : viewport.width * 0.8;

      await page.mouse.move(startX, centerY);
      await page.mouse.down();
      await page.mouse.move(endX, centerY, {
        // A swipe gesture emits many small mouse move events
        steps: Math.max(10, Math.floor(duration / 20)),
      });
      await page.mouse.up();

      await page.waitForTimeout(duration);

      break;
    }

    default: {
      throw new Error(`Unknown command: ${JSON.stringify(step)}`);
    }
  }
}

function query(page: Page, by: string | { text: string } | { id: string }) {
  if (typeof by === 'string') {
    return page.getByText(by, { exact: true });
  }

  if ('text' in by) {
    return page.getByText(by.text, { exact: true });
  }

  if ('id' in by) {
    return page.getByTestId(by.id);
  }

  throw new Error(`Unknown step format: ${JSON.stringify(by)}`);
}
