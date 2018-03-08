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
    FlatList,
} from 'react-native';

import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import px2dp from "../../common/Tool";
//按钮

export default class manage extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            loadingText: '加载中...',
            bankFlag: false,
            bankName: '',
            selectBankName: bankIdentify[0].bankName,
            bankCardNo: '',// 银行卡号
            errorText: '',// 错误提示内容
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
        // fetch(requestUrl.getAccount)
        //     .then((response) => response.json())
        //     .then((responseData) => {
        //         console.log(responseData);
        //         this.setState({isLoading: false});
        //         if (responseData.status === '10') {
        //             this.props.navigation.navigate('Login');
        //         } else if (responseData.status === '0') {
        //
        //         } else {
        //
        //         }
        //     })
        //     .catch(
        //         (error) => {
        //             this.setState({isLoading: false,});
        //             console.log('error', error);
        //         });
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
                         'title': "绑定银行卡",
                         rightBtn: {type: 'false'}
                     }}
                />
                <ScrollView style={{flex: 1}}>
                    {/*绑定银行卡*/}
                    <View style={styles.titleBox}>
                        <Text style={styles.titleText}>请绑定持卡人本人的银行卡</Text>
                    </View>
                    <View style={styles.itemContent}>
                        <View style={[styles.itemBox, {borderBottomWidth: Pixel,}]}>
                            <Text style={styles.title}>持卡人</Text>
                            <Text style={styles.name}>{UserInfo.name}</Text>
                        </View>
                        <View style={[styles.itemBox, {borderBottomWidth: Pixel,}]}>
                            <Text style={styles.title}>发卡行</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'请选择'}
                                placeholderTextColor={'#bdbdbd'}
                                defaultValue={this.state.bankName}
                                underlineColorAndroid={'transparent'}
                            />
                            <Image style={styles.arrowBelow} source={require('../../images/arrow_below.png')}/>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        bankFlag: true,
                                        selectBankName: this.state.bankName === '' ? bankIdentify[0].bankName : this.state.bankName,
                                    })
                                }}
                                activeOpacity={.8}
                                style={styles.selectClick}
                            >
                            </TouchableOpacity>
                        </View>
                        <View style={styles.itemBox}>
                            <Text style={styles.title}>卡号</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={"请输入银行卡号"}
                                placeholderTextColor={'#bdbdbd'}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({
                                        bankCardNo: text,
                                    })
                                }}
                            />
                        </View>
                    </View>
                    {/*错误提示文字*/}
                    <Text style={styles.errorText}>{this.state.errorText}</Text>
                    {/*提现说明*/}
                    <View style={styles.explainBox}>
                        <Image source={require('../../images/remind.png')}/>
                        <View style={styles.explainTextBox}>
                            <Text style={styles.explainText}>为了资金安全,只能绑定当前持卡人的银行卡,如需绑定其他持卡人的银行卡,请更换实名信息</Text>
                            <Text style={styles.explainText}>当前仅支持绑定如示储蓄银行卡</Text>
                            <Text style={styles.explainText}>若持卡人与银行卡开户信息不符,提现将原路返回</Text>
                        </View>
                    </View>
                    {/*确定按钮*/}
                    <TouchableOpacity
                        onPress={() => {
                            if (this.state.bankName !== '' && this.state.bankCardNo !== '') {
                                this.bindAccount(this.state.bankName, this.state.bankCardNo);
                            }
                        }}
                        activeOpacity={.8}
                        style={{alignItems: 'center'}}
                    >
                        <View style={[styles.btnBox, {
                            backgroundColor: this.state.bankName && this.state.bankCardNo ? '#566cb7' : "transparent",
                            borderColor: this.state.bankName && this.state.bankCardNo ? '#566cb7' : "#c1cfff"
                        }]}>
                            <Text
                                style={[styles.btnText, {color: this.state.bankName && this.state.bankCardNo ? "#fff" : "#c1cfff"}]}>确定</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                {this.state.bankFlag ?
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                bankFlag: false,
                            })
                        }}
                        style={styles.titleClick}
                    >
                        <TouchableOpacity
                            onPress={() => {
                            }}
                            activeOpacity={1}
                            style={styles.MaskClick}
                        >
                            <View style={styles.titleContent}>
                                <View style={styles.titleBtn}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({bankFlag: false})
                                        }}
                                        activeOpacity={.8}
                                    >
                                        <Text style={styles.textBtn}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                bankFlag: false,
                                                bankName: this.state.selectBankName,
                                            })
                                        }}
                                        activeOpacity={.8}
                                    >
                                        <Text style={styles.textBtn}>确定</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <FlatList
                                style={styles.titleFlatList}
                                data={bankIdentify}
                                initialNumToRender={20}
                                keyExtractor={item => item.bankCode}
                                renderItem={({item}) => this.bankRender(item)}
                                ItemSeparatorComponent={() => {
                                    return (
                                        <View style={{
                                            borderTopWidth: Pixel,
                                            borderTopColor: '#D6E1E8'
                                        }}></View>
                                    )
                                }}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity> : null
                }
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

    bankRender = (item) => {
        let styleView = {backgroundColor: '#fff'};
        let styleText = {color: Colors.selectText};
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        selectBankName: item.bankName,
                    });
                }}
                key={item.bankCode}
                activeOpacity={.8}
            >
                <View style={[styles.secondView, this.state.selectBankName === item.bankName ? styleView : null]}>
                    <Text
                        style={[styles.departmentText, this.state.selectBankName === item.bankName ? styleText : null]}>{item.bankName}</Text>
                    {this.state.selectBankName === item.bankName ?
                        <Image source={require('../../images/pushpin.png')}/> : null}
                </View>
            </TouchableOpacity>
        )
    };

    //  绑定接口 bankCardType银行名 bankCardNo银行卡号
    bindAccount(accountType, accountNumber) {
        let regArr = [];
        for (let i = 0; i < bankIdentify.length; i++) {
            if (bankIdentify[i].bankName === accountType) {
                let patterns = bankIdentify[i].patterns;
                for (let j = 0; j < patterns.length; j++) {
                    if (patterns[j].cardType === "DC") {
                        regArr.push(patterns[j].reg);
                    }
                }
            }
        }
        console.log(regArr)
        console.log(accountNumber)
        for (let i = 0; i < regArr.length; i++) {
            if (regArr[i].test(accountNumber)) {
                this.setState({
                    isLoading: true,
                    loadingText: '绑定中...',
                    errorText: ''
                });
                let formData = new FormData();
                formData.append("bankCardType", accountType);
                formData.append("bankCardNo", accountNumber);
                formData.append("doctorId", UserInfo.doctorId);
                console.log(formData);
                fetch(requestUrl.addBankCard, {
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
                                loadingText: '绑定成功',
                            });
                            setTimeout(() => {
                                this.setState({
                                    isLoading: false,
                                });
                                this.props.navigation.state.params.callback();
                                RouteName.pop();
                                this.props.navigation.goBack();
                            }, 1000)
                        } else if (responseData.status === '2') {
                            this.setState({isLoading: false});
                            this.refs.toast.show('绑定失败,该银行卡已被绑定!');
                        } else if (responseData.status === '3') {
                            this.setState({isLoading: false});
                            this.refs.toast.show('请完善信息');
                        } else {
                            this.setState({isLoading: false});
                            this.refs.toast.show('绑定失败请重试');
                        }
                    })
                    .catch(
                        (error) => {
                            this.setState({isLoading: false,});
                            this.refs.toast.show('绑定失败请稍后重试');
                            console.log('error', error);
                        });
                break;
            } else {
                this.setState({
                    errorText: '发卡行和卡号不匹配'
                })
            }
        }


        // if (accountNumber === '') {
        //     this.refs.toast.show('请输入账号');
        // } else {


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    titleBox: {
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        paddingTop: px2dp(15),
        height: px2dp(37),
    },
    titleText: {
        lineHeight: px2dp(22),
        fontSize: FONT_SIZE(12),
        color: '#212121',
    },
    itemContent: {
        backgroundColor: '#fff',
        paddingLeft: px2dp(15),
    },
    itemBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(50),
        borderBottomColor: '#eeeeee',
    },
    title: {
        width: px2dp(66),
        fontSize: FONT_SIZE(16),
        color: '#757575',
    },
    name: {
        fontSize: FONT_SIZE(16),
        color: '#bdbdbd',
    },
    textInput: {
        flex: 1,
        height: px2dp(50),
        color: '#212121',
        paddingLeft: 0,
    },
    //向下箭头
    arrowBelow: {
        position: "absolute",
        top: px2dp(21),
        right: px2dp(15),
    },
    // 下拉选择 事件
    selectClick: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        width: SCREEN_WIDTH - px2dp(15),
        height: px2dp(50),
    },
    // 错误提示
    errorText: {
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        color: '#ff4b4b',
        fontSize: FONT_SIZE(14),
        textAlign: 'center',
        lineHeight: px2dp(43),
    },
    // 提现说明
    explainBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
    },
    // 提现说明文字
    explainTextBox: {
        marginLeft: px2dp(10),
        flex: 1,
    },
    // 提现说明文字
    explainText: {
        color: '#757575',
        fontSize: FONT_SIZE(14),
        lineHeight: px2dp(24),
        marginBottom: px2dp(24),
    },
    // 确定按钮
    btnBox: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: px2dp(38),
        width: px2dp(200),
        height: px2dp(40),
        borderRadius: px2dp(5),
        borderWidth: Pixel,
    },
    btnText: {
        fontSize: FONT_SIZE(16),
    },
