import React, { Component } from "react";
import { connect } from "react-redux";
import * as AuthActions from "../actions/authentication";
import RootNavigator from "../navigators/root";
import Authenticate from "../components/authentication/authenticate";

class Root extends Component {
  render() {
    if (!this.props.user)
      return <Authenticate authenticate={this.props.authenticate} />;

    return <RootNavigator />;
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    navigation: state.navigation
  };
}

export default connect(mapStateToProps, AuthActions)(Root);
