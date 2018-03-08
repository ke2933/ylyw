import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    TextInput,
    BackHandler,
} from 'react-native';

import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Button from '../../common/Button';
import px2dp from "../../common/Tool";
//按钮

export default class editSuccess extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
    }

    componentWillMount() {
        RouteName.splice(0, RouteName.length);
        RouteName.push(this.props.navigation.state);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }
    }

    render() {
        const {navigate, goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
                {this.state.isLoading ? <Loading/> : null}
                <StatusBar//状态栏
                    animated={true}//是否动画
                    hidden={false}//是否隐藏
                    backgroundColor={'#000'}//android 设置状态栏背景颜色
                    translucent={false}//android 设置状态栏是否为透明
                    showHideTransition="fade"//IOS状态栏改变时动画 fade:默认 slide
                    networkActivityIndicatorVisible={this.state.isLoading}//IOS设定网络活动指示器(就是那个菊花)是否显示在状态栏。
                    statusBarStyle={"default"}//ios:白底黑字  android:黑底白字
                />
                <Nav navigation={this.props.navigation}
                     leftClick={() => {
                         goBack();
                     }}
                     data={{
                         'leftBtn': false,
                         'title': '会诊完成',
                         rightBtn: {type: 'false'}
                     }}
                />
                <View style={styles.content}>
                    <Image source={require('../../images/edit_success.png')} style={styles.editSuccessImg}/>
                    <Text style={styles.title}>会诊意见书提交成功</Text>
                    <Text style={styles.text}>本次会诊顺利结束</Text>
                    <Text style={styles.text}>您的会诊意见对首诊医生及患者非常重要</Text>
                    <View style={{marginTop: px2dp(75),}}>
                        <TouchableOpacity
                            onPress={() => {
                                OrderType = '会诊订单';
                                Status = '正在会诊';
                                RouteName.splice(0, RouteName.length);
                                // RouteName.push(this.props.navigation.state);
                                navigate('TabOrderPage');
                            }}
                            activeOpacity={.8}
                        >
                            <View style={styles.btnBox}>
                                <Text style={styles.btnText}>查看会诊中订单</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                OrderType = '会诊订单';
                                Status = '全部';
                                RouteName.splice(0, RouteName.length);
                                // RouteName.push(this.props.navigation.state);
                                navigate('TabOrderPage');
                            }}
                            activeOpacity={.8}
                        >
                            <View style={styles.btnBox}>
                                <Text style={styles.btnText}>回顾病例</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    editSuccessImg: {
        marginTop: px2dp(89),
    },
    title: {
        fontSize: FONT_SIZE(18),
        color: '#566cb7',
        marginTop: px2dp(40),
        marginBottom: px2dp(6),
    },
    text: {
        width: SCREEN_WIDTH * .73,
        textAlign: 'center',
        fontSize: FONT_SIZE(14),
        lineHeight: px2dp(24),
        color: '#757575',
        marginTop: px2dp(9),
    },
    btnBox: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: px2dp(15),
        width: px2dp(161),
        height: px2dp(38),
        borderRadius: px2dp(19),
        borderColor: Colors.orange,
        borderWidth: Pixel,
    },
    btnText: {
        fontSize: FONT_SIZE(16),
        color: Colors.orange,
    },

});
