# Contributing

This library is a community effort: it can only be great if we all help out in one way or another! If you feel like you aren't experienced enough using React Navigation to contribute, you can still make an impact by:

- Responding to one of the open [issues](https://github.com/react-navigation/react-navigation/issues). Even if you can't resolve or fully answer a question, asking for more information or clarity on an issue is extremely beneficial for someone to come after you to resolve the issue.
- Creating public example repositories or [Snacks](https://snack.expo.dev/) of navigation problems you have solved and sharing the links.
- Answering questions on [Stack Overflow](https://stackoverflow.com/search?q=react-navigation).
- Answering questions in our [Reactiflux](https://www.reactiflux.com/) channel.
- Providing feedback on the open [PRs](https://github.com/react-navigation/react-navigation/pulls).
- Providing feedback on the open [RFCs](https://github.com/react-navigation/rfcs).
- Improving the [website](https://github.com/react-navigation/react-navigation.github.io).

If you don't know where to start, check the ones with the label [`good first issue`](https://github.com/react-navigation/react-navigation/labels/good%20first%20issue) - even fixing a typo in the documentation is a worthy contribution!

## Development workflow

The project uses a monorepo structure for the packages managed by [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) and [lerna](https://lerna.js.org). To get started with the project, run `yarn` in the root directory to install the required dependencies for each package:

```sh
yarn
```

While developing, you can run the [example app](/example/) with [Expo](https://expo.dev/) to test your changes:

```sh
yarn example start
```

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
yarn typecheck
yarn lint
```

To fix formatting errors, run the following:

```sh
yarn lint --fix
```

Remember to add tests for your change if possible. Run the unit tests by:

```sh
yarn test
```

Before running tests configure Playwright with:

```sh
npx playwright install
```

Run the e2e tests by:

```sh
yarn example e2e:web --ui
```

By default, this will use the local dev server for the app. If you want to test a production build, first build the [example app](/example/) for web:

```sh
yarn example expo export --platform web
```

Then run the tests with the `CI` environment variable:

```sh
CI=1 yarn example e2e:web
```

Before running Maestro tests:

- Install it following the instructions [here](https://maestro.mobile.dev/getting-started/installing-maestro).
- Start the Emulator or Simulator and install the Expo Go app.
- Start the Metro server with `yarn example start`.

Then run the Maestro tests by:

```sh
yarn example e2e:native
```

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes to documentation, e.g. add usage example for the module.
- `test`: adding or updating tests, eg add e2e tests using maestro.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks verify that your commit message matches this format when committing.

### Linting and tests

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [TypeScript](https://www.typescriptlang.org/)

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing.

Our pre-commit hooks verify that the linter and tests pass when committing.

### Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn install`: setup project by installing all dependencies and pods.
- `yarn typecheck`: type-check files with TypeScript.
- `yarn lint`: lint files with ESLint.
- `yarn test`: run unit tests with Jest.
- `yarn example start`: run the example app with Expo.

### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.

## Publishing

Maintainers with write access to the GitHub repo and the npm organization can publish new versions. To publish a new version, first, you need to export a `GH_TOKEN` environment variable as mentioned [here](https://github.com/lerna-lite/lerna-lite/blob/main/packages/version/README.md#remote-client-auth-tokens). Then run:

```sh
yarn release
```

This will automatically bump the version and publish the packages. It'll also publish the changelogs on GitHub for each package.

When releasing a pre-release version, we need to:

- Update `lerna.json` to set the `preId` (e.g. `alpha`) and `preDistTag` (e.g. `next`) fields, and potentially the `allowBranch` field.
- Run the following command:

```sh
yarn lerna publish --conventional-commits --conventional-prerelease --preid alpha
```

When releasing a stable version, we need to:

- Remove the `preId` and `preDistTag` fields from `lerna.json`.
- Run the following command:

```sh
yarn lerna publish --conventional-commits --conventional-graduate
```
