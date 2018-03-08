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
            countQuota: '',// 总
            extractQuota: '',
            price: "",// 提交的数量
            taxPrice: '0',// 税额
            actualPrice: '0',// 实际额
            payPass: '',
            payPassFlag: false,// 输入密码
            payPassBoxBottom: new Animated.Value(-300),
            passFlag: true,
            keyFlag: false,// 键盘状态
            keyHeight: 0,
            bankId: "", // id
            bankCardType: "",// 卡行
            bankCardNo: "", // 卡号
            withdrawalFlag: false,
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
        NetWork ? null : Alert.alert('网络似乎断掉了'), this.setState({isLoading: false});
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
                // countQuota: "800.56",
            });
        }


        fetch(requestUrl.compareDate)
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status === '0') {
                    this.setState({
                        withdrawalFlag: true,
                    })
                } else {
                    this.setState({
                        withdrawalFlag: false,
                    })
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                    console.log('error', error);
                    this.refs.toast.show('查询卡信息失败，请稍后重试');
                });

        // 卡信息
        fetch(requestUrl.findBankCard)
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status === '10') {
                    this.props.navigation.navigate('Login');
                } else if (responseData.status === '0') {
                    this.setState({
                        isLoading: false,
                        bankId: responseData.doctorBankCard.id, // id
                        bankCardType: responseData.doctorBankCard.bankCardType,// 卡行
                        bankCardNo: responseData.doctorBankCard.bankCardNo, // 卡号
                    })
                } else {
                    this.setState({
                        isLoading: false,
                    })
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                    console.log('error', error);
                    this.refs.toast.show('查询卡信息失败，请稍后重试');
                });
    }

    // 计算代缴税额
    countPrice(text) {
        // 扩大100倍
        let num = text * 100;
        let price = Math.round(num) / 100;
        if (num <= 80000) {
            this.setState({
                price: price,// 提交的数量
                taxPrice: 0,// 税额
                actualPrice: Math.round(num) / 100,// 实际额
            })
        } else if (80000 < num && num <= 400000) {
            this.setState({
                price: price,// 提交的数量
                taxPrice: Math.round((num - 80000) * 2 / 10) / 100,// 税额
                actualPrice: Math.round(num - (num - 80000) * 2 / 10) / 100,// 实际额
            })
        } else if (400000 < num && num <= 2000000) {
            this.setState({
                price: price,// 提交的数量
                taxPrice: Math.round(num * 8 * 2 / 100) / 100,// 税额
                actualPrice: Math.round(num - (num * 8 * 2 / 100)) / 100,// 实际额
            })
        } else if (20000 < num && num <= 50000) {
            this.setState({
                price: price,// 提交的数量
                taxPrice: Math.round(num * 8 * 3 / 100 - 200000) / 100,// 税额
                actualPrice: Math.round(num - (num * 8 * 3 / 100 - 200000)) / 100,// 实际额
            })
        } else {
            this.setState({
                price: price,// 提交的数量
                taxPrice: Math.round(num * 8 * 4 / 100 - 700000) / 100,// 税额
                actualPrice: Math.round(num - (num * 8 * 4 / 100 - 700000)) / 100,// 实际额
            })
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
                        {/*卡信息*/}
                        <View style={styles.accountBox}>
                            {this.accountShow()}
                        </View>
                        <View style={styles.amountBox}>
                            <Text style={styles.moneySymbol}>¥</Text>
                            <TextInput
                                style={styles.amountText}
                                placeholder={'可提' + this.state.countQuota}
                                placeholderTextColor={'#bdbdbd'}
                                onChangeText={(text) => {
                                    let num = text.replace(/[^\d.]/g, '');
                                    this.countPrice(num);
                                }}
                                defaultValue={this.state.price + ''}
                                // autoFocus={true}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'numeric'}
                                // onBlur={this.doctorPhoneReg.bind(this)}
                            />
                        </View>
                        {/*全部提现按钮*/}
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    price: this.state.countQuota,
                                });
                                this.countPrice(this.state.countQuota);
                            }}
                            activeOpacity={.8}
                        >
                            <View style={styles.amountAllBox}>
                                <Text style={styles.amountAllText}>全部提现</Text>
                            </View>
                        </TouchableOpacity>
                        {/*提现费用计算*/}
                        <View style={styles.costBox}>
                            <Text style={styles.costText}>代缴税额：</Text>
                            <Text style={styles.costText}> {this.state.taxPrice}元</Text>
                        </View>
                        <View style={styles.costBox}>
                            <Text style={styles.costText}>实际到账：</Text>
                            <Text style={styles.costText}>{this.state.actualPrice}元</Text>
                        </View>
                        <View style={styles.allMoneyBox}>
                            <Text style={styles.allMoneyText}>全部余额 {this.state.countQuota} 元</Text>
                        </View>
                        <View style={{
                            alignItems: 'center',
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    // 提现金额 >= 0.1 <= 全部余额
                                    if (this.state.bankId && this.state.withdrawalFlag) {
                                        if (this.state.price >= 0.1 && this.state.price <= this.state.countQuota) {
                                            if (this.state.passFlag) {
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
                                    }
                                }}
                                activeOpacity={.8}
                            >
                                <View
                                    style={[styles.withdrawCashBtn, this.state.withdrawalFlag && this.state.bankId && this.state.price >= 0.1 && this.state.price <= this.state.countQuota ? styles.withdrawCashBtnYes : styles.withdrawCashBtnNo]}>
                                    <Text
                                        style={[styles.withdrawCashText, this.state.withdrawalFlag && this.state.bankId && this.state.price >= 0.1 && this.state.price <= this.state.countQuota ? styles.withdrawCashTextYes : styles.withdrawCashTextNo]}>申请提现</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
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

    // 卡信息 绑定/未绑定
    accountShow() {
        if (this.state.bankId) {
            return (
                <View style={styles.accountInfo}>
                    <Image source={require('../../images/bank_pay.png')}/>
                    <View style={styles.bankTextBox}>
                        <Text style={styles.bankText}>{this.state.bankCardType}</Text>
                        <Text style={styles.bankText}>{"**** **** **** " + this.state.bankCardNo.substr(-4)}</Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.accountInfo}>
                    <Image source={require('../../images/bank_unbind.png')}/>
                    <Text style={styles.noAccount}>未绑定</Text>
                </View>
            )
        }
    }

    // 提现接口
    cash(payPass) {
        this.setState({
            isLoading: true,
            loadingText: '申请处理中...'
        });
        fetch(requestUrl.checkPaymentPassword + '?password=' + payPass)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '10') {
                    this.props.navigation.navigate('Login');
                } else if (responseData.status === '0') {
                    let formData = new FormData();
                    formData.append("money", this.state.price);
                    formData.append("bankCardId", this.state.bankId);
                    console.log(formData);
                    fetch(requestUrl.appEncashment, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formData,
                    }).then((response) => response.json())
                        .then((responseData) => {
                            if (responseData.status === '0') {
                                this.props.navigation.state.params.callback(this.state.price);
                                this.setState({
                                    loadingText: '提现申请成功',
                                    countQuota: (this.state.countQuota * 100 - this.state.price * 100) / 100,
                                    price: '',
                                    taxPrice: '0',
                                    actualPrice: '0',
                                });
                                setTimeout(() => {
                                    this.setState({
                                        isLoading: false,
                                        payPass: '',
                                        payPassFlag: false,
                                    });
                                }, 1000);
                            } else if (responseData.status === '4') {
                                this.setState({
                                    loadingText: '余额不足',
                                    price: '',
                                    taxPrice: '0',
                                    actualPrice: '0',
                                });
                                setTimeout(() => {
                                    this.setState({
                                        isLoading: false,
                                        payPass: '',
                                        payPassFlag: false,
                                    });
                                }, 1000);
                            } else {
                                this.setState({
                                    loadingText: '每自然月只能提现一次',
                                    price: '',
                                    taxPrice: '0',
                                    actualPrice: '0',
                                });
                                setTimeout(() => {
                                    this.setState({
                                        isLoading: false,
                                        payPass: '',
                                        payPassFlag: false,
                                    });
                                }, 1000);
                            }
                        })
                        .catch(
                            (error) => {
                                this.setState({isLoading: false,});
                                console.log('error', error);
                            });
                } else {
                    this.setState({
                        isLoading: false,
                        payPass: '',
                    });
                    this.refs.toast.show('密码错误，请重新输入');
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
    // 卡信息
    accountInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: px2dp(15),
        borderBottomColor: '#dbdbdb',
        borderBottomWidth: Pixel,
    },
    bankTextBox: {
        marginLeft: px2dp(10),
        height: px2dp(37),
        justifyContent: 'space-between',
    },

    accountText: {
        marginLeft: px2dp(10),
        fontSize: FONT_SIZE(16),
        color: '#212121',
    },
    // 金额输入
    amountBox: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        // height: px2dp(22.5),
        height: px2dp(40),
        marginTop: px2dp(26),
        marginBottom: px2dp(14),
    },
    moneySymbol: {
        fontSize: FONT_SIZE(19),
        color: '#212121',
        marginRight: px2dp(8),
    },
    amountText: {
        padding: 0,
        fontSize: px2dp(24),
        color: '#212121',
        minWidth: 80,
    },
    amountAllBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: px2dp(39),
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
        marginTop: px2dp(53),
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
    // 费用计算
    costBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: px2dp(10),
    },
    costText: {
        color: '#212121',
        fontSize: FONT_SIZE(14),
    },
    // 全部余额
    allMoneyBox: {
        borderTopWidth: Pixel,
        borderTopColor: '#dbdbdb',
        paddingTop: px2dp(10),
    },
    allMoneyText: {
        color: '#bdbdbd',
        fontSize: FONT_SIZE(14),
    },

    // 未绑定账户
    noAccount: {
        marginLeft: px2dp(10),
        color: '#bdbdbd',
        fontSize: FONT_SIZE(19),
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
