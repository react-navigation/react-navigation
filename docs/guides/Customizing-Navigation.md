## Customizing Navigation Views

Modify the presentation of navigation, including styles, animations and gestures.

## Customizing Routers

Building a custom router allows you to change the navigation logic of your component, manage navigation state, and define behavior for URIs.


A router can be defined like this:

```
class MyNavigationAwareComponent extends React.Component {

    static router = {

        // Defines the navigation state for a component:
        getStateForAction: (action: {type: string}, lastState?: any) => {
            const state = lastState = { myMode: 'default' };
            if (action.type === 'MyAction') {
                return { myMode: 'action' };
            } else if (action.type === NavigationActions.BACK) {
                return { myMode: 'blockBackButton' };
            } else {
                return state;
            }
        },

        // Defines if a component can handle a particular URI.
        // If it does, return an action to be passed to `getStateForAction`

        getActionForURI: (uri: string) => {
            if (uri === 'myapp://myAction') {
                return { type: 'MyAction' };
            }
            return null;
        },

    };

    render() {
        // render something based on this.props.navigation.state
        ...
    }

    onButtonPress = () => {
        this.props.navigation.dispatch({ type: 'MyAction' });
    };

    ...

}
```
