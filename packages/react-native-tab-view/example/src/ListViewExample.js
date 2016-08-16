import React, { Component } from 'react';
import { ListView, View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    margin: 8,
    padding: 16,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, .1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'rgba(0, 0, 0, .4)',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default class ListViewExample extends Component {
  state = {
    data: [],
    dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    }),
  };

  componentWillMount() {
    this._genRows();
  }

  _genRows = () => {
    const data = this.state.data.slice(0);
    const itemsLength = data.length;

    if (itemsLength >= 1000) {
      return;
    }

    for (let i = 0; i < 100; i++) {
      data.push(itemsLength + i);
    }

    this.setState({
      data,
      dataSource: this.state.dataSource.cloneWithRows(data),
    });
  };

  _renderRow = (index) => {
    return (
      <View style={styles.row}>
        <Text style={styles.text}>{index}</Text>
      </View>
    );
  };

  render() {
    return (
      <ListView
        {...this.props}
        contentContainerStyle={styles.container}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        onEndReached={this._genRows}
      />
    );
  }
}
