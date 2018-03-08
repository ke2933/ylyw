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
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
//按钮

export default class payPass extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            loadingText: '',
            payPass: '',
            password: '',
            oldCheck: false,
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
    }

    render() {
        const {navigate, goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
                {this.state.isLoading ? <Loading text={this.state.loadingText}/> : null}
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
                         'title': '修改支付密码',
                         rightBtn: {type: 'false'}
                     }}
                />
                <ScrollView
                    style={{flex: 1}}
                >


                    <View style={styles.content}>
                        <Text style={styles.payPassTitle}>{this.remindText()}</Text>
                        <View style={styles.payPassContent}>
                            <TextInput
                                style={styles.payPass}
                                placeholderTextColor={'#c7c7cd'}
                                defaultValue={this.state.payPass.substr(0, 1)}
                                underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                maxLength={1}
                                caretHidden={true}
                            >
                            </TextInput>
                            <TextInput
                                style={styles.payPass}
                                placeholderTextColor={'#c7c7cd'}
                                defaultValue={this.state.payPass.substr(1, 1)}
                                underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                maxLength={1}
                                caretHidden={true}
                            >
                            </TextInput>
                            <TextInput
                                style={styles.payPass}
                                placeholderTextColor={'#c7c7cd'}
                                defaultValue={this.state.payPass.substr(2, 1)}
                                underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                maxLength={1}
                                caretHidden={true}
                            >
                            </TextInput>
                            <TextInput
                                style={styles.payPass}
                                placeholderTextColor={'#c7c7cd'}
                                defaultValue={this.state.payPass.substr(3, 1)}
                                underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                maxLength={1}
                                caretHidden={true}
                            >
                            </TextInput>
                            <TextInput
                                style={styles.payPass}
                                placeholderTextColor={'#c7c7cd'}
                                defaultValue={this.state.payPass.substr(4, 1)}
                                underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                maxLength={1}
                                caretHidden={true}
                            >
                            </TextInput>
                            <TextInput
                                style={styles.payPass}
                                placeholderTextColor={'#c7c7cd'}
                                defaultValue={this.state.payPass.substr(5, 1)}
                                underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                maxLength={1}
                                caretHidden={true}
                            >
                            </TextInput>
                            <TextInput
                                style={styles.payTextInput}
                                placeholderTextColor={'#c7c7cd'}
                                onChangeText={(text) => {
                                    this.setState({
                                        payPass: text,
                                    })
                                }}
                                autoFocus={true}
                                defaultValue={this.state.payPass}
                                underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                maxLength={6}
                                caretHidden={true}
                                keyboardType={'numeric'}
                            >
                            </TextInput>
                        </View>
                        <View style={styles.payBtn}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (this.state.payPass.length >= 6) {
                                        if (this.state.oldCheck) {
                                            if (this.state.password === '') {
                                                this.setState({
                                                    password: this.state.payPass,
                                                    payPass: '',
                                                })
                                            } else {
                                                if (this.state.payPass === this.state.password) {
                                                    this.setPassword(this.state.password);
                                                } else {
                                                    this.refs.toast.show('两次密码不一致，请重新设置');
                                                    this.setState({
                                                        payPass: '',
                                                        password: '',
                                                    })
                                                }
                                            }
                                        } else {
                                            this.checkPaymentPassword(this.state.payPass);
                                        }
                                    }
                                }}
                                activeOpacity={.8}
                            >
                                <View
                                    style={[styles.payPassBox, this.state.payPass.length >= 6 ? styles.payPassBoxYes : styles.payPassBoxNo]}>
                                    <Text
                                        style={[styles.payPassText, this.state.payPass.length >= 6 ? styles.payPassTextYes : styles.payPassTextNo]}>确定</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <Toast
                    ref='toast'
                    style={{backgroundColor: '#333333', borderRadius: 10,}}
                    position={'top'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeInDuration={100}
                    fadeOutDuration={800}
                    opacity={.8}
                />
            </View>
        );
    }

    // 提示文字

    remindText() {
        if (!this.state.oldCheck) {
            return ('请先输入旧支付密码')
        } else if (this.state.password === '') {
            return ('请输入新支付密码')
        } else {
            return ('请再次输入新支付密码')
        }
    }

// 设置支付密码
    setPassword(password) {
        this.setState({
            isLoading: true,
            loadingText: '密码设置中...'
        });
        let formData = new FormData();
        formData.append("password", password);
        console.log(formData);
        fetch(requestUrl.setPassword, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '10') {
                    this.props.navigation.navigate('Login');
                } else if (responseData.status === '0') {
                    this.setState({loadingText: '密码设置成功'});
                    setTimeout(() => {
                        this.props.navigation.goBack();
                        this.setState({
                            isLoading: false,
                        });
                    }, 1000);
                } else if (responseData.status === '4') {
                    this.setState({isLoading: false,});
                    this.refs.toast.show('新密码与旧密码相同');
                } else {
                    this.setState({
                        isLoading: false,
                        payPass: '',
                        password: '',
                    });
                    this.refs.toast.show('密码设置失败，请重试');
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                    console.log('error', error);
                });
    }

    // 旧密码校验
    checkPaymentPassword(password) {
        this.setState({
            isLoading: true,
            loadingText: '密码验证中...'
        });
        fetch(requestUrl.checkPaymentPassword + '?password=' + password)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '10') {
                    this.props.navigation.navigate('Login');
                } else if (responseData.status === '0') {
                    this.setState({loadingText: '验证通过，请输入新密码'});
                    setTimeout(() => {
                        this.setState({
                            isLoading: false,
                            oldCheck: true,
                            payPass: '',
                        });
                    }, 1000);
                } else {
                    this.setState({
                        isLoading: false,
                        oldCheck: false,
                        payPass: '',
                    });
                    this.refs.toast.show('密码错误，请重试');
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
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    content: {
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
    },
    payPassTitle: {
        marginTop: px2dp(47),
        marginBottom: px2dp(15),
        fontSize: FONT_SIZE(14),
        color: '#212121',
    },
    payPassContent: {
        flexDirection: 'row',
        height: px2dp(55),
        borderWidth: Pixel,
        borderColor: '#dbdbdb',
        borderRadius: px2dp(5),
    },
    payTextInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: px2dp(55),
        width: SCREEN_WIDTH - px2dp(30),
        backgroundColor: 'transparent',
        color: 'transparent',
    },
    payPass: {
        flex: 1,
        borderRightWidth: Pixel,
        borderRightColor: '#dbdbdb',
        textAlign: 'center',
        fontSize: FONT_SIZE(20),
    },
    // 确定按钮
    payBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: px2dp(100),
    },
    payPassBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(200),
        height: px2dp(40),
        borderRadius: px2dp(5),
    },
    payPassBoxYes: {
        backgroundColor: '#566cb7',
    },
    payPassBoxNo: {
        borderWidth: Pixel,
        borderColor: '#c1cfff',
    },
    payPassText: {
        fontSize: FONT_SIZE(16),
    },
    payPassTextNo: {
        color: '#c1cfff',
    },
    payPassTextYes: {
        color: '#fff',
    },

});
