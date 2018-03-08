import React, {Component} from 'react';

import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import {Global} from '../../common/Global';
import {TabNavigator, StackNavigator} from 'react-navigation';
import SystemTidings from './systemTidings';// 系统消息
import OrderTidings from './orderTidings';// 订单消息
import GroupTidings from './groupTidings';// 会诊互动
const SystemIcon = require('../../images/system_tidings.png');
const SystemEleIcon = require('../../images/system_tidings.png');
const OrderIcon = require('../../images/order_tidings.png');
const OrderEleIcon = require('../../images/order_ele_tidings.png');
const GroupIcon = require('../../images/group_tidings.png');
const GroupEleIcon = require('../../images/group_ele_tidings.png');


const Tabs = TabNavigator({
        'GroupTidings': {
            screen: GroupTidings,
            navigationOptions: () => TabOptions('会诊互动', GroupIcon, GroupEleIcon,GroupNum)
        },
        'OrderTidings': {
            screen: OrderTidings,
            navigationOptions: () => TabOptions('订单', OrderIcon, OrderEleIcon,OrderNum)
        },

        'SystemTidings': {
            screen: SystemTidings,
            navigationOptions: () => TabOptions('系统消息', SystemIcon, SystemEleIcon,SystemNum)
        },
    },
    {
        tabBarPosition: 'top',
        swipeEnabled: false,//滑动切换
        animationEnabled: false,//点击切换是否有滑动效果
        backBehavior: 'none',//返回键是否回到第一个tab
        lazy: true,
        tabBarOptions: {
            labelStyle: {
                padding: 0,
                margin: 0,
            },
            iconStyle: {
                marginTop: -12,
                height: 50,
                width: SCREEN_WIDTH / 3,
            },
            style: {
                height: 50,
                backgroundColor: '#fff',
            },
            activeBackgroundColor: '#fff',
            activeTintColor: '#566CB7',
            inactiveBackgroundColor: '#fff',
            inactiveTintColor: '#333',
            showIcon: true,
            showLabel: false,
            pressOpacity: 0.8,
            indicatorStyle: {
                height: 0,
            }
        },
    }
);

const TabOptions = (tabBarTitle, normalImage, selectedImage,num) => {
    const tabBarLabel = tabBarTitle;
    const tabBarIcon = (({tintColor, focused}) => {
        return (

            <View style={styles.tabBox}>
                <Image
                    source={!focused ? normalImage : selectedImage}
                    style={[styles.tabImg, {tintColor: tintColor}]}
                />
                <Text style={[{
                    color: focused ? '#566cb7' : '#676666',
                    paddingTop: IOS ? 4 : 0,
                }, styles.tabText]}>{tabBarTitle}</Text>
                {num > 0 ? <View style={styles.unreadBox}>
                    <Text style={styles.unreadNum}>{num > 99 ? '...' : num}</Text>
                </View> : null}
            </View>

        )
    });

    const tabBarVisible = true;
    return {tabBarLabel, tabBarIcon, tabBarVisible};
};

const TidingsTab = StackNavigator({
    GroupTidings: {
        screen: Tabs,
    },
});

const styles = StyleSheet.create({
    tabBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: SCREEN_WIDTH / 3,
    },
    tabImg: {
        width: 22,
        height: 22,
    },
    tabText: {
        fontSize: 14,
    },
    unreadBox: {
        position: 'absolute',
        top: 0,
        right: px2dp(45),
        alignItems: 'center',
        justifyContent: 'center',
        width: px2dp(15),
        height: px2dp(15),
        borderRadius: px2dp(10),
        overflow: 'hidden',
        backgroundColor: 'red',
    },
    unreadNum: {
        fontSize: FONT_SIZE(12),
        color: '#fff',
        fontWeight: '500',
    },
});
export default TidingsTab;