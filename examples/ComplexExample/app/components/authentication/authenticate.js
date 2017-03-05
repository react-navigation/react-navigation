import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

class Authenticate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "Let me in!"
    };
  }

  authenticate() {
    this.setState({ value: "Authenticating..." });
    this.props.authenticate();
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          style={styles.button}
          title={this.state.value}
          onPress={() => this.authenticate()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50
  },
  button: {}
});

export default Authenticate;
