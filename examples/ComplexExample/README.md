# React Native - react-navigation / redux experimental boiler plate

#### Installation & Getting Started

Simply clone the repo and install

```javascript
npm install
npm start react-native
```



#### Application flow

The application runs as a TabNavigator containing StackNavigator components. The main TabNavigator is nested inside a higher level StackNavigator which in turn sits inside an application container (connected smart component).

```
+-- index.ios.js
|   +-- app.navigation.js
|       +-- app/
|           +-- containers/rootContainer.js
|               +-- store/configureStore.js
|               +-- navigators/root.js      [StackNavigator]
|                   +-- App                 [TabNavigator]
|                       +-- List            [StackNavigator]
|                           +-- ...Screens  [Multiple Screens]
|                       +-- Groups          [StackNavigator]
|                       +-- Stats           [StackNavigator]
|                       +-- User            [StackNavigator]
|                       +-- Admin           [StackNavigator]
|                   +-- Settings            [Screen]
```

#### Isues to be aware of

The demo uses the https://material.io/icons/ icon set. On IOS this will need to be added to the project prior to running. I used xcode to achieve this.
