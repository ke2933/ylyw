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
import BackgroundTimer from 'react-native-background-timer';//锁屏倒计时
import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import px2dp from "../../common/Tool";


export default class validate extends Component {
    static navigationOptions = {
        header: null,
    };
    static defaultProps = {
        codeTime: 120,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            loadingText: '加载中...',
            payPass: '',
            doctorName: '',//名字
            idCard: '',// id
            smsCode: '',// 校验码
            codeFlag: true,
            timerCount: 120,
            timerTitle: '点击发送',
            btnFlag: 0,
            loginPhone: '',
        }
    }

    componentWillMount() {
        NetWork ? null : Alert.alert('网络似乎断掉了'), this.setState({isLoading: false});
        RouteName.push(this.props.navigation.state);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }
    }

    componentDidMount() {
        Key = this.props.navigation.state.key;
        fetch(requestUrl.getLoginPhone)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({isLoading: false});
                if (responseData.status === '10') {
                    this.props.navigation.navigate('Login');
                } else {
                    this.setState({
                        loginPhone: responseData.phone,
                    })
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                    console.log('error', error);
                });
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
                         'title': '身份验证',
                         rightBtn: {type: 'false'}
                     }}
                />
                <ScrollView
                    style={{flex: 1,}}
                >
                    <View style={styles.hintBox}>
                        <Text style={styles.hintText}>为了您的账户安全，请先验证身份信息</Text>
                    </View>
                    <View style={styles.validateContent}>
                        <View style={[styles.validateBox, {borderBottomWidth: Pixel}]}>
                            <Text style={styles.validateTitle}>认证姓名</Text>
                            <TextInput
                                style={styles.validateInput}
                                placeholder={'请输入实名认证时填写的姓名'}
                                placeholderTextColor={'#bdbdbd'}
                                onChangeText={(text) => this.setState({doctorName: text})}
                                underlineColorAndroid={'transparent'}
                                onBlur={() => {
                                    this.doctorNameReg()
                                }}
                            >
                            </TextInput>
                        </View>
                        <View style={styles.validateBox}>
                            <Text style={styles.validateTitle}>身份证号</Text>
                            <TextInput
                                style={styles.validateInput}
                                placeholder={'请输入身份证号码'}
                                placeholderTextColor={'#bdbdbd'}
                                onChangeText={(text) => this.setState({idCard: text})}
                                underlineColorAndroid={'transparent'}
                                onBlur={() => {
                                    this.idCardReg();
                                }}
                            >
                            </TextInput>
                        </View>
                    </View>
                    <View style={styles.hintBox}>
                        <Text style={styles.hintText}>验证登录用的手机号码：{this.state.loginPhone}</Text>
                    </View>
                    <View style={styles.validateContent}>
                        <View style={styles.validateBox}>
                            <Text style={styles.validateTitle}>校验码</Text>
                            <TextInput
                                style={styles.validateInput}
                                placeholder={'请输入校验码'}
                                placeholderTextColor={'#bdbdbd'}
                                onChangeText={(text) => this.setState({smsCode: text})}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'numeric'}
                                onBlur={() => {
                                    this.smsCodeReg();
                                }}
                            >
                            </TextInput>
                            <TouchableOpacity
                                onPress={() => {
                                    this.getSmsCode();
                                }}
                                activeOpacity={.8}
                            >
                                <View style={styles.validateCodeBox}>
                                    <Text
                                        style={styles.validateCodeText}>{this.state.codeFlag ? this.state.timerTitle : this.state.timerCount + '秒'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.payBtn}>
                        <TouchableOpacity
                            onPress={() => {
                                if (this.state.btnFlag >= 3) {
                                    this.checkPaymentPasswordInform();
                                }
                            }}
                            activeOpacity={.8}
                        >
                            <View
                                style={[styles.payPassBox, this.state.btnFlag >= 3 ? styles.payPassBoxYes : styles.payPassBoxNo]}>
                                <Text
                                    style={[styles.payPassText, this.state.btnFlag >= 3 ? styles.payPassTextYes : styles.payPassTextNo]}>确定</Text>
                            </View>
                        </TouchableOpacity>
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

    doctorNameReg() {
        if (this.state.doctorName === '') {
            this.refs.toast.show('请输入真实姓名');
            return;
        }
        if (!RegExp.Reg_Name.test(this.state.doctorName)) {
            this.refs.toast.show('请核对姓名');
            return;
        } else {
            this.setState({
                btnFlag: this.state.btnFlag += 1,
            })
        }
    }

    idCardReg() {
        if (this.state.idCard === '') {
            this.refs.toast.show('请输入身份证号码');
            return;
        }
        if (!RegExp.Reg_IDCardNo.test(this.state.idCard)) {
            this.refs.toast.show('请核对身份证号码');
            return;
        } else {
            this.setState({
                btnFlag: this.state.btnFlag += 1,
            })
        }
    }

    smsCodeReg() {
        if (this.state.smsCode === '') {
            this.refs.toast.show('请输入校验码');
            return;
        }
        if (!RegExp.Reg_Number.test(this.state.smsCode)) {
            this.refs.toast.show('请核对校验码');
            return;
        } else {
            this.setState({
                btnFlag: this.state.btnFlag += 1,
            })
        }
    }

    // 获取验证码
    getSmsCode() {
        if (this.state.codeFlag) {
            this.timer = BackgroundTimer.setInterval(() => {
                this.setState({codeFlag: false});
                let timer = this.state.timerCount - 1;
                if (timer <= 0) {
                    this.timer && BackgroundTimer.clearInterval(this.timer);
                    this.setState({
                        timerCount: this.props.codeTime,
                        timerTitle: '重新发送',
                        codeFlag: true,
                    })
                } else {
                    this.setState({
                        timerCount: timer,
                    })
                }
            }, 1000);
            fetch(requestUrl.getSmsCode)
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.status === '0') {
                        this.refs.smsCode.show('校验码发送成功');
                    } else if (responseData.status === '1') {
                        this.refs.smsCode.show('发送失败，请重试');
                    } else if (responseData.status === '4') {
                        this.setState({
                            prompt: '该手机号还未注册，请先去注册',
                            timerTitle: '重新发送',
                            codeFlag: true,
                            timerCount: this.props.codeTime,
                        });
                        BackgroundTimer.clearInterval(this.timer);
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
        }
    }

    // 身份验证
    checkPaymentPasswordInform() {
        if (this.state.doctorName === '') {
            this.refs.toast.show('请输入真实姓名');
            return;
        }
        if (!RegExp.Reg_Name.test(this.state.doctorName)) {
            this.refs.toast.show('请核对姓名');
            return;
        }
        if (this.state.idCard === '') {
            this.refs.toast.show('请输入身份证号码');
            return;
        }
        if (!RegExp.Reg_IDCardNo.test(this.state.idCard)) {
            this.refs.toast.show('请核对身份证号码');
            return;
        }
        if (this.state.smsCode === '') {
            this.refs.toast.show('请输入校验码');
            return;
        }
        if (!RegExp.Reg_Number.test(this.state.smsCode)) {
            this.refs.toast.show('请核对校验码');
            return;
        } else {
            this.setState({
                btnFlag: 3,
                isLoading: true,
                loadingText: '验证中...'
            });
            fetch(requestUrl.checkPaymentPasswordInform + `?doctorName=${this.state.doctorName}&idCard=${this.state.idCard}&smsCode=${this.state.smsCode}`)
                .then((response) => response.json())
                .then((responseData) => {
                    console.log(responseData);
                    if (responseData.status === '10') {
                        this.props.navigation.navigate('Login');
                    } else if (responseData.status === '0') {
                        this.setState({
                            loadingText: '验证通过',
                        });
                        setTimeout(() => {
                            this.setState({
                                isLoading: false,
                            });
                            this.props.navigation.navigate('ResetPayPass');
                        }, 1000)
                    } else if (responseData.status === '1') {
                        this.setState({isLoading: false,});
                        this.refs.toast.show('请核对验证码');
                    } else {
                        this.setState({isLoading: false,});
                        this.refs.toast.show('认证信息不正确');
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    hintBox: {
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        justifyContent: 'flex-end',
        height: px2dp(32),
        marginBottom: px2dp(5),
    },
    validateContent: {
        backgroundColor: '#fff',
        paddingLeft: px2dp(15),
    },
    validateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: px2dp(15),
        height: px2dp(50),
        borderBottomColor: '#eeeeee',
    },
    validateTitle: {
        width: px2dp(80),
        fontSize: px2dp(16),
        color: '#757575',
    },
    validateInput: {
        flex: 1,
        height: px2dp(50),
        fontSize: FONT_SIZE(16),
        // lineHeight: px2dp(50),
    },
    validateCodeBox: {
        justifyContent: 'center',
        alignItems: 'center',
        height: px2dp(25),
        minWidth: px2dp(70),
        paddingLeft: px2dp(15),
        borderLeftWidth: Pixel,
        borderLeftColor: '#bdbdbd',
    },
    validateCodeText: {
        fontSize: FONT_SIZE(14),
        color: '#7388d0',
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
