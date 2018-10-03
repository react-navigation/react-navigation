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
    EventNames.forEach(this.addListener);
  }

  componentDidUpdate(prevProps) {
    EventNames.forEach(eventName => {
      const listenerHasChanged =
        this.props[EventNameToPropName[eventName]] !==
        prevProps[EventNameToPropName[eventName]];
      if (listenerHasChanged) {
        this.removeListener(eventName);
        this.addListener(eventName);
      }
    });
  }

  componentWillUnmount() {
    EventNames.forEach(this.removeListener);
  }

  addListener = eventName => {
    const listener = this.props[EventNameToPropName[eventName]];
    if (listener) {
      this.subscriptions[eventName] = this.props.navigation.addListener(
        eventName,
        listener
      );
    }
  };

  removeListener = eventName => {
    if (this.subscriptions[eventName]) {
      this.subscriptions[eventName].remove();
      this.subscriptions[eventName] = undefined;
    }
  };

  render() {
    return null;
  }
}

export default withNavigation(NavigationEvents);
