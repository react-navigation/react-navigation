
# withNavigation

[`withNavigation`](/src/views/withNavigation.js) is a Higher Order Component which passes the `navigation` prop into a wrapped Component. It's useful when you cannot pass the `navigation` prop into the component directly, or don't want to pass it in case of a deeply nested child.

## Example

```js
import { Button } 'react-native';
import { withNavigation } from 'react-navigation';

const MyComponent = ({ to, navigation }) => (
    <Button title={`navigate to ${to}`} onPress={() => navigation.navigate(to)} />
);

const MyComponentWithNavigation = withNavigation(MyComponent);
```
