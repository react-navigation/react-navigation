# react-native-screens

This project aims to expose native navigation container components to React Native. It is not designed to be used as a standalone library but rather as a dependency of a [full-featured navigation library](https://github.com/react-navigation/react-navigation).

## How can I take advantage of that?

Screens are already integrated with the React Native's most popular navigation library [react-navigation](https://github.com/react-navigation/react-navigation) and [Expo](https://expo.io).
Read usage guide depending on if you are [using Expo](#usage-in-expo-with-react-navigation) or [not](#usage-with-react-navigation-without-expo).

## Usage with [react-navigation](https://github.com/react-navigation/react-navigation) (without Expo)

Screens support is built into [stack navigator](https://reactnavigation.org/docs/en/stack-navigator.html) starting from version [2.14.0](https://github.com/react-navigation/react-navigation/releases/tag/2.14.0) of [react-navigation](https://github.com/react-navigation/react-navigation). We plan on adding it to other navigators in near future.

To enable stack navigator to use screens instead of plain RN Views for rendering stack cards follow the steps below:

1. Add this library as a depedency to your project:
```
yarn add react-native-screens
```

2. Link native modules this library ships with into your app:
```
react-native link react-native-screens
```

 > If you are not familiar with the concept of linking libraries [read on here](https://facebook.github.io/react-native/docs/linking-libraries-ios).

3. Enable screens support before any of your navigation screen renders. Add the following code to your main application file (e.g. App.js):
```js
import { useScreens } from 'react-native-screens';

useScreens();
```

Note that the above code need to execute before first render of a navigation screen. You can check Example's app [App.js](https://github.com/kmagiera/react-native-screens/blob/master/Example/App.js#L16) file as a reference.

4. On Android change your main activity class to extend [`ReactFragmentActivity`](https://github.com/facebook/react-native/blob/0.57-stable/ReactAndroid/src/main/java/com/facebook/react/ReactFragmentActivity.java). The file you'll have to change is likely called `MainActivity.java` unless you customized it after creating your project:
```diff
-import com.facebook.react.ReactActivity;
+import android.os.Bundle;
+import com.facebook.react.ReactFragmentActivity;
 import com.facebook.react.ReactActivityDelegate;

-public class MainActivity extends ReactActivity {
+public class MainActivity extends ReactFragmentActivity {
+
+    @Override
+    protected void onCreate(Bundle savedInstanceState) {
+        super.onCreate(null);
+    }

     @Override
     protected String getMainComponentName() {
```

5. Make sure that the version of [react-navigation](https://github.com/react-navigation/react-navigation) you are using is 2.14.0 or higher

5. You are all set 🎉 – when screens are enabled in your application code react-navigation will automatically use them instead of relying on plain React Native Views.

## Usage in Expo with [react-navigation](https://github.com/react-navigation/react-navigation)

Screens support is built into Expo [SDK 30](https://blog.expo.io/expo-sdk-30-0-0-is-now-available-e64d8b1db2a7) and react-navigation starting from [2.14.0](https://github.com/react-navigation/react-navigation/releases/tag/2.14.0). Make sure your app use these versions before you start.

1. Add screens library as dependency to your project – you can skip this step when using snack as the dependency will be imported when you import it in one of the JS files
```
yarn add react-native-screens
```

2. Open your App.js file and add the following snippet somewhere near the top of the file (e.g. right after import statements):
```
import { useScreens } from 'react-native-screens';

useScreens();
```

3. That's all 🎉 – enojy faster navigation in your Expo app. Keep in mind screens are in pretty early phase so please report if you discover some issues.

## Interop with [react-native-navigation](https://github.com/wix/react-native-navigation)

React-native-navigation library already uses native containers for rendering navigation scenes so wrapping these scenes with `<ScreenContainer>` or `<Screen>` component does not provide any benefits. Yet if you would like to build a component that uses screens primitives under the hood (for example a view pager component) it is safe to use `<ScreenContainer>` and `<Screen>` components for that as these work out of the box when rendered on react-native-navigation scenes.

## Interop with other libraries

This library should work out of the box with all existing react-native libraries. If you expirience problems with interoperability please [report an issue](https://github.com/kmagiera/react-native-screens/issues).


## Guide for navigation library authors

If you are building navigation library you may want to use react-native-screens to have a control which parts of the react component tree are attached to the native view hierarchy.
To do that react-native-screens provides you with two components documented below:

### `<ScreenContainer/>`

This component is a container for one or more `Screen` components.
It does not accept other component types are direct children.
The role of container is to control which of its children screens should be attached to the view hierarchy.
It does that by monitoring `active` property of each of its children.
It it possible to have as many `active` children as you'd like but in order for the component to be the most effictent we should keep the number of active screens to the minimum.
In a case of stack navigator or tabs navigator we only want to have one active screen (the top most view on a stack or the selected tab).
Then for the time of transitioning between views we may want to activate a second screen for the duration of transition, and then go back to just one active screen.

### `<Screen/>`

This component is a container for views we want to display on a navigation screen.
It is designed to only be rendered as a direct child of `ScreenContainer`.
In addition to plain React Native [View props](http://facebook.github.io/react-native/docs/view#props) this component only accepts a single additional property called `active`.
When `active` is set to `0`, the parent container will detach its views from the native view hierarchy.
Otherwise the views will be attached as long as the parent container is attached too.

### Example

```js
<ScreenContainer>
  <Screen>{tab1}</Screen>
  <Screen active={1}>{tab2}</Screen>
  <Screen>{tab3}</Screen>
</ScreenContainer>
```

## Guide for native component authors

If you are adding a new native component to be used from the React Native app, you may want it to respond to navigation lifecycle events.

Good example is a map component that shows current user location. When component is on the top-most screen it should register for location updates and display users location on the map. But if we navigate away from a screen that has a map, e.g. by pushing new screen on top of it or if it is in one of a tabs and user just switched to the previous app, we may want to stop listening to location updates.

In order to achieve that we need to know at the native component level when our native view goes out of sight. With react-native-screens you can do that in the following way:

### Navigation lifecycle on iOS

In order for your native view on iOS to be notified when its parent navigation container goes into background override `didMoveToWindow` method:

```objective-c
- (void)didMoveToWindow
{
  [super didMoveToWindow];
  BOOL isVisible = self.superview && self.window;
  if (isVisible) {
    // navigation container this view belongs to became visible
  } else {
    // we are in a background
  }
}
```

You can check our example app for a fully functional demo see [RNSSampleLifecycleAwareView.m](https://github.com/kmagiera/react-native-screens/blob/master./Example/ios/RNSSampleLifecycleAwareView.m) for more details.

### Navigation lifecycle on Android

On Android you can use [LifecycleObserver](https://developer.android.com/reference/android/arch/lifecycle/LifecycleObserver) interface which is a part of Android compat library to make your view handle lifecycle events.
Check [LifecycleAwareView.java](https://github.com/kmagiera/react-native-screens/blob/master/Example/android/app/src/main/java/com/swmansion/rnscreens/example/LifecycleAwareView.java) from our example app for more details on that.

In addition to that you will need to register for receiving these updates. This can be done using [`LifecycleHelper.register`](https://github.com/kmagiera/react-native-screens/blob/master/android/src/main/java/com/swmansion/rnscreens/LifecycleHelper.java#L50).
Remember to call [`LifecycleHelper.unregister`](https://github.com/kmagiera/react-native-screens/blob/master/android/src/main/java/com/swmansion/rnscreens/LifecycleHelper.java#L59) before the view is dropped.
Please refer to [SampleLifecycleAwareViewManager.java](https://github.com/kmagiera/react-native-screens/blob/master/Example/android/app/src/main/java/com/swmansion/rnscreens/example/SampleLifecycleAwareViewManager.java) from our example app to see what are the best ways of using the above methods.

## License

Gesture handler library is licensed under [The MIT License](LICENSE).

## Credits

This project is supported by amazing people from [Expo.io](https://expo.io) and [Software Mansion](https://swmansion.com)

[![expo](https://avatars2.githubusercontent.com/u/12504344?v=3&s=100 "Expo.io")](https://expo.io)
[![swm](https://avatars1.githubusercontent.com/u/6952717?v=3&s=100 "Software Mansion")](https://swmansion.com)
