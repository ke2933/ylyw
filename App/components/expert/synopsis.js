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
    ScrollView,
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

export default class synopsis extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            departmentDetail: '',
        }
    }

    componentWillMount() {
       NetWork ? null : Alert.alert('网络似乎断掉了'), this.setState({isLoading: false});RouteName.push(this.props.navigation.state);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }

        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params.data;
            this.setState({
                departmentDetail: data,
            })
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
                         RouteName.pop();
                         goBack();
                     }}
                     data={{
                         'leftBtn': true,
                         'title': '科室简介',
                         rightBtn: {type: 'false'}
                     }}
                />
                <ScrollView>
                    <View style={styles.textBox}>
                        <Text
                            style={styles.text}>{this.state.departmentDetail}</Text>
                    </View>
                    {IPhoneX ? <View style={{height: 34,}}></View> : null}
                </ScrollView>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textBox: {
        paddingTop: px2dp(20),
        paddingBottom: px2dp(10),
        alignItems: 'center',
    },
    text: {
        width: SCREEN_WIDTH * .92,
        fontSize: FONT_SIZE(15),
        color: '#212121',
        lineHeight: px2dp(23),
    },
});
