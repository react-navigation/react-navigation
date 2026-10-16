# E2E tests

The e2e tests use [e2e](https://e2e.tester.army). The configuration is in [`e2e.config.ts`](../e2e.config.ts) and the tests are in [`tests`](./tests).

Tests importing `test` from [`fixtures.ts`](./fixtures.ts) run on every target: Chromium, Firefox, iOS and Android. Tests importing `test` from `@e2e-dev/web` use browser-only APIs and only run on the web targets.

## Running the tests

```sh
pnpm example e2e:web
pnpm example e2e:ios
pnpm example e2e:android
```

To run a single file, pass it to `e2e run`:

```sh
pnpm example exec e2e run e2e/tests/stack-basic.e2e.ts --target chromium
```

Failed tests write a trace with the steps and the screen at failure to `.e2e/results`.

## Writing tests

- Use `launch` to open a screen with a deep link and wait for a text, and `open` to open a deep link without restarting the app.
- Use `scroll` and `swipe` instead of `screen.swipe`, since swiping with the mouse doesn't scroll or move pagers on the web.
- On Android, screens below the focused screen in a stack stay in the accessibility tree, listed after the focused screen. So use `.first()` when a query can match elements in multiple screens, e.g. when tapping buttons.
- On the web, the off-screen pages of pagers count as visible. Use `expectInViewport` to check that the content of the current page is shown.
