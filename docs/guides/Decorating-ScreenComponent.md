### Decorating the child view with `drawerScreenComponent`

If one wishes to add a component, for example a [NavBar](https://github.com/react-native-community/react-native-navbar), one way to do it is to decorate `DrawerScreen`, which is the component responsible for drawing the component specified by the current route.

#### Example:

```js
// DecoratedScreenComponent.js
export default function DecoratedScreenComponent(props) {
  return (
    <View>
      <NavBar />
      <DrawerScreen {...props} />
    </View>);
}
```

```js
DrawerNavigator({
  ...routeConfig
}, {
  ...DrawerNavigatorConfig
  drawerScreenComponent: DecoratedScreenComponent,
})
```