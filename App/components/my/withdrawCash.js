import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Animated,
    Easing,
    Keyboard,
    BackHandler,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';

import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import px2dp from "../../common/Tool";
//按钮

export default class withdrawCash extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            loadingText: '加载中...',
            accountFlag: false,
            accountALi: false,
            aLiId: '',
            accountWeChat: false,
            weChatId: '',
            accountSel: true,// 两个账户都存在时的选择 true aLi / false weChat
            countQuota: '',// 总
            extractQuota: '',
            price: '',// 提交的数量
            payPass: '',
            payPassFlag: false,// 输入密码
            payPassBoxBottom: new Animated.Value(-300),
            passFlag: false,
            keyFlag: false,// 键盘状态
            keyHeight: 0,
        }
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }


    _keyboardDidShow(e) {
        _scrollView.scrollToEnd({animated: true});
        this.setState({
            keyFlag: true,
            keyHeight: Math.ceil(e.endCoordinates.height),
        })
    }

    _keyboardDidHide(e) {
        this.setState({
            payPassFlag: false,
            keyFlag: false,
            keyHeight: 0,
        })
    }

    componentWillMount() {
        RouteName.push(this.props.navigation.state);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params.data;
            console.log(data);
            if (data.paymentPassword === '0') {
                this.setState({
                    passFlag: true,
                })
            } else {
                this.setState({
                    passFlag: false,
                })
            }
            this.setState({
                countQuota: data.balance,
            });
        }
        this.getAccount();

    }

    // 获取当前账户
    getAccount() {
        fetch(requestUrl.getAccount)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({isLoading: false});
                if (responseData.status === '10') {
                    this.props.navigation.navigate('Login');
                } else if (responseData.status === '0') {
                    let temp = responseData.purseAccountList;
                    temp.map((item, index) => {
                        if (item.accountType === '支付宝') {
                            this.setState({
                                accountALi: true,
                                aLiId: item.accountNumber,
                            })
                        } else if (item.accountType === '微信') {
                            this.setState({
                                accountWeChat: true,
                                weChatId: item.accountNumber,
                            })
                        }
                    });
                } else {
                    this.setState({
                        accountWeChat: false,
                        accountALi: false,
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
                         'title': '提现',
                         rightBtn: {type: 'false'}
                     }}
                />
                <ScrollView
                    ref={(scrollView) => {
                        _scrollView = scrollView;
                    }}
                    scrollEnabled={!this.state.keyFlag}
                    style={{flex: 1}}>
                    <View style={styles.content}>
                        <TouchableOpacity
                            onPress={() => {
                                if (this.state.accountALi || this.state.accountWeChat) {
                                    this.setState({
                                        accountFlag: true,
                                    })
                                }
                            }}
                            activeOpacity={.8}
                        >
                            <View style={styles.accountBox}>
                                {this.accountShow()}
                                <Image source={require('../../images/arrow_gray_right.png')}/>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.amountBox}>
                            <Text style={styles.moneySymbol}>¥</Text>
                            <TextInput
                                style={[styles.amountText, {fontSize: this.state.price.length > 0 ? FONT_SIZE(35) : FONT_SIZE(16)}]}
                                placeholder={'可提现金额' + this.state.countQuota}
                                placeholderTextColor={'#bdbdbd'}
                                onChangeText={(text) => {
                                    this.setState({
                                        price: text,
                                    })
                                }}
                                // autoFocus={true}
                                defaultValue={this.state.price}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'numeric'}
                                // onBlur={this.doctorPhoneReg.bind(this)}
                            >
                            </TextInput>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        price: this.state.countQuota,
                                    })
                                }}
                                activeOpacity={.8}
                            >
                                <View style={styles.amountAllBox}>
                                    <Text style={styles.amountAllText}>全部提现</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.amountAllNum}>全部余额 {this.state.countQuota} 元</Text>
                        <View style={{
                            alignItems: 'center',
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    // 提现金额 >= 0.1 <= 全部余额
                                    if (this.state.price >= 0.1 && this.state.price <= this.state.countQuota) {

                                        if (!this.state.accountALi && !this.state.accountWeChat) {
                                            // 未绑定账户，去绑定
                                            Alert.alert('', '还未绑定账户，去绑定？', [
                                                {
                                                    text: '取消', onPress: () => {
                                                    }
                                                },
                                                {
                                                    text: '确认', onPress: () => {
                                                        navigate('Manage', {
                                                            'callback': (data) => {
                                                                this.getAccount();
                                                            }
                                                        });
                                                    }
                                                },
                                            ])


                                        } else if (this.state.passFlag) {
                                            // 已开启支付密码
                                            this.setState({payPassFlag: true,});
                                            Animated.timing(this.state.payPassBoxBottom, {
                                                toValue: 0,
                                                duration: 300,
                                                easing: Easing.linear,// 线性的渐变函数
                                            }).start();
                                        } else {
                                            // 去设置支付密码
                                            navigate('PayPass', {
                                                'title': '设置支付密码',
                                                'callback': (data) => {
                                                    this.setState({
                                                        passFlag: data,
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }}
                                activeOpacity={.8}
                            >
                                <View
                                    style={[styles.withdrawCashBtn, this.state.price >= 0.1 && this.state.price <= this.state.countQuota ? styles.withdrawCashBtnYes : styles.withdrawCashBtnNo]}>
                                    <Text
                                        style={[styles.withdrawCashText, this.state.price >= 0.1 && this.state.price <= this.state.countQuota ? styles.withdrawCashTextYes : styles.withdrawCashTextNo]}>确认提现</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.remindBox}>
                        <Image source={require('../../images/remind.png')}/>
                        <Text style={styles.remindText}>预计3日内到账</Text>
                    </View>

                </ScrollView>
                {this.state.payPassFlag ?
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({payPassFlag: false})
                        }}
                        activeOpacity={1}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: SCREEN_WIDTH,
                            height: SCREEN_HEIGHT,
                            backgroundColor: 'rgba(0,0,0,.4)',
                        }}
                    >
                        <Animated.View style={[styles.writeBox, {bottom: this.state.payPassBoxBottom}]}>
                            <TouchableOpacity
                                onPress={() => {
                                }}
                                activeOpacity={1}
                                style={{flex: 1}}
                            >
                                <View style={styles.writeTitleBox}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                payPassFlag: false,
                                            })
                                        }}
                                        activeOpacity={.8}
                                        style={styles.cancelClick}
                                    >
                                        <View style={styles.cancelBox}>
                                            <Text style={styles.cancelText}>取消</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={styles.writeTitle}>请输入支付密码</Text>
                                </View>
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
                                            });
                                            if (text.length >= 6) {
                                                this.cash(text);
                                            }
                                        }}
                                        autoFocus={true}
                                        defaultValue={this.state.payPass}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={true}
                                        maxLength={6}
                                        caretHidden={true}
                                        keyboardType={'numeric'}
                                        onLongPress={() => {
                                            return false
                                        }}
                                    >
                                    </TextInput>

                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigate('Validate');
                                    }}
                                    activeOpacity={.8}
                                >
                                    <View style={styles.forgetBox}>
                                        <Text style={styles.forgetText}>
                                            忘记密码？
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{height: IOS ? this.state.keyHeight : 0}}></View>
                            </TouchableOpacity>
                        </Animated.View>
                    </TouchableOpacity>
                    : null}
                {this.state.accountFlag ?
                    <TouchableOpacity
                        onPress={() => {
                        }}
                        activeOpacity={1}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: SCREEN_WIDTH,
                            height: SCREEN_HEIGHT,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,.4)'
                        }}
                    >
                        <View style={styles.accountSelContainer}>
                            <Text style={styles.accountSelTitle}>选择提现账号</Text>
                            <View style={styles.accountSelContent}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (this.state.accountALi) {
                                            this.setState({
                                                accountFlag: false,
                                                accountSel: true,
                                            })
                                        }
                                    }}
                                    activeOpacity={.8}
                                >
                                    <View style={[styles.accountSelBox, {marginRight: px2dp(15)}]}>
                                        <Image
                                            source={this.state.accountALi ? require('../../images/alipay_big_true.png') : require('../../images/alipay_big_false.png')}/>
                                        <Text style={styles.accountSelText}>支付宝</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (this.state.accountWeChat) {
                                            this.setState({
                                                accountFlag: false,
                                                accountSel: false,
                                            })
                                        }
                                    }}
                                    activeOpacity={.8}
                                >
                                    <View style={styles.accountSelBox}>
                                        <Image
                                            source={this.state.accountWeChat ? require('../../images/wechat_pay_big_true.png') : require('../../images/wechat_pay_big_false.png')}/>
                                        <Text style={styles.accountSelText}>微信</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                    : null
                }

                <Toast
                    ref='toast'
                    style={{backgroundColor: '#333333', borderRadius: 10,}}
                    position={'top'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeInDuration={100}
                    fadeOutDuration={2000}
                    opacity={.8}
                />
            </View>
        );
    }

    // 账户显示
    // 1.默认显示支付宝
    // 2.两个账户都存在 默认支付宝
    // 3.只有一个账户存在 显示存在账号
    // 4.都不存在 显示未绑定账户
    accountShow() {
        if (this.state.accountALi && this.state.accountWeChat) {
            if (this.state.accountSel) {
                return (
                    <View style={styles.accountInfo}>
                        <Image source={require('../../images/alipay_true.png')}/>
                        <Text style={styles.accountText}>支付宝 ( {this.state.aLiId} )</Text>
                    </View>
                )
            } else {
                return (
                    <View style={styles.accountInfo}>
                        <Image source={require('../../images/wechat_pay_true.png')}/>
                        <Text style={styles.accountText}>微信 ( {this.state.weChatId} )</Text>
                    </View>
                )
            }

        } else if (this.state.accountWeChat) {
            return (
                <View style={styles.accountInfo}>
                    <Image source={require('../../images/wechat_pay_true.png')}/>
                    <Text style={styles.accountText}>微信 ( {this.state.weChatId} )</Text>
                </View>
            )
        } else if (this.state.accountALi) {
            return (
                <View style={styles.accountInfo}>
                    <Image source={require('../../images/alipay_true.png')}/>
                    <Text style={styles.accountText}>支付宝 ( {this.state.aLiId} )</Text>
                </View>
            )
        } else {
            return (<Text style={styles.noAccount}>未绑定账号</Text>)
        }
    }

    // 提现接口
    cash(payPass) {
        this.setState({
            isLoading: true,
            loadingText: '处理中...'
        });
        let formData = new FormData();
        if (this.state.accountWeChat && this.state.accountALi) {
            if (this.state.accountSel) {
                formData.append("type", '支付宝');
            } else {
                formData.append("type", '微信');
            }
        } else if (this.state.accountWeChat) {
            formData.append("type", '微信');
        } else if (this.state.accountALi) {
            formData.append("type", '支付宝');
        } else {
            formData.append("type", '支付宝');
        }
        formData.append("price", this.state.price);
        formData.append("paymentPassword", payPass);
        console.log(formData);
        fetch(requestUrl.cash, {
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
                    this.setState({
                        loadingText: '提现成功',
                        price: '',
                        countQuota: this.state.countQuota - this.state.price,
                    });
                    setTimeout(() => {
                        this.setState({
                            isLoading: false,
                            payPass: '',
                            payPassFlag: false,
                        });
                    }, 1000);
                } else if (responseData.status === '7') {
                    this.setState({
                        isLoading: false,
                        payPass: '',
                        payPassFlag: false,
                    });
                    this.refs.toast.show('提现失败！可提现金额不足');
                } else if (responseData.status === '3') {
                    this.setState({
                        isLoading: false,
                        payPass: '',
                        payPassFlag: false,
                    });
                    this.refs.toast.show('提现失败！请绑定提现账号');
                } else if (responseData.status === '4') {
                    this.setState({
                        isLoading: false,
                        payPass: '',
                        payPassFlag: false,
                    });
                    this.refs.toast.show('系统繁忙，请稍后重试');
                } else if (responseData.status === '5') {
                    this.setState({
                        isLoading: false,
                        payPass: '',
                        payPassFlag: false,
                    });
                    this.refs.toast.show('提现失败！支付密码错误');
                } else {
                    this.setState({
                        isLoading: false,
                        payPass: '',
                        payPassFlag: false,
                    });
                    this.refs.toast.show('提现失败，请重试');
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
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        marginTop: px2dp(15),
        paddingTop: px2dp(20),
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        paddingBottom: px2dp(15),
        borderRadius: px2dp(10),
        backgroundColor: '#fff',
        borderWidth: Pixel,
        borderColor: '#eeeeee',
    },
    // 提现账户选择
    accountBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: px2dp(52),
        borderBottomWidth: Pixel,
        borderBottomColor: '#dbdbdb',
    },
    accountInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountText: {
        marginLeft: px2dp(10),
        fontSize: FONT_SIZE(16),
        color: '#212121',
    },
    // 金额输入
    amountBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(105),
        borderBottomWidth: Pixel,
        borderBottomColor: '#dbdbdb',
    },
    moneySymbol: {
        fontSize: FONT_SIZE(35),
        color: '#212121',
        marginRight: px2dp(12),
    },
    amountText: {
        flex: 1,
        height: px2dp(105),
        fontSize: px2dp(16),
        color: '#212121',
    },
    amountAllBox: {
        flex: 1,
        justifyContent: 'center',
    },
    amountAllText: {
        fontSize: FONT_SIZE(14),
        color: '#7388d0',
    },
    // 全部提现金额
    amountAllNum: {
        marginTop: px2dp(20),
        fontSize: FONT_SIZE(14),
        color: '#212121',
    },
    withdrawCashBtn: {
        marginTop: px2dp(63),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: px2dp(5),
        width: px2dp(200),
        height: px2dp(40),
    },
    withdrawCashBtnYes: {
        backgroundColor: '#566cb7',
    },
    withdrawCashBtnNo: {
        borderColor: '#c1cfff',
        borderWidth: Pixel,
    },
    withdrawCashText: {
        fontSize: FONT_SIZE(16),
    },
    withdrawCashTextNo: {
        color: '#c1cfff',
    },
    withdrawCashTextYes: {
        color: '#fff',
    },

    // 提现账户选择框
    accountSelContainer: {
        width: px2dp(290),
        paddingTop: px2dp(20),
        borderWidth: Pixel,
        borderColor: '#eeeeee',
        borderRadius: px2dp(10),
        backgroundColor: '#fff',
    },
    accountSelTitle: {
        fontSize: FONT_SIZE(16),
        color: '#212121',
        textAlign: 'center',
    },
    accountSelContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: px2dp(160),
    },
    accountSelBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(100),
        height: px2dp(100),
        borderWidth: Pixel,
        borderColor: '#dbdbdb',
        borderRadius: px2dp(10),
    },
    accountSelText: {
        marginTop: px2dp(10),
        color: '#212121',
        fontSize: FONT_SIZE(16)
    },

    // 未绑定账户
    noAccount: {
        color: '#212121',
        fontSize: FONT_SIZE(16),
    },

    // 到账时间提示
    remindBox: {
        marginTop: px2dp(20),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(35),
        paddingRight: px2dp(15),
    },
    remindText: {
        marginLeft: px2dp(10),
        fontSize: FONT_SIZE(16),
        color: '#212121',
    },
    // 输入密码
    writeBox: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        // height: px2dp(400),
        width: SCREEN_WIDTH,
        backgroundColor: '#f5f5f5',
    },

    writeTitleBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: px2dp(50),
        borderBottomWidth: Pixel,
        borderColor: '#bdbdbd',
    },
    writeTitle: {
        fontSize: FONT_SIZE(16),
        color: '#212121',
    },
    cancelClick: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    cancelBox: {
        justifyContent: 'center',
        height: px2dp(50),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
    },
    cancelText: {
        fontSize: FONT_SIZE(14),
        color: '#212121',
    },

    // 密码输入框
    payPassContent: {
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        marginTop: px2dp(25),
        flexDirection: 'row',
        height: px2dp(55),
        borderWidth: Pixel,
        borderColor: '#dbdbdb',
        borderRadius: px2dp(5),
        overflow: 'hidden',
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
        borderRightWidth: 1,
        borderRightColor: '#dbdbdb',
        textAlign: 'center',
        fontSize: FONT_SIZE(20),
        backgroundColor: '#FFF',
    },

    forgetBox: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: px2dp(35),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
    },
    forgetText: {
        fontSize: FONT_SIZE(14),
        color: '#7388d0',
    }
});
