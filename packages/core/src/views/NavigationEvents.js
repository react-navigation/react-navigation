import React from 'react';
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
    this.subscriptions = {};

    // We register all navigation listeners on mount to ensure listener stability across re-render
    // A former implementation was replacing (removing/adding) listeners on all update (if prop provided)
    // but there were issues (see https://github.com/react-navigation/react-navigation/issues/5058)
    EventNames.forEach(eventName => {
      this.subscriptions[eventName] = this.props.navigation.addListener(
        eventName,
        (...args) => {
          const propListener = this.getPropListener(eventName);
          return propListener && propListener(...args);
        }
      );
    });
  }

  componentWillUnmount() {
    EventNames.forEach(eventName => {
      this.subscriptions[eventName].remove();
    });
  }

  getPropListener = eventName => this.props[EventNameToPropName[eventName]];

  render() {
    return null;
  }
}

export default withNavigation(NavigationEvents);
