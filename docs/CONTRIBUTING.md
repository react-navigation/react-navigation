# React Navigation Contributor Guide

Want to help improve React Navigation? Your help would be greatly appreciated!

Here are some of some of the ways to contribute to the project:

- [Reporting Bugs](#Reporting-Bugs)
- [Improving the Documentation](#Improving-the-Documentation)
- [Responding to Issues](#Responding-to-Issues)
- [Bug Fixes](#Bug-Fixes)
- [Suggesting a Feature](#Suggesting-a-Feature)
- [Big Pull Requests](#Big-Pull-Requests)

And here are a few helpful resources to aid in getting started:

- [Issue Template](#Issue-Template)
- [Pull Request Template](#Pull-Request-Template)
- [Forking the Repository](#Forking-the-Repository)
- [Code Review Guidelines](#Code-Review-Guidelines)
- [Run the Example App](#Run-the-Example-App)
- [Run the Website](#Run-the-Website)
- [Run Tests and Type-Checking](#Run-Tests-and-Type-Checking)

> Note that we used Yarn in the examples below but you're welcome to use NPM instead.

## Contributing

### Reporting Bugs

You can't write code without writing the occasional bug. Especially as React Navigation is in beta and moving quickly, bugs happen. When you think you've found one here's what to do:

1. Search the existing issues for one like what you're seeing. If you see one, add a 👍 reaction (please no +1 comments). Read through the comments and see if you can provide any more valuable information to the thread
2. If there are no other issues like yours then create a new one. Be sure to follow the [issue template](https://github.com/react-community/react-navigation/blob/master/.github/ISSUE_TEMPLATE.md).

Creating a high quality reproduction is critical. Without it we likely can't fix the bug and, in an ideal situation, you'll find out that it's not actually a bug of the library but simply done incorrectly in your project. Instant bug fix!

### Improving the Documentation

Any successful projects needs quality documentation and React Navigation is no different.

The docs are currently organized as follows

- __Getting Started__: Introduction and basics of React Navigation. Help people get up and running with the package quickly. Introduce and demonstrate core functionality.
- __Navigators__: API documentation for the included navigators and supporting APIs
- __Advanced Guides__: (Advanced) Beyond the basics, what can you do with React Navigation? Discuss and demonstrate that here.
- __Routers__: (Advanced) API documentation for the included routers and how to use/customize them
- __Views__: (Advanced) API documentation for the included views and how to use/customize them

The documentation isn't fixed to what categories and documents currently exist. If your documentation contributation is appropriate for any existing document, add it there. If it makes sense to create a new document for your contribution please do so and add it to the docs index.

The docs are indexed in [App.js](https://github.com/react-community/react-navigation/blob/master/website/src/App.js), where all the pages are declared alongside the titles. To test the docs, follow the instructions for running the website.

The markdown from the `docs` folder gets generated and dumped into a json file as a part of the build step. To see updated docs appear in the website, re-run the build step by running `yarn run build-docs` from the `react-navigation` root folder.

### Responding to Issues

Another great way to contribute to React Navigation is by responding to issues. Maybe it's answering someone's question, pointing out a small typo in their code, or helping them put together a reproduction. If you're interested in a more active role in React Navigation start with responding to issues - not only is it helpful but it demonstrates your commitment and knowledge of the code!

### Bug Fixes

Find a bug, fix it up, all day long you'll have good luck! Like it was mentioned earlier, bugs happen. If you find a bug do the following:

1. Check if a pull request already exists addressing that bug. If it does give it a review and leave your comments
2. If there isn't already a pull request then figure out the fix! If it's relatively small go ahead and fix it and submit a pull request. If it's a decent number of changes file an issue first so we can discuss it (see the [Big Pull Requests](#big-pull-requests) section)
3. If there is an issue related to that bug leave a comment on it, linking to your pull request, so others know it's been addressed.

Check out the [help wanted](https://github.com/react-community/react-navigation/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) and [good first issue](https://github.com/react-community/react-navigation/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) tags to see where you can start helping out!

### Suggesting a Feature

Is there something you want to see from React Navigation? Go ahead and open and issue, describe what it is you want to accomplish and why you want to accomplish that. A few things to consider/add

1. Is there already a way to do this and you want to simplify it?
2. Do you have any thoughts on how to implement this feature? Have you done something similar already?

Hold off on submitting feature pull requests until the feature has been discussed. Once the feature has been established and agreed upon, create the pull request (following the [big pull requests](#big-pull-requests) guide).

### Big Pull Requests

For any changes that will add/remove/modify multiple files in the project (new features or bug fixes) hold off on writing code right away. There's a few reasons for that

1. Big pull requests take a lot of time to review and it's sometimes hard to pick up the context
2. Often you may not have to make as big of a change as you expect

With that in mind, here's the suggestion

1. Open an issue and clearly define what it is you want to accomplish and how you intend to accomplish it
2. Discuss that solution with the community and maintainers. Provide context, establish edge cases, and figure out the design
3. Decide on a plan of action
4. Write the code and submit the PR
5. Review the PR. This can take some time but, if you followed the steps above, hopefully it won't take too much time.

The reason we want to do this is to save everyone time. Maybe that feature already exists but isn't documented? Or maybe it doesn't fit with the library. Regardless, by discussing a major change up front you're saving your time and others time as well.

## Information

### Issue Template

Before submitting and issue please take a look at the [issue template](https://github.com/react-community/react-navigation/blob/master/.github/ISSUE_TEMPLATE.md) and follow it. This is in place to help everyone better understand the issue you're having and reduce the back and forth to get the necessary information.

Yes, it takes time and effort to complete the issue template. But that's the only way to ask high quality questions that actually get responses.

Would you rather take 1 minute to create an incomplete issue report and wait months to get any sort of response? Or would you rather take 20 minutes to fill out a high quality issue report, with all the necessary elements, and get a response in days? It's also a respectful thing to do for anyone willing to take the time to review your issue.

### Pull Request Template

Much like the issue template, the [pull request template](https://github.com/react-community/react-navigation/blob/master/.github/PULL_REQUEST_TEMPLATE.md) lays out instructions to ensure your pull request gets reviewd in a timely manner and reduces the back and forth. Make sure to look it over before you start writing any code.

### Forking the Repository

- Fork [`react-navigation`](https://github.com/react-community/react-navigation) on GitHub
- Run these commands in the terminal to download locally and install it:

```bash
git clone https://github.com/<USERNAME>/react-navigation.git
cd react-navigation
git remote add upstream https://github.com/react-community/react-navigation.git
yarn install
```

### Code Review Guidelines

Look around. Match the style of the reset of the codebase. This project uses ESLint and Flow to ensure consistency throughout the project. You can check your project by running

```bash
yarn run eslint
yarn run flow-check
```

If any errors occur you'll either have to manually fix them or you can attempt to automatically fix them by running `yarn run format`.

### Run the Example App

```bash
yarn install
cd examples/NavigationPlayground
yarn install
yarn start
```

You will be show a QR code to scan in the Expo app. You can get Expo [here](https://docs.expo.io/versions/latest/index.html) if you don't have it yet.

All examples:

- [NavigationPlayground](https://github.com/react-community/react-navigation/tree/master/examples/NavigationPlayground)
- [ReduxExample](https://github.com/react-community/react-navigation/tree/master/examples/ReduxExample)
- [SafeAreaExample](https://github.com/react-community/react-navigation/tree/master/examples/SafeAreaExample)

Commands are the same as above for any of the example apps. If you run into any issues, please try the following to start fresh:

```bash
watchman watch-del-all
yarn start -- --reset-cache
```

### Run the Website

For development mode and live-reloading:

```bash
cd website
yarn install
yarn start
```

To run the website in production mode with server rendering:

```bash
yarn run prod
```

If you've made any changes to the `docs` directory you'll need to run `yarn run build-docs` from the root of the project before they're picked up by the website.

### Run Tests and Type-Checking

React Navigation has tests implemented in [Jest](https://facebook.github.io/jest/) and type-checking is managed by [Flow](https://flow.org/). To run either of these, from the React Navigation directory, run either of the following commands (after installing the `node_modules`) to run tests or type-checking.

```bash
yarn run jest
yarn run flow-check
```

These commands will be run by our CI and are required to pass before any contributtions are merged.
