import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TextInput,
    TouchableOpacity,
    BackHandler,
    Keyboard,
} from 'react-native';

import {requestUrl} from './Network/url';//接口url
import {RegExp} from './Network/RegExp';//正则
import Nav from './common/Nav';//导航
import Button from './common/Button';//按钮
// import BackgroundTimer from 'react-native-background-timer';
import CountDownButton from 'react-native-smscode-count-down';
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from './common/Global';
import Loading from './common/Loading';

export default class revisePassword extends Component {
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
            doctorPhone: '',//手机号
            doctorPassword: '',//密码
            verificationCode: '',//校验码

            password: '',//验证2次密码是否一致
            prompt: '',//错误信息提示
            codeFlag: false,//是否可以发送校验码
            timerCount: 60,
            timerTitle: '发送',
        };
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
    //     BackgroundTimer.clearInterval(this.timer);
    // }

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
                         goBack()
                     }}
                     data={{
                         'leftBtn': true,
                         'title': '找回密码',
                         'rightBtn': {type: 'false'}
                     }}/>
                <View style={styles.content}>
                    <View style={styles.textInputBox}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'请输入手机号'}
                            placeholderTextColor={'#c7c7cd'}
                            onChangeText={(text) => this.setState({doctorPhone: text})}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'numeric'}
                            onBlur={this.doctorPhoneReg.bind(this)}
                        />
                    </View>
                    <View style={styles.textInputBox}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'请输入校验码'}
                            placeholderTextColor={'#c7c7cd'}
                            onChangeText={(text) => this.setState({verificationCode: text})}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'numeric'}
                            onBlur={this.codeReg.bind(this)}
                        />
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
                                    }
                                    if (!RegExp.Reg_TelNo.test(this.state.doctorPhone)) {
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
                    <View style={styles.textInputBox}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'请输入新密码'}
                            placeholderTextColor={'#c7c7cd'}
                            onChangeText={(text) => this.setState({password: text})}
                            secureTextEntry={true}
                            underlineColorAndroid={'transparent'}
                            onBlur={this.passwordReg.bind(this)}
                        />
                    </View>
                    <View style={styles.textInputBox}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'请确认新密码'}
                            secureTextEntry={true}
                            placeholderTextColor={'#c7c7cd'}
                            onChangeText={(text) => this.setState({doctorPassword: text})}
                            underlineColorAndroid={'transparent'}
                            onBlur={this.doctorPasswordReg.bind(this)}
                        />
                    </View>
                    <Text style={styles.promptText}>{this.state.prompt}</Text>
                    <Button text={'确定'} click={this.submit.bind(this)}/>
                    <Toast
                        ref='toast'
                        style={{backgroundColor: '#333333', borderRadius: 10,}}
                        position={'top'}
                        textStyle={{color: '#ffffff', fontSize: 16,}}
                        fadeInDuration={1000}
                        opacity={.8}
                    />
                </View>
            </View>
        );
    }

    // 手机号验证
    doctorPhoneReg() {
        if (this.state.doctorPhone === '') {
            this.setState({
                prompt: '请输入手机号',
            });
            return;
        }
        if (!RegExp.Reg_TelNo.test(this.state.doctorPhone)) {
            this.setState({
                prompt: '请核对手机号'
            });
        } else {
            this.setState({
                prompt: '',
            })
        }
    }

    // 校验码验证
    codeReg() {
        if (this.state.verificationCode === '') {
            this.setState({
                prompt: '请输入校验码',
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
        // this.setState({codeFlag: false});
        // this.timer = BackgroundTimer.setInterval(() => {
        //     let timer = this.state.timerCount - 1;
        //     if (timer <= 0) {
        //         this.timer && BackgroundTimer.clearInterval(this.timer);
        //         this.setState({
        //             timerCount: this.props.codeTime,
        //             timerTitle: '重新发送',
        //             codeFlag: true,
        //         })
        //     } else {
        //         this.setState({
        //             timerCount: timer,
        //         })
        //     }
        // }, 1000);
        let formData = new FormData();
        formData.append("phone", this.state.doctorPhone);
        fetch(requestUrl.passwordRetrieval, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status === '0') {
                    this.refs.toast.show('校验码发送成功');
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
                        prompt: '该手机未注册，请核对手机号',
                    })
                } else if (responseData.status === '5') {
                    this.setState({
                        prompt: '校验码已发送，请勿重复发送',
                        timerTitle: '重新发送',
                        codeFlag: true,
                        timerCount: this.props.codeTime,
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
                    });
                    console.log('error', error);
                });
        // }

        // }

    }

    //验证密码
    passwordReg() {
        if (this.state.password === '') {
            this.setState({
                prompt: '请设置密码',
            });
            return;
        }
        if (!RegExp.Reg_PassWord.test(this.state.password)) {
            this.setState({
                prompt: '密码格式不正确'
            });
            return;
        }
    }

    //确认密码
    doctorPasswordReg() {
        if (this.state.doctorPassword === '') {
            this.setState({
                prompt: '请输入确认密码',
            });
            return;
        }
        if (!RegExp.Reg_PassWord.test(this.state.doctorPassword)) {
            this.setState({
                prompt: '确认密码格式不正确'
            });
            return;
        }
        if (this.state.password !== this.state.doctorPassword) {
            this.setState({
                prompt: '两次密码不一致'
            });
            return;
        }
    }

    // 提交事件
    submit() {
        Keyboard.dismiss();
        if (this.state.doctorPhone === '') {
            this.setState({
                prompt: '请输入手机号',
            });
            return;
        }
        //手机号格式
        if (!RegExp.Reg_TelNo.test(this.state.doctorPhone)) {
            this.setState({
                prompt: '手机号格式不正确'
            });
            return;
        }
        // 校验码
        if (!RegExp.Reg_Number.test(this.state.verificationCode)) {
            this.setState({
                prompt: '校验码格式不正确'
            });
            return;
        }
        //设置密码
        if (this.state.password === '') {
            this.setState({
                prompt: '请输入设置密码',
            });
            return;
        }
        // 确认密码
        if (this.state.doctorPassword === '') {
            this.setState({
                prompt: '请输入确认密码',
            });
            return;
        }
        if (!RegExp.Reg_PassWord.test(this.state.password)) {
            this.setState({
                prompt: '设置密码格式不正确'
            });
            return;
        }
        if (!RegExp.Reg_PassWord.test(this.state.doctorPassword)) {
            this.setState({
                prompt: '确认密码格式不正确'
            });
            return;
        }
        if (this.state.password !== this.state.doctorPassword) {
            this.setState({
                prompt: '两次密码不一致'
            });
        } else {
            Keyboard.dismiss();
            this.setState({isLoading: true, loadingText: '修改中...'});
            let formData = new FormData();
            formData.append("doctorPhone", this.state.doctorPhone);
            formData.append("doctorPassword", this.state.doctorPassword);
            formData.append("verificationCode", this.state.verificationCode);
            fetch(requestUrl.findPassword, {
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
                        this.setState({
                            loadingText: '修改成功'
                        });
                        setTimeout(() => {
                            this.setState({isLoading: false});
                            this.props.navigation.goBack();
                        }, 1000);
                    } else if (responseData.status === '1') {
                        this.setState({
                            isLoading: false,
                            prompt: '请完善信息',
                        })
                    } else if (responseData.status === '2') {
                        this.setState({
                            isLoading: false,
                            prompt: '校验码有误',
                        })
                    } else if (responseData.status === '4') {
                        this.setState({
                            isLoading: false,
                            prompt: '请核对手机号后重试',
                        })
                    } else {
                        this.setState({
                            isLoading: false,
                            prompt: '请核对信息后重试',
                        })
                    }
                    console.log(responseData)

                })
                .catch(
                    (error) => {
                        this.setState({
                            isLoading: false,
                            prompt: '请稍后重试',
                        });
                        console.log('error', error);
                    });
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    content: {
        flex: 1,
        marginTop: px2dp(7),
        backgroundColor: '#fff',
    },
    textInputBox: {
        justifyContent: 'center',
        height: px2dp(52),
        marginLeft: px2dp(16),
        marginRight: px2dp(16),
        borderBottomWidth: Pixel,
        borderBottomColor: '#d6e1e8',
    },
    textInput: {
        height: px2dp(52),
        flex: 1,
        paddingLeft: px2dp(20),
        fontSize: FONT_SIZE(17),
        padding: 0,
        margin: 0,
    },
    promptText: {
        marginTop: px2dp(10),
        marginLeft: px2dp(36),
        color: '#ff4c4c',
        fontSize: FONT_SIZE(14),
    },
    //校验码按钮
    getCodeBox: {
        position: 'absolute',
        top: px2dp(11),
        right: px2dp(23),
    },
    codeBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: px2dp(80),
        height: px2dp(34),
        borderRadius: px2dp(7),
        backgroundColor: '#566cb7',
    },
    codeBtnText: {
        fontSize: FONT_SIZE(16),
        color: '#fffefe',
    },

});
