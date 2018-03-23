import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    Image,
    Dimensions,
    Platform,
    PixelRatio,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    BackHandler,
    AsyncStorage,
    Keyboard,
} from 'react-native';

let {width, height} = Dimensions.get('window');
import {requestUrl} from './Network/url';//接口url
import {RegExp} from './Network/RegExp';//正则
// import BackgroundTimer from 'react-native-background-timer';
import CountDownButton from 'react-native-smscode-count-down';

import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import Loading from './common/Loading';
import {Global} from './common/Global';

export default class Register extends Component {
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
            prompt: '',//提示信息
            doctorPhone: '',//帐号
            password: '',//密码
            doctorPassword: '',//密码
            verificationCode: '',//校验码
            codeFlag: false,//是否可以发送校验码
            timerCount: 60,
            timerTitle: '发送',

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

    // componentWillUnmount() {
    //     // BackgroundTimer.clearInterval(this.timer);
    //     BackgroundTimer.stopBackgroundTimer();
    // }

    render() {
        const {navigate} = this.props.navigation;
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
                    <View style={styles.goBack}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                RouteName.pop();
                                this.props.navigation.goBack();
                            }}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                            }}
                        >
                            <Image style={styles.smsLoginIcon} source={require('./images/arrow_left.png')}/>
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
                            underlineColorAndroid={'transparent'}
                            onBlur={this.codeReg.bind(this)}
                            keyboardType={'numeric'}
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
                                            prompt: '请输入手机号',
                                        });
                                        shouldStartCounting(false);
                                        return;
                                    } else if (!RegExp.Reg_TelNo.test(this.state.doctorPhone)) {
                                        this.setState({
                                            prompt: '请核对手机号'
                                        });
                                        shouldStartCounting(false);
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
                    </View>
                    <View style={styles.textBox}>
                        <Image source={require('./images/lock.png')} style={styles.textIcon}/>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'请输入密码'}
                            placeholderTextColor={'#c7c7cd'}
                            onChangeText={(text) => this.setState({password: text})}
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={true}
                            onBlur={this.passwordReg.bind(this)}

                        >

                        </TextInput>
                    </View>
                    <View style={styles.textBox}>
                        <Image source={require('./images/unlock.png')} style={styles.textIcon}/>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'请再次输入密码'}
                            placeholderTextColor={'#c7c7cd'}
                            onChangeText={(text) => this.setState({doctorPassword: text})}
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={true}
                            onBlur={this.doctorPasswordReg.bind(this)}
                        >

                        </TextInput>
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
                        onPress={() => this.register()}
                        style={{alignItems: 'center',}}
                    >
                        <View style={styles.loginBtn}>
                            <Text style={styles.loginText}>注册</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.goRegisterBox}>
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Text style={styles.goRegisterText}>已有账户，直接登录</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <Toast
                    ref='smsCode'
                    style={{backgroundColor: '#333333', borderRadius: 10,}}
                    position={'center'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeInDuration={2000}
                    opacity={.8}
                />
            </ScrollView>
        );
    }

    //验证手机号
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

    //校验码
    codeReg() {
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
            this.setState({
                prompt: ''
            });
        }
    }

    //验证密码
    passwordReg() {
        if (this.state.password === '') {
            this.setState({
                prompt: '请输入密码',
            });
            return;
        }
        if (!RegExp.Reg_PassWord.test(this.state.password)) {
            this.setState({
                prompt: '请输入8~16个字母、数字或下划线，区分大小写'
            });
        } else {
            this.setState({
                prompt: ''
            });
        }
    }

    //确认密码
    doctorPasswordReg() {
        if (this.state.doctorPassword === '') {
            this.setState({
                prompt: '请输入密码',
            });
            return;
        }
        if (!RegExp.Reg_PassWord.test(this.state.doctorPassword)) {
            this.setState({
                prompt: '请输入8~16个字母、数字或下划线，区分大小写'
            });
            return;
        }
        if (this.state.password !== this.state.doctorPassword) {
            this.setState({
                prompt: '两次密码不一致'
            });
        } else {
            this.setState({
                prompt: ''
            });
        }
    }

    //获取校验码
    getSmsCode() {
        // if (this.state.doctorPhone === '') {
        //     this.setState({
        //         prompt: '请输入手机号',
        //     });
        //     return;
        // }
        // if (!RegExp.Reg_TelNo.test(this.state.doctorPhone)) {
        //     this.setState({
        //         prompt: '请核对手机号'
        //     });
        // } else {
        //     this.setState({
        //         codeFlag: true,
        //         prompt: '',
        //     });
        // if (this.state.codeFlag) {
        //     // this.timer = BackgroundTimer.setInterval(() => {
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
        fetch(requestUrl.registerSend, {
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
                    this.refs.smsCode.show('校验码发送成功');
                } else if (responseData.status === '1') {
                    this.setState({
                        prompt: '发送失败，请稍后重试',
                    })
                } else if (responseData.status === '2') {
                    this.setState({
                        prompt: '请输入手机号',
                    })
                } else if (responseData.status === '3') {
                    this.setState({
                        prompt: '请核对手机号',
                    })
                } else if (responseData.status === '4') {
                    this.setState({
                        prompt: '该手机号已存在，请查证后重试',
                        timerTitle: '重新发送',
                        codeFlag: true,
                        timerCount: this.props.codeTime,
                    });
                    // BackgroundTimer.clearInterval(this.timer);
                    // BackgroundTimer.stopBackgroundTimer();
                } else if (responseData.status === '5') {
                    this.setState({
                        prompt: '校验码已发送，请勿重复发送，',
                    })
                } else {
                    this.setState({
                        prompt: '发送失败，请重试',
                    })
                }

            })
            .catch(
                (error) => {
                    this.setState({
                        prompt: '发送失败，请稍后重试',
                    });
                    console.log('error', error);
                });
        // }

        // }
    }

    //注册事件
    register() {
        if (this.state.flag) {
            // // 手机号
            if (this.state.doctorPhone === '') {
                this.setState({
                    prompt: '请输入手机号',
                });
                return;
            }
            // //手机号格式
            if (!RegExp.Reg_TelNo.test(this.state.doctorPhone)) {
                this.setState({
                    prompt: '请核对手机号'
                });
                return;
            }
            // 校验码
            if (!RegExp.Reg_Number.test(this.state.verificationCode)) {
                this.setState({
                    prompt: '请核对校验码'
                });
                return;
            }
            //设置密码
            if (this.state.doctorPassword === '') {
                this.setState({
                    prompt: '请输入密码',
                });
                return;
            }
            if (!RegExp.Reg_PassWord.test(this.state.password)) {
                this.setState({
                    prompt: '请输入8~16个字母、数字或下划线，区分大小写'
                });
                return;
            }
            // 确认密码
            if (this.state.doctorPassword === '') {
                this.setState({
                    prompt: '请确认密码',
                });
                return;
            }

            if (!RegExp.Reg_PassWord.test(this.state.doctorPassword)) {
                this.setState({
                    prompt: '请输入8~16个字母、数字或下划线，区分大小写'
                });
                return;
            }
            if (this.state.password !== this.state.doctorPassword) {
                this.setState({
                    prompt: '两次密码不一致'
                });
            } else {
                Keyboard.dismiss();
                this.setState({isLoading: true});
                let formData = new FormData();
                formData.append("doctorPhone", this.state.doctorPhone);
                formData.append("doctorPassword", this.state.doctorPassword);
                formData.append("verificationCode", this.state.verificationCode);
                fetch(requestUrl.register, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((responseData) => {
                        if (responseData.status === '0') {
                            this.setState({loadingText: '注册成功'});
                            setTimeout(() => {
                                this.setState({
                                    loadingText: '登录中...',
                                });
                                let formData = new FormData();
                                formData.append("doctorPhone", this.state.doctorPhone);
                                formData.append("doctorPassword", this.state.doctorPassword);
                                fetch(requestUrl.login, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                    body: formData,
                                })
                                    .then((response) => response.json())
                                    .then((responseData) => {
                                        if (responseData.status === '0') {
                                            this.setState({loadingText: '登录成功，正在跳转...'});
                                            AsyncStorage.removeItem('UserPhone');
                                            // 保存登录手机号
                                            AsyncStorage.setItem('UserPhone', JSON.stringify(this.state.doctorPhone)).then(() => {
                                                console.log('成功');
                                            }).catch((error) => {
                                                console.log('失败');
                                            });
                                            RouteName.splice(0, RouteName.length);
                                            setTimeout(() => {
                                                this.setState({isLoading: false,});
                                                this.props.navigation.navigate('Home');
                                            }, 1000)
                                        } else {
                                            RouteName.splice(0, RouteName.length);
                                            this.props.navigation.navigate('Login');
                                        }
                                    })
                                    .catch(
                                        (error) => {
                                            console.log(error);
                                            this.setState({isLoading: false});
                                        });
                            }, 1000);

                            // this.refs.smsCode.show('注册成功');
                            // this.props.navigation.navigate('Home');
                        } else if (responseData.status === '1') {
                            this.setState({
                                isLoading: false,
                                prompt: '请核对信息',
                            })
                        } else if (responseData.status === '2') {
                            this.setState({
                                isLoading: false,
                                prompt: '请核对校验码',
                            })
                        } else if (responseData.status === '3') {
                            this.setState({
                                isLoading: false,
                                prompt: '注册失败，请稍后重试',
                            })
                        } else {
                            this.setState({
                                isLoading: false,
                                prompt: '注册失败，请重试',
                            })
                        }
                        console.log(responseData)

                    })
                    .catch(
                        (error) => {
                            this.setState({
                                isLoading: false,
                                prompt: '注册失败，请稍后重试',
                            });
                            console.log('error', error);
                        });
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: IOS ? height : height - StatusBar.currentHeight,

    },
    //短信登录
    goBack: {
        marginTop: IOS ? IPhoneX ? 54 : 30 : 10,
        marginLeft: 20,
    },
    smsLoginText: {
        fontSize: 15,
        color: '#566cb7',
        marginRight: 5,
    },
    smsLoginIcon: {
        width: 10,
        height: 19,
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
        width: width * .9,
        marginLeft: width * 0.05,
        height: 56,
        marginTop: 3,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#d6e1e8',
    },
    textInput: {
        height: 56,
        flex: 1,
        fontSize: 17,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
    },
    textIcon: {
        marginRight: 18,
        marginLeft: 18,
    },
    forgotPasswordBox: {
        width: width * .9,
        marginLeft: width * .05,
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
    //忘记密码
    forgotPasswordText: {
        fontSize: 15,
        color: '#898989',
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
        width: 200,
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
    },
    //去注册
    goRegisterBox: {
        position: 'absolute',
        bottom: IPhoneX ? 67 : 33,
        left: 0,
    },
    goRegisterText: {
        width: width,
        textAlign: 'center',
        fontSize: 15,
        color: '#898989',

    },

});
