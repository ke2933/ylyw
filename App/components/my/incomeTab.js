import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Alert,
    Image,
    StatusBar,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import {TabNavigator, StackNavigator} from 'react-navigation';
import ProfitAll from './profitAll';// 全部收益
import ProfitGroup from './profitGroup';// 会诊收益
import ProfitFirstChoice from './profitFirstChoice';
import {Global} from '../../common/Global';
import px2dp from "../../common/Tool";
// 首诊收益
const Tabs = TabNavigator({
    'GroupUnderWay': {
        screen: ProfitAll,
        navigationOptions: () => TabOptions('全部'),
    },

    'GroupReception': {
        screen: ProfitGroup,
        navigationOptions: () => TabOptions('首诊订单'),
    },
    'GroupOverTime': {
        screen: ProfitFirstChoice,
        navigationOptions: () => TabOptions('会诊订单'),
    },
}, {
    tabBarPosition: 'top',
    swipeEnabled: false,//滑动切换
    animationEnabled: false,//点击切换是否有滑动效果
    // backBehavior : 'none',//返回键是否回到第一个tab
    lazy: true,
    tabBarOptions: {
        style: {
            height: 45,
            backgroundColor: "#fff",
        },
        iconStyle: {
            width: SCREEN_WIDTH / 3,
            height: 45,
            marginTop: -12,
        },
        activeBackgroundColor: '#fff',
        activeTintColor: '#566CB7',
        inactiveBackgroundColor: '#fff',
        inactiveTintColor: '#333333',
        showIcon: true,
        showLabel: false,
        pressOpacity: 0.8,
        indicatorStyle: {
            height: 0,
        }
    },
});

const TabOptions = (tabBarTitle) => {
    const tabBarLabel = tabBarTitle;
    const tabBarIcon = (({tintColor, focused}) => {
        return (
            <View style={[styles.tabBox, {borderBottomColor: focused ? '#566cb7' : 'transparent'}]}>
                <Text style={[{
                    color: focused ? '#566cb7' : '#9e9e9e',
                }, styles.tabText]}>{tabBarTitle}</Text>
            </View>
        )
    });

    const tabBarVisible = true;
    return {tabBarLabel, tabBarIcon, tabBarVisible};
};

const incomeList = StackNavigator({
    Group: {
        screen: Tabs,//四个分类
    },
});

const styles = StyleSheet.create({
    tabBox: {
        flex: 1,
        height: 45,
        width: SCREEN_WIDTH / 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 2,
    },
    tabText: {
        fontSize: FONT_SIZE(16),
    }
});

export default incomeList;