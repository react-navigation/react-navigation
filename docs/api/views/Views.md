# Views

Navigation views are presentation components that take a [`router`](/docs/api/routers) and a [`navigation`](/docs/navigators/navigation-prop) prop, and can display several screens, as specified by the `navigation.state`.

Navigation views are controlled React components that can present the current navigation state. They manage switching of screens, animations and gestures. They also present persistent navigation views such as tab bars and headers.

## Built in Views

- [CardStack](https://github.com/react-community/react-navigation/blob/master/src/views/CardStack/CardStack.js) - Present a stack that looks suitable on any platform
    + [Card](https://github.com/react-community/react-navigation/blob/master/src/views/CardStack/Card.js) - Present one card from the card stack, with gestures
    + [Header](https://github.com/react-community/react-navigation/blob/master/src/views/Header/Header.js) - The header view for the card stack
- [Tabs](https://github.com/react-community/react-navigation/blob/master/src/views/TabView/TabView.js) - A configurable tab switcher / pager
- [Drawer](https://github.com/react-community/react-navigation/blob/master/src/views/Drawer/DrawerView.js) - A view with a drawer that slides from the left


## [Transitioner](/docs/views/transitioner)

`Transitioner` manages the animations during the transition and can be used to build fully custom navigation views. It is used inside the `CardStack` view. [Learn more about Transitioner here.](/docs/views/transitioner)
