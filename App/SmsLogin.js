import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    PixelRatio,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    BackHandler,
    AsyncStorage,
} from 'react-native';

import {requestUrl} from './Network/url';//接口url
import {RegExp} from './Network/RegExp';//正则
// import BackgroundTimer from 'react-native-background-timer';//锁屏倒计时
import CountDownButton from 'react-native-smscode-count-down';
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from './common/Global';
import Loading from './common/Loading';
import Communications from 'react-native-communications';

export default class SmsLogin extends Component {
    static navigationOptions = {
        header: null,
    };
    static defaultProps = {
        codeTime: 60,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            loadingText: '',
            flag: true,//false测试环境
            codeFlag: false,//是否可以发送校验码
            prompt: '',//提示信息
            doctorPhone: '',//手机号
            verificationCode: '',//校验码
            timerCount: 60,
            timerTitle: '发送',
        }
    }

    componentWillMount() {

        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }
    }

    // componentWillUnmount() {
    // BackgroundTimer.clearInterval(this.timer);
    // BackgroundTimer.stopBackgroundTimer();
    // }

    render() {
        const {navigate, goBack} = this.props.navigation;
        return (
            <ScrollView keyboardShouldPersistTaps={'handled'} style={{backgroundColor: '#fff'}}>
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
                <View style={styles.container}>
                    <View style={styles.smsLoginBox}>
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={() => navigate('Register')}
                        >
                            <Text style={styles.goRegisterText}>去注册</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                RouteName.pop();
                                goBack();
                            }}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={styles.smsLoginText}>
                                密码登录
                            </Text>
                            <Image style={styles.smsLoginIcon} source={require('./images/arrow_right.png')}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>医来医往</Text>
                    <View style={styles.textBox}>
                        <Image source={require('./images/phone.png')} style={styles.textIcon}/>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'请输入手机号'}
                            placeholderTextColor={'#c7c7cd'}
                            onChangeText={(text) => this.setState({doctorPhone: text})}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'numeric'}
                            onBlur={this.doctorPhoneReg.bind(this)}
                        >

                        </TextInput>
                    </View>
                    <View style={styles.textBox}>
                        <Image source={require('./images/sms_icon.png')} style={styles.textIcon}/>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'请输入校验码'}
                            placeholderTextColor={'#c7c7cd'}
                            onChangeText={(text) => this.setState({verificationCode: text})}
                            keyboardType={'numeric'}
                            underlineColorAndroid={'transparent'}
                            onBlur={this.codeReg.bind(this)}
                        >
                        </TextInput>
                        <View style={{
                            position: 'absolute',
                            top: px2dp(11),
                            right: px2dp(23),
                            zIndex: 1,
                        }}>
                            <CountDownButton
                                style={{
                                    width: px2dp(80),
                                    height: px2dp(34),
                                    borderRadius: px2dp(7),
                                    backgroundColor: '#566cb7',
                                }}
                                textStyle={{
                                    fontSize: FONT_SIZE(16),
                                    color: '#fffefe',
                                }}
                                disableColor={'#ddd'}
                                timerCount={60}
                                timerTitle={this.state.timerTitle}
                                timerActiveTitle={['', 's']}
                                enable={true}
                                onClick={(shouldStartCounting) => {
                                    if (this.state.doctorPhone === '') {
                                        this.setState({
                                            prompt: '请核对手机号',
                                        });
                                        shouldStartCounting(false);
                                        return;
                                    } else if (!RegExp.Reg_TelNo.test(this.state.doctorPhone)) {
                                        this.setState({
                                            prompt: '请核对手机号'
                                        });
                                        shouldStartCounting(false);
                                        return;
                                    } else {
                                        this.getSmsCode();
                                        shouldStartCounting(true);
                                    }
                                }}
                                timerEnd={() => {
                                    this.setState({
                                        timerTitle: '重新发送',
                                    })
                                }}/>
                        </View>
                        {/*<TouchableOpacity*/}
                        {/*onPress={*/}
                        {/*this.getSmsCode.bind(this)*/}
                        {/*}*/}
                        {/*activeOpacity={.8}*/}
                        {/*style={styles.getCodeBox}*/}
                        {/*>*/}
                        {/*<View style={styles.codeBtn}>*/}

                        {/*<Text style={styles.codeBtnText}>*/}
                        {/*{this.state.codeFlag ? this.state.timerTitle : this.state.timerCount + '秒'}*/}
                        {/*</Text>*/}

                        {/*</View>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                    <View style={styles.forgotPasswordBox}>
                        <View style={styles.promptBox}>
                            <Text style={styles.promptTextRed}>
                                {this.state.prompt}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => this.login()}
                        style={{alignItems: 'center',}}
                    >
                        <View style={styles.loginBtn}>
                            <Text style={styles.loginText}>登录</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.serviceBox}>
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={() => {
                                Alert.alert('拨打电话', '400-100-100', [
                                    {
                                        text: '取消', onPress: () => {
                                        }
                                    },
                                    {
                                        text: '确认', onPress: () => {
                                            Communications.phonecall('010 6378 6220', true);
                                        }
                                    },
                                ])
                            }}
                        >
                            <Text style={styles.serviceText}>联系客服</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <Toast
                    ref='smsCode'
                    style={{backgroundColor: '#333333', borderRadius: 10,}}
                    position={'center'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeInDuration={800}
                    opacity={.8}
                />
            </ScrollView>
        );

    }


    doctorPhoneReg() {
        if (this.state.doctorPhone === '') {
            this.setState({
                prompt: '请核对手机号',
            });
            return;
        }
        if (!RegExp.Reg_TelNo.test(this.state.doctorPhone)) {
            this.setState({
                prompt: '请核对手机号'
            });
        } else {
            this.setState({
                prompt: ''
            });
        }
    }

    // 校验码验证
    codeReg() {
        Keyboard.dismiss();
        if (this.state.verificationCode === '') {
            this.setState({
                prompt: '请核对校验码',
            });
            return;
        }
        if (!RegExp.Reg_Number.test(this.state.verificationCode)) {
            this.setState({
                prompt: '请核对校验码'
            });
            return;
        }
    }

    //获取校验码
    getSmsCode() {


        // this.setState({
        //     codeFlag: true,
        // });

        // if (this.state.codeFlag) {
        //     // this.timer = BackgroundTimer.setInterval(() => {
        //
        //     BackgroundTimer.runBackgroundTimer(() => {
        //         this.setState({codeFlag: false});
        //         let timer = this.state.timerCount - 1;
        //         if (timer <= 0) {
        //             // this.timer && BackgroundTimer.clearInterval(this.timer);
        //             BackgroundTimer.stopBackgroundTimer();
        //             this.setState({
        //                 timerCount: this.props.codeTime,
        //                 timerTitle: '重新发送',
        //                 codeFlag: true,
        //             })
        //         } else {
        //             this.setState({
        //                 timerCount: timer,
        //             })
        //         }
        //     }, 1000);
        let formData = new FormData();
        formData.append("phone", this.state.doctorPhone);
        fetch(requestUrl.loginSend, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status === '0') {
                    this.refs.smsCode.show('校验码发送成功');
                } else if (responseData.status === '1') {
                    this.setState({
                        prompt: '发送失败，请稍后重试',
                    })
                } else if (responseData.status === '2') {
                    this.setState({
                        prompt: '请核对手机号',
                    })
                } else if (responseData.status === '3') {
                    this.setState({
                        prompt: '请核对手机号',
                    })
                } else if (responseData.status === '4') {
                    this.setState({
                        prompt: '该手机号还未注册，请先去注册',
                        timerTitle: '重新发送',
                        codeFlag: true,
                        timerCount: this.props.codeTime,
                    });
                    // BackgroundTimer.clearInterval(this.timer);
                    // BackgroundTimer.stopBackgroundTimer();
                } else if (responseData.status === '5') {
                    this.setState({
                        prompt: '校验码已发送',
                    })
                } else {
                    this.setState({
                        prompt: '发送失败，请重试',
                    })
                }
                console.log('responseData', responseData);
            })
            .catch(
                (error) => {
                    this.setState({
                        prompt: '发送失败，请稍后重试',
                    })
                });
        // }

        // }

    }

    //校验码登录事件
    login() {
        if (this.state.flag) {
            if (this.state.doctorPhone === '') {
                this.setState({
                    prompt: '请核对手机号',
                });
                return;
            }
            if (!RegExp.Reg_TelNo.test(this.state.doctorPhone)) {
                this.setState({
                    prompt: '请核对手机号'
                });
                return;
            }
            if (this.state.verificationCode === '') {
                this.setState({
                    prompt: '请核对校验码',
                });
                return;
            }
            if (!RegExp.Reg_Number.test(this.state.verificationCode)) {
                this.setState({
                    prompt: '请核对校验码'
                });
            } else {
                Keyboard.dismiss();
                let formData = new FormData();
                formData.append("doctorPhone", this.state.doctorPhone);
                formData.append("verificationCode", this.state.verificationCode);
                fetch(requestUrl.smsLogin, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((responseData) => {
                        console.log(responseData);
                        if (responseData.status === '0') {
                            this.setState({loadingText: '登录成功，正在跳转...'});
                            AsyncStorage.removeItem('UserPhone');
                            // 保存登录手机号
                            AsyncStorage.setItem('UserPhone', JSON.stringify(this.state.doctorPhone)).then(() => {
                                console.log('成功');
                            }).catch((error) => {
                                console.log('失败');
                            });
                            setTimeout(() => {
                                this.setState({isLoading: false,});
                                this.props.navigation.navigate('Home');
                            }, 1000);
                        } else if (responseData.status === '1') {
                            this.setState({
                                isLoading: false,
                                prompt: '登录失败，请稍后重试',
                            })
                        } else if (responseData.status === '4') {
                            this.setState({
                                isLoading: false,
                                prompt: '改手机号还未注册',
                            })
                        } else {
                            this.setState({
                                isLoading: false,
                                prompt: '请核对手机号',
                            })
                        }
                    })
                    .catch(
                        (error) => {
                            this.setState({isLoading: false,});
                            console.log('error', error);
                        });
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: IOS ? SCREEN_HEIGHT : SCREEN_HEIGHT - StatusBarHeight,

    },
    //短信登录
    smsLoginBox: {
        marginTop: IOS ? IPhoneX ? 54 : 30 : 10,
        marginRight: 23,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    goRegisterText: {
        paddingLeft: 20,
        fontSize: 15,
        color: '#566cb7',
    },
    smsLoginText: {
        fontSize: 15,
        color: '#566cb7',
        marginRight: 5,
    },
    //title
    title: {
        marginTop: 50,
        fontSize: 22,
        color: '#566cb7',
        textAlign: 'center',
        marginBottom: 10,
    },
    //输入模块
    textBox: {
        flexDirection: 'row',
        alignItems: 'center',
        width: SCREEN_WIDTH * .9,
        marginLeft: SCREEN_WIDTH * 0.05,
        height: 56,
        marginTop: 3,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#d6e1e8',
    },
    textInput: {
        height: 56,
        flex: 1,
        fontSize: 17,
    },
    textIcon: {
        marginRight: 18,
        marginLeft: 18,
    },
    forgotPasswordBox: {
        width: SCREEN_WIDTH * .9,
        marginLeft: SCREEN_WIDTH * .05,
        marginTop: 23,
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    promptBox: {
        flexDirection: 'row',
        marginLeft: 18,
    },
    promptTextGray: {
        color: '#898989',
        fontSize: 14,
    },
    promptTextRed: {
        color: '#ff4c4c',
        fontSize: 14,
    },
    //校验码按钮
    getCodeBox: {
        position: 'absolute',
        top: 11,
        right: 23,
    },
    codeBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 34,
        borderRadius: 7,
        backgroundColor: '#566cb7',
    },
    codeBtnText: {
        fontSize: 16,
        color: '#fffefe',
    },
    //登录按钮
    loginBtn: {
        width: 246,
        height: 46,
        marginTop: 30,
        backgroundColor: '#6178c5',
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',

    },
    loginText: {
        fontSize: 18,
        color: '#fffefe',
        textAlign: 'justify',
    },
    // 客服
    serviceBox: {
        position: 'absolute',
        bottom: IPhoneX ? 67 : 33,
        left: 0,
    },
    serviceText: {
        width: SCREEN_WIDTH,
        textAlign: 'center',
        fontSize: 15,
        color: '#898989',

    },

});
