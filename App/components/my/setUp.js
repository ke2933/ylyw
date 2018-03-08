import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    BackHandler,
    AsyncStorage,
} from 'react-native';

import Nav from '../../common/Nav';//导航
import {requestUrl} from "../../Network/url";
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';

export default class SetUp extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            isLoading: false,
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
            this.setState({
                userName: this.props.navigation.state.params.userName,
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
                         'title': '设置',
                         'rightBtn': {type: 'false'}
                     }}/>
                <TouchableOpacity
                    onPress={() => {
                    }}
                    activeOpacity={.8}
                >
                    <View style={[styles.content, {marginTop: 10,}]}>
                        <Text style={styles.contentText}>当前帐号</Text>
                        <Text style={styles.userNameText}>{this.state.userName}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        navigate('RevisePassword', {data: this.state})
                    }}
                    activeOpacity={.8}
                >
                    <View style={[styles.content, {marginTop: 1,}]}>
                        <Text style={styles.contentText}>修改密码</Text>
                        <Image source={require('../../images/arrow_gray_right.png')} style={styles.contentImg}/>
                    </View>
                </TouchableOpacity>
                {/*<TouchableOpacity*/}
                {/*onPress={() => {*/}
                {/*}}*/}
                {/*activeOpacity={.8}*/}
                {/*>*/}
                {/*<View style={[styles.content, {marginTop: 1,}]}>*/}
                {/*<Text style={styles.contentText}>调整字号</Text>*/}
                {/*<Image source={require('../../images/arrow_gray_right.png')} style={styles.contentImg}/>*/}
                {/*</View>*/}
                {/*</TouchableOpacity>*/}
                <TouchableOpacity
                    onPress={() => {
                        if (IOS) {
                            navigate('FeedBackIOS')
                        } else {
                            navigate('FeedBack')
                        }

                    }}
                    activeOpacity={.8}
                >
                    <View style={[styles.content, {marginTop: 10,}]}>
                        <Text style={styles.contentText}>意见反馈</Text>
                        <Image source={require('../../images/arrow_gray_right.png')} style={styles.contentImg}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        navigate('About')
                    }}
                    activeOpacity={.8}
                >
                    <View style={[styles.content, {marginTop: 1,}]}>
                        <Text style={styles.contentText}>关于</Text>
                        <Image source={require('../../images/arrow_gray_right.png')} style={styles.contentImg}/>
                    </View>
                </TouchableOpacity>
                {/*<TouchableOpacity*/}
                {/*onPress={() => {*/}
                {/*}}*/}
                {/*activeOpacity={.8}*/}
                {/*>*/}
                {/*<View style={[styles.content, {marginTop: 10,}]}>*/}
                {/*<Text style={styles.contentText}>清理缓存</Text>*/}
                {/*<Image source={require('../../images/arrow_gray_right.png')} style={styles.contentImg}/>*/}
                {/*</View>*/}
                {/*</TouchableOpacity>*/}
                <TouchableOpacity
                    activeOpacity={.8}
                    onPress={() => {
                        Alert.alert('', '退出登录？', [
                            {
                                text: '取消', onPress: () => {
                                }
                            },
                            {text: '确认', onPress: this.loginOut.bind(this)},
                        ])
                    }}
                    style={{position: 'absolute', left: 0, bottom: 0}}
                >
                    <View style={styles.loginOutBox}>
                        <Text style={styles.loginOutText}>退出登录</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    loginOut() {

// 退出登陆
        this.setState({isLoading: true,});
        fetch(requestUrl.logout)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({isLoading: false,});
                if (responseData.status === '0') {
                    AsyncStorage.removeItem('UserPhone').then(() => {
                        console.log('成功');
                    }).catch((error) => {
                        console.log('失败');
                    });
                    RouteName.splice(0, RouteName.length);
                    this.props.navigation.navigate('Login');
                    WS.flag = false;
                    WS.ws.close();
                }

            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                    console.log('error', error);
                });
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#efefef',
        flex: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        backgroundColor: '#fff',
        paddingLeft: 20,
    },
    contentText: {
        fontSize: 16,
        color: '#333333',
    },
    contentImg: {
        position: 'absolute',
        right: 26,
        top: 19,
    },
    loginOutBox: {
        width: SCREEN_WIDTH,
        height: 50,
        backgroundColor: '#566cb7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginOutText: {
        fontSize: 16,
        color: '#fff',
    },
    userNameText: {
        fontSize: 16,
        color: '#b3b2b2',
        marginRight: 26,
    },
});
