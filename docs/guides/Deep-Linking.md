# Deep Linking

In this guide we will set up our app to handle external URIs. Let's start with the SimpleApp that [we created in the getting started guide](/docs/intro).

In this example, we want a URI like `mychat://chat/Taylor` to open our app and link straight into Taylor's chat page.

## Configuration

Previously, we had defined a navigator like this:

```js
const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen },
  Chat: { screen: ChatScreen },
});
```

We want paths like `chat/Taylor` to link to a "Chat" screen with the `user` passed as a param. Let's re-configure our chat screen with a `path` that tells the router what relative path to match against, and what params to extract. This path spec would be `chat/:user`.

```js
const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen },
  Chat: {
    screen: ChatScreen,
    path: 'chat/:user',
  },
});
```


### URI Prefix

Next, let's configure our navigation container to extract the path from the app's incoming URI. 

```js
const SimpleApp = StackNavigator({...});

// on Android, the URI prefix typically contains a host in addition to scheme
const prefix = Platform.OS == 'android' ? 'mychat://mychat/' : 'mychat://';

const MainApp = () => <SimpleApp uriPrefix={prefix} />;
```

## iOS

Let's configure the native iOS app to open based on the `mychat://` URI scheme.

In `SimpleApp/ios/SimpleApp/AppDelegate.m`:

```
// Add the header at the top of the file:
#import <React/RCTLinkingManager.h>

// Add this above the `@end`:
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}
```

In Xcode, open the project at `SimpleApp/ios/SimpleApp.xcodeproj`. Select the project in sidebar and navigate to the info tab. Scroll down to "URL Types" and add one. In the new URL type, set the identifier and the url scheme to your desired url scheme.

![Xcode project info URL types with mychat added](/assets/xcode-linking.png)

Now you can press play in Xcode, or re-build on the command line:

```sh
react-native run-ios
```

To test the URI on the simulator, run the following:

```
xcrun simctl openurl booted mychat://chat/Taylor
```

To test the URI on a real device, open Safari and type `mychat://chat/Taylor`.

## Android

To configure the external linking in Android, you can create a new intent in the manifest.

In `SimpleApp/android/app/src/main/AndroidManifest.xml`, add the new `VIEW` type `intent-filter` inside the `MainActivity` entry:

```
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="mychat"
          android:host="mychat" />
</intent-filter>
```

Now, re-install the app:

```sh
react-native run-android
```

To test the intent handling in Android, run the following:

```
adb shell am start -W -a android.intent.action.VIEW -d "mychat://mychat/chat/Taylor" com.simpleapp
```

```phone-example
linking
```
