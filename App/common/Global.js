import React, {Component} from 'react';
import {
    Dimensions,
    PixelRatio,
    Platform,
    Alert,
    StatusBar,
    ToastAndroid,
    BackHandler,
    DeviceEventEmitter,
} from 'react-native';
import FontSize from './TextSize';
import Colors from './Colors';
import Px2dp from './Tool';

let {height, width} = Dimensions.get('window');
let WS = {};
WS.ws = {};
WS.fn = function (url) {
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
        global.WS.flag = true;
        console.log('链接')
    };
};
let User = {};
let Obj = {};
Obj.this = {};
Obj.fn = function (obj) {
    this.this = obj;
};
// 系统是iOS
global.IOS = (Platform.OS === 'ios');
// 系统是安卓
global.Android = (Platform.OS === 'android');
// 获取屏幕宽度
global.SCREEN_WIDTH = width;
// 获取屏幕高度
global.SCREEN_HEIGHT = height;
// 获取屏幕分辨率
global.PixelRatio = PixelRatio.get();
// 最小线宽
global.Pixel = 1 / PixelRatio.get();
// 常用颜色
global.Colors = Colors;
// 适配字体
global.FONT_SIZE = FontSize;
// 屏幕适配
global.px2dp = Px2dp;
// 弹出框
global.Alert = Alert;
// 安卓状态栏高度
global.StatusBarHeight = StatusBar.currentHeight;
// 聊天链接
global.WS = WS;
// 费用列表
global.FeeArr = [{'fee': '0.1', 'id': '0.1'}, {'fee': '100', 'id': '100'}, {'fee': '300', 'id': '300'}, {
    'fee': '500',
    'id': '500'
}, {
    'fee': '800',
    'id': '800'
}, {'fee': '1000', 'id': '1000'}, {'fee': '1500', 'id': '1500'}, {'fee': '2500', 'id': '2500'}, {
    'fee': '5000',
    'id': '5000'
},];
global.FeeNullArr = [{'fee': '0.1', 'id': '0.1'}, {'fee': '全部', 'id': ''}, {'fee': '100', 'id': '100'}, {
    'fee': '300',
    'id': '300'
}, {
    'fee': '500',
    'id': '500'
}, {'fee': '800', 'id': '800'}, {'fee': '1000', 'id': '1000'}, {'fee': '1500', 'id': '1500'}, {
    'fee': '2500',
    'id': '2500'
}, {'fee': '5000', 'id': '5000'},];
// 登录医生信息
global.UserInfo = User;
// 默认头像
global.UserImg = "http://120.78.76.72/static/sample/user.png";
// this
global.Obj = Obj;

global.Key = '';
global.RouteName = [];

global.GroupNum = 0;
global.OrderNum = 0;
global.SystemNum = 0;

global.OrderType = '';
global.Status = '';
// 监听返回键－事件具体操作
global.backAndroid = () => {
    console.log(RouteName);
    if (RouteName.length > 0) {
        let temp = RouteName.pop();
        // 发起会诊页处理
        if (temp.routeName === 'Launch') {
            Alert.alert('', '会诊病历还未填完', [
                {
                    text: '放弃填写', onPress: () => {
                        Obj.this.props.navigation.goBack(temp.key);
                    }
                },
                {
                    text: '继续填写', onPress: () => {
                        RouteName.push(temp);
                    }
                },
            ], {cancelable: false});
            return true;
        } else if (temp.routeName === 'TabMyPage' || temp.routeName === 'TabOrderPage') {
            Obj.this.props.navigation.goBack(temp.key);
        } else {
            Obj.this.props.navigation.goBack(temp.key);
        }
        return true;
    } else {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            // if (WS.flag) {
            //     WS.ws.close();
            // }
            //最近2秒内按过back键，可以退出应用。
            BackHandler.exitApp();
            return false;
        } else {
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用', 2000);
            return true;
        }
    }
};
