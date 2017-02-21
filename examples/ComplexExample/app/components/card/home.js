import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    View,
    Text,
    StyleSheet,
    Button,
    ScrollView,
    TouchableOpacity
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from '../../styles/card.style'
import { headerStyle, titleStyle } from '../../styles/header.style'
import ButtonRight from '../header/button-right'
import * as DetailActions from '../../actions/detail'

function mapStateToProps(state) {
    return {
        detail: state.detail
    }
}

class Home extends Component {

    static navigationOptions = {
        title: 'News Feed',
        header: ({ state, setParams, navigate }) => ({
            style: headerStyle,
            titleStyle: titleStyle,
            right: (<ButtonRight
                icon="menu"
                onPress={() => navigate('Settings')}
            />),
            left: null
        })
    }

    // Fetch detail items
    // Example only options defined
    componentWillMount() {
        this.props.fetchDetailState({ limit: 10 })
    }

    render() {

        const { detail } = this.props
        const { navigate, goBack } = this.props.navigation

        if (!detail.length)
            return (<View><Text>Loading...</Text></View>)

        return (
            <ScrollView style={[ styles.wrapper ]}>
                { detail.map( (item, i) => {
                    return <View key={i}>
                        <TouchableOpacity onPress={() => navigate('Detail', { item })}>
                            <View style={[ styles.item ]}></View>
                        </TouchableOpacity>
                        <Button
                            title={ item.title }
                            onPress={() => navigate('Detail', { item })}
                        />
                    </View>
                })}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({ ...Styles,
    item: {
        height: 200,
        backgroundColor: '#efefef'
    }
})

// Smart Component
// Fetches detail items and maps to component props
export default connect(mapStateToProps, DetailActions)(Home)