//    --------------------------------------------------------------------------------

    titleClick: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.2)',
        height: SCREEN_HEIGHT,
    },
    MaskClick: {
        position: 'absolute',
        bottom: px2dp(0),
        left: 0,
        height: px2dp(250),
    },
    titleContent: {
        width: SCREEN_WIDTH,
    },
    deptTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: px2dp(50),
        backgroundColor: '#fff',
        borderBottomWidth: Pixel,
        borderColor: '#dbdbdb',
    },
    deptTitleText: {
        fontSize: FONT_SIZE(16),
        color: '#757575',
    },
    titleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: px2dp(50),
        backgroundColor: '#fff',
    },
    textBtn: {
        fontSize: FONT_SIZE(16),
        paddingLeft: px2dp(30),
        paddingRight: px2dp(30),
        paddingTop: px2dp(16),
        paddingBottom: px2dp(16),
        color: Colors.selectText,
    },
    titleFlatList: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        flex: 1,
        width: SCREEN_WIDTH,
        height: px2dp(200),
        backgroundColor: '#eeeeee',
        borderTopWidth: 1,
        borderTopColor: '#eee',

    },
    optionText: {
        flex: 1,
        textAlign: 'center',
        fontSize: FONT_SIZE(16),
        paddingTop: px2dp(16),
        paddingBottom: px2dp(16),
        color: '#757575',
    },
    departmentView: {
        height: px2dp(44),
        justifyContent: 'center',
        paddingLeft: px2dp(15),
        borderRightColor: '#bdbdbd',
        borderRightWidth: px2dp(1),
    },
    secondView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: px2dp(44),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
    },
    departmentText: {
        fontSize: FONT_SIZE(16),
        color: '#757575',

    },
    pickerContent: {
        flexDirection: 'row',
        height: px2dp(445),
        backgroundColor: '#fff',
        borderTopWidth: Pixel,
        borderTopColor: '#eee',
    },
    pickerFlatList: {
        flex: 1,
        width: SCREEN_WIDTH / 2,
        backgroundColor: '#eee',
    },
    departmentClick: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,.2)',
        height: SCREEN_HEIGHT,
    }

});
