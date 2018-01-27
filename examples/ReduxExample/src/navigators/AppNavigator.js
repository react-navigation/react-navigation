import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import LoginScreen from '../components/LoginScreen';
import MainScreen from '../components/MainScreen';
import ProfileScreen from '../components/ProfileScreen';

export const AppNavigator = StackNavigator({
  Login: { screen: LoginScreen },
  Main: { screen: MainScreen },
  Profile: { screen: ProfileScreen },
});

class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  };

  _actionEventSubscribers = new Set();

  _addListener = (eventName, handler) => {
    eventName === 'action' && this._actionEventSubscribers.add(handler);
    return {
      remove: () => {
        this._actionEventSubscribers.delete(handler);
      },
    };
  };

  componentDidUpdate(lastProps) {
    const lastState = lastProps.nav;
    this._actionEventSubscribers.forEach(subscriber => {
      subscriber({
        lastState: lastProps.nav,
        state: this.props.nav,
        action: this.props.lastAction,
      });
    });
  }

  render() {
    const { dispatch, nav } = this.props;
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch,
          state: nav,
          addListener: this._addListener,
        })}
      />
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  lastAction: state.lastAction,
});

export default connect(mapStateToProps)(AppWithNavigationState);
