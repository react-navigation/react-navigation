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

        let conditionMet = null;

        if (condition.true) {
          conditionMet = evaluateCondition(condition.true);
        }

        if (condition.platform) {
          conditionMet =
            conditionMet !== false &&
            condition.platform.toLowerCase() === 'web';
        }

        if (condition.visible) {
          const locator = query(page, condition.visible).filter({
            visible: true,
          });

          conditionMet = conditionMet !== false && (await locator.isVisible());
        }

        if (condition.notVisible) {
          const locator = query(page, condition.notVisible).filter({
            visible: false,
          });

          conditionMet = conditionMet !== false && (await locator.isHidden());
        }

        if (conditionMet === null) {
          throw new Error(
            `Invalid runFlow condition: ${JSON.stringify(condition)}`
          );
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

    case 'runScript': {
      if (step.runScript.file) {
        const result = await import(
          path.join(__dirname, '../maestro', step.runScript.file)
        );

        await result.run(page, step.runScript.env || {});
      } else {
        throw new Error(
          `Invalid runScript step: ${JSON.stringify(step.runScript)}`
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

      await locator.filter({ visible: true }).last().dispatchEvent('click');

      break;
    }

    case 'assertVisible': {
      await expect(
        query(page, step.assertVisible).filter({ visible: true }).last()
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
            .last()
        : query(page, step.extendedWaitUntil.notVisible).last();

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
      const duration = step.swipe.duration || 300;

      const viewport = page.viewportSize();

      if (!viewport) {
        throw new Error('Viewport size is not available');
      }

      let startX: number;
      let startY: number;
      let endX: number;
      let endY: number;

      if (step.swipe.start && step.swipe.end) {
        const parsePercent = (value: string, dimension: number) =>
          (parseFloat(value) / 100) * dimension;

        const [startXStr, startYStr] = step.swipe.start
          .split(',')
          .map((s: string) => s.trim());
        const [endXStr, endYStr] = step.swipe.end
          .split(',')
          .map((s: string) => s.trim());

        startX = parsePercent(startXStr, viewport.width);
        startY = parsePercent(startYStr, viewport.height);
        endX = parsePercent(endXStr, viewport.width);
        endY = parsePercent(endYStr, viewport.height);
      } else {
        const direction = step.swipe.direction;

        startY = viewport.height / 2;
        endY = startY;
        startX =
          direction === 'LEFT' ? viewport.width * 0.8 : viewport.width * 0.2;
        endX =
          direction === 'LEFT' ? viewport.width * 0.2 : viewport.width * 0.8;
      }

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, endY, {
        // A swipe gesture emits many small mouse move events
        steps: Math.max(10, Math.floor(duration / 20)),
      });
      await page.mouse.up();

      await page.waitForTimeout(duration);

      break;
    }

    case 'inputText': {
      await page.keyboard.type(step.inputText);

      break;
    }

    case 'stopApp': {
      // No-op on web

      break;
    }

    default: {
      throw new Error(`Unknown command: ${JSON.stringify(step)}`);
    }
  }
}

function evaluateCondition(condition: boolean | string) {
  if (typeof condition === 'boolean') {
    return condition;
  }

  const expression = condition.trim();

  if (!expression.startsWith('${') || !expression.endsWith('}')) {
    throw new Error(`Invalid runFlow true condition: ${condition}`);
  }

  try {
    return Boolean(
      // eslint-disable-next-line no-new-func
      Function(
        'maestro',
        `"use strict"; return (${expression.slice(2, -1)});`
      )({ platform: 'web' })
    );
  } catch (error) {
    throw new Error(`Failed to evaluate runFlow true condition: ${condition}`, {
      cause: error,
    });
  }
}

function query(page: Page, by: string | { text: string } | { id: string }) {
  if (typeof by === 'string' || 'text' in by) {
    const text = typeof by === 'string' ? by : by.text;
    const isRegex = text.includes('.*');

    const args = [
      isRegex ? new RegExp(`^(?:${text})$`) : text,
      isRegex ? undefined : { exact: true },
    ] as const;

    return page.getByLabel(...args).or(page.getByText(...args));
  }

  if ('id' in by) {
    return page.getByTestId(by.id);
  }

  throw new Error(`Unknown step format: ${JSON.stringify(by)}`);
}
