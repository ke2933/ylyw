import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {Global} from '../../common/Global';
import {TabNavigator, StackNavigator} from 'react-navigation';
import FirstChoiceUnderWay from '../../../../gaokj/firstChoiceUnderWay';//正在会诊
import FirstChoiceReception from '../../../../gaokj/firstChoiceReception';//待接收
import FirstChoiceOverTime from '../../../../gaokj/firstChoiceOverTime';//超时
import FirstChoiceAll from '../../../../gaokj/firstChoiceAll';//全部

const Tabs = TabNavigator({
    'FirstChoiceUnderWay': {
        screen: FirstChoiceUnderWay,
        navigationOptions: ()=>TabOptions('正在会诊'),
    },

    'FirstChoiceReception': {
        screen: FirstChoiceReception,
        navigationOptions: ()=>TabOptions('待接收'),
    },
    'FirstChoiceOverTime': {
        screen: FirstChoiceOverTime,
        navigationOptions: ()=>TabOptions('超时'),
    },

    'FirstChoiceAll': {
        screen: FirstChoiceAll,
        navigationOptions: ()=>TabOptions('全部'),
    },
}, {
    tabBarPosition: 'Bottom',
    swipeEnabled: false,//滑动切换
    animationEnabled: false,//点击切换是否有滑动效果
    // backBehavior : 'none',//返回键是否回到第一个tab
    lazy: true,
    tabBarOptions: {
        labelStyle: {
            padding: 0,
            margin: 0,
            fontSize: 15,
        },
        iconStyle:{
            marginTop: -12,
            width: SCREEN_WIDTH / 4,
            height: 34,
        },
        style: {
            height: 34,
            backgroundColor: "#fff",
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

const FirstChoice = StackNavigator({
    FirstChoiceUnderWay: {
        screen: Tabs,//四个分类
    },
});
const TabOptions = (tabBarTitle) => {
    const tabBarLabel = tabBarTitle;
    const tabBarIcon = (({focused}) => {
        return (
            <View style={[styles.tabBox,{ borderBottomWidth: focused ? 2 : 0,}]}>
                <Text style={[{
                    color: focused ? '#566cb7' : '#676666',

                    paddingTop: IOS ? 4 : 0,
                }, styles.tabText]}>{tabBarTitle}</Text>
            </View>
        )
    });

    const tabBarVisible = true;
    return {tabBarLabel, tabBarIcon, tabBarVisible};
};


const styles = StyleSheet.create({
    tabBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#566CB7',
    },
    tabText: {
        fontSize: FONT_SIZE(15),
    },
});
export default FirstChoice;