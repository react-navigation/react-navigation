import * as React from 'react';
import withNavigation from './withNavigation';

const EventNameToPropName = {
  willFocus: 'onWillFocus',
  didFocus: 'onDidFocus',
  willBlur: 'onWillBlur',
  didBlur: 'onDidBlur',
};

const EventNames = Object.keys(EventNameToPropName);

class NavigationEvents extends React.Component {
  componentDidMount() {
    // We register all navigation listeners on mount to ensure listener stability across re-render
    // A former implementation was replacing (removing/adding) listeners on all update (if prop provided)
    // but there were issues (see https://github.com/react-navigation/react-navigation/issues/5058)
    this.subscribeAll();
  }

  componentDidUpdate(prevProps) {
    if (this.props.navigation !== prevProps.navigation) {
      this.removeAll();
      this.subscribeAll();
    }
  }

  componentWillUnmount() {
    this.removeAll();
  }

  getPropListener = (eventName) => this.props[EventNameToPropName[eventName]];

  subscribeAll() {
    this.subscriptions = {};

    EventNames.forEach((eventName) => {
      this.subscriptions[eventName] = this.props.navigation.addListener(
        eventName,
        (...args) => {
          const propListener = this.getPropListener(eventName);
          return propListener && propListener(...args);
        }
      );
    });
  }

  removeAll() {
    EventNames.forEach((eventName) => {
      this.subscriptions[eventName].remove();
    });
  }

  render() {
    return null;
  }
}

export default withNavigation(NavigationEvents);
