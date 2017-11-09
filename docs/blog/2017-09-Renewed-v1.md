# A (Renewed) Path to React Navigation V1

*September 12, 2017*

It’s been awhile since the last post on this blog and I wanted to take a moment to bring everyone up to speed on what’s been going on with React Navigation.

This project got big really fast: as the officially recommended navigation library for React Native, thousands of developers are using the project every day to build apps.

Having such a broad usage, the repository has a lot of new questions, feature requests, and (as with any library) bugs. It’s gotten a bit out of hand (thus hard to manage) so I wanted to give you an overview of how we’re trying to get things moving forward again resulting in a stable V1 release.

## Issues

If you've looked at the project over the last few months you've probably seen that there are a lot of open issues. If you've looked closely over the last few weeks you may have noticed that it's a few hundred less - [progress](https://github.com/react-community/react-navigation/pulse/monthly)!

I wanted to tell you about how we’re addressing the GitHub issues: in an effort to reduce the cognitive load associated with so many open issues we've set out to accomplish a few things:

1. Label all issues
2. Close any "question" type issues. The idea here is to keep GitHub issues focused on bugs & feature requests. [StackOverflow](https://stackoverflow.com/questions/tagged/react-navigation) and [Reactiflux](https://www.reactiflux.com/) are better places for questions.
3. Eliminate duplicate issues
4. Of the remaining issues determine bugs & features necessary for V1

Don't hesitate to open new issues but **please do follow** the issue template! 😄

## Pull Requests

We greatly appreciate all the time put into each and every one of them but, as with issues, there's a bit of a backlog to work through.

We encourage PRs but we want you to know that we’re prioritizing bug fixes and feature requests that align with the new 1.0 roadmap (see next section). We want to focus on the highest impact features for the community as a whole.

## A New Roadmap

We’re happy to say we’ve put together a new roadmap to version 1.0 of this package! You can see what will be included by checking out [this issue](https://github.com/react-community/react-navigation/issues/2585).

How do we decide on what to include in the revised V1.0?

We had conversations with people using React Navigation in production, looked at issues with the most reactions, reviewed high quality pull requests, and talked with the community to see what was needed.

Will V1.0 cover everyone’s uses? No. But it should cover most use cases and we hope to improve documentation enough that you’re comfortable and able to customize React Navigation to your needs.

## Roles & Responsibilities

Just like any other organization - no one person can do everything. It’s helpful to have defined roles & responsibilities so that others know who to ask and we can avoid becoming overwhelmed.

This is something I want to adopt for the management of React Navigation. I hope it reduces the likelihood of burnout for those that have chosen to dedicate time to the project. With that in mind here are the roles a few primary contributors have chosen to take on:

- [davepack](https://github.com/davepack) - Pull request review, development
- [GantMan](https://github.com/GantMan) - Issue management, testing
- [kelset](https://github.com/kelset) - Issue management, pull request review
- [matthamil](https://github.com/matthamil) - Pull request review, issue management
- [skevy](https://github.com/skevy) - Pull request review, release management
- [spencercarli](https://github.com/spencercarli) - Documentation, issue management

[Expo](https://expo.io/) has expressed that React Navigation V1.0 is a priority for them and has committed one of their engineers (Dave) to aid in that.

## The Community Navigation Library

React Navigation is the React Native community’s navigation library with that being said - you too can contribute!

If you see someone's question - try to answer it!
If you have thoughts on a potential API for a requested feature - share it!
If you think you know the cause for a bug - explain it!

Regardless of what you do though, be nice & remember that on the other side of the screen there is another developer, just like you…

Personally, I [enjoy some shade](https://media.giphy.com/media/l4FGlDsvuUd2RkBYQ/giphy.gif) thrown my way, but I might be in the minority 😉.

Thanks for reading and I look forward to working with you on React Navigation!

Spencer Carli

*Thanks to Matt Hamill & Lorenzo Sciandra for reviewing.*
