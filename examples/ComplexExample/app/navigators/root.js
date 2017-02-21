// Top level StackNavigator
// Responsible for main App TagNavigator and modals
// App root handles drop in, all oher routes are modal

import {
    StackNavigator
} from 'react-navigation';

import TabNavigator from './tabs'
import Settings from '../components/card/settings'

export default StackNavigator({

    App:        { screen: TabNavigator, navigationOptions: { header: { visible: false }}},
    Settings:   { screen: Settings }

}, {
    headerMode: 'screen',
    initialRouteName: 'App',
    mode: 'modal'
});
