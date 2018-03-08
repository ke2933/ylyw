import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    BackHandler,
    AsyncStorage,
    ToastAndroid,
    DeviceEventEmitter,
    Keyboard,
} from 'react-native';

import {requestUrl} from './Network/url';//接口url
import {RegExp} from './Network/RegExp';//正则
import {Global} from './common/Global';
import Loading from './common/Loading';
import Communications from 'react-native-communications';

export default class Login extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            flag: true,//false测试环境
            prompt: '',//提示信息
            doctorPhone: '',//帐号
            doctorPassword: '',//密码
            isLoading: false,
            loadingText: '',
        }
    }

    componentWillMount() {
        RouteName.splice(0, RouteName.length);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <ScrollView
                keyboardShouldPersistTaps={'handled'}
                style={{backgroundColor: '#fff'}}>
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
                            onPress={() => navigate('SmsLogin')}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={styles.smsLoginText}>
                                短信登录
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
                        <Image source={require('./images/lock.png')} style={styles.textIcon}/>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'请输入密码'}
                            placeholderTextColor={'#c7c7cd'}
                            onChangeText={(text) => this.setState({doctorPassword: text})}
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={true}
                            onBlur={this.password.bind(this)}
                        >
                        </TextInput>
                    </View>
                    <View style={styles.forgotPasswordBox}>
                        <View style={styles.promptBox}>
                            <Text style={styles.promptTextRed}>
                                {this.state.prompt}
                            </Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigate('RetrievePassword')}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={styles.forgotPasswordText}>
                                忘记密码？
                            </Text>
                        </TouchableOpacity>
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
                                Alert.alert('拨打电话', '010－63786220', [
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
            </ScrollView>
        );
    }


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

    password() {
        if (this.state.doctorPassword === '') {
            this.setState({
                prompt: '请输入密码',
            });
            return;
        }
        if (!RegExp.Reg_PassWord.test(this.state.doctorPassword)) {
            this.setState({
                prompt: '请核对密码'
            });
        } else {
            this.setState({
                prompt: '',
            })
        }
    }

    //登录事件
    login() {
        if (this.state.flag) {
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
                return;
            }
            if (this.state.doctorPassword === '') {
                this.setState({
                    prompt: '请输入密码',
                });
                return;
            }
            if (!RegExp.Reg_PassWord.test(this.state.doctorPassword)) {
                this.setState({
                    prompt: '请核对密码'
                });
            } else {
                Keyboard.dismiss();
                this.setState({isLoading: true, loadingText: '登录中...'});
                let formData = new FormData();
                formData.append("doctorPhone", this.state.doctorPhone);
                formData.append("doctorPassword", this.state.doctorPassword);
                console.log(formData);
                fetch(requestUrl.login, {
                    method: 'POST',
                    credentials: "include",
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
                            // 保存登录手机号
                            AsyncStorage.removeItem('UserPhone');
                            AsyncStorage.setItem('UserPhone', JSON.stringify(this.state.doctorPhone)).then(() => {
                                console.log('成功');
                            }).catch((error) => {
                                console.log('失败');
                            });
                            setTimeout(() => {
                                this.setState({isLoading: false,});
                                this.props.navigation.navigate('Home');
                            }, 500);
                            return;
                        } else if (responseData.status === '1') {
                            this.setState({
                                isLoading: false,
                                prompt: '手机号或密码有误',
                            })
                        } else if (responseData.status === '2') {
                            this.setState({
                                isLoading: false,
                                prompt: '该手机号已被禁用',
                            })
                        } else if (responseData.status === '3') {
                            this.setState({
                                isLoading: false,
                                prompt: '手机号或密码有误',
                            })
                        } else {
                            this.setState({
                                isLoading: false,
                                prompt: '登录失败，请重试',
                            })
                        }
                    })
                    .catch(
                        (error) => {
                            console.log(error);
                            this.setState({
                                isLoading: false,
                                prompt: '登录失败，请稍后重试',
                            });
                        });
            }
        } else {
            let formData = new FormData();
            if (Android) {
                formData.append("doctorPhone", '18801370533');
                formData.append("doctorPassword", '123456789');
            } else {
                formData.append("doctorPhone", '17778155280');
                formData.append("doctorPassword", '123456789');
            }
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
                        this.props.navigation.navigate('Home');
                    } else {
                        Alert.alert('shibai')
                    }

                })
                .catch(
                    (error) => {
                        console.log('error', error);
                    });
        }

    }
}

const
    styles = StyleSheet.create({
        container: {
            backgroundColor: '#fff',
            height: IOS ? SCREEN_HEIGHT : SCREEN_HEIGHT - StatusBarHeight,

        },
        //短信登录
        smsLoginBox: {
            marginTop: IOS ? 30 : 10,
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
            borderBottomWidth: Pixel,
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
        // promptTextGray: {
        //     color: '#898989',
        //     fontSize: 14,
        // },
        promptTextRed: {
            color: '#ff4c4c',
            fontSize: 14,
        },
        //忘记密码
        forgotPasswordText: {
            fontSize: 15,
            color: '#898989',
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
        // 客服
        serviceBox: {
            position: 'absolute',
            bottom: 33,
            left: 0,
        },
        serviceText: {
            width: SCREEN_WIDTH,
            textAlign: 'center',
            fontSize: 15,
            color: '#898989',

        },

    });
