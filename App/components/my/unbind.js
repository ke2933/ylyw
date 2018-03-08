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
import px2dp from "../../common/Tool";
//按钮

export default class manage extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            loadingText: '加载中...',
            bankId: '', // id
            bankCardType: '',// 卡行
            bankCardNo: '', // 卡号
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

    componentDidMount() {
        fetch(requestUrl.findBankCard)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({isLoading: false});
                if (responseData.status === '10') {
                    this.props.navigation.navigate('Login');
                } else if (responseData.status === '0') {
                    this.setState({
                        isLoading: false,
                        bankId: responseData.doctorBankCard.id, // id
                        bankCardType: responseData.doctorBankCard.bankCardType,// 卡行
                        bankCardNo: '**** **** **** ' + responseData.doctorBankCard.bankCardNo.substr(-4), // 卡号
                    })
                } else {
                    this.setState({isLoading: false,});
                    this.refs.toast.show('查询卡信息失败，请重试');
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                    console.log('error', error);
                    this.refs.toast.show('查询卡信息失败，请稍后重试');
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
                         'title': "银行卡管理",
                         rightBtn: {type: 'false'}
                     }}
                />
                <ScrollView style={{flex: 1}}>
                    {/*解绑银行卡*/}
                    <View style={styles.titleBox}>
                        <Text style={styles.titleText}>提现银行卡</Text>
                    </View>
                    <View style={styles.itemContent}>
                        <View style={[styles.itemBox, {borderBottomWidth: Pixel,}]}>
                            <Text style={styles.title}>发卡行</Text>
                            <Text style={styles.bankText}>{this.state.bankCardType}</Text>
                        </View>
                        <View style={[styles.itemBox, {borderBottomWidth: Pixel,}]}>
                            <Text style={styles.title}>卡号</Text>
                            <Text style={styles.bankText}>{this.state.bankCardNo}</Text>
                        </View>
                    </View>
                    {/*解绑按钮*/}
                    <TouchableOpacity
                        onPress={() => {
                            this.removeAccount(this.state.bankId);
                        }}
                        activeOpacity={.8}
                        style={{alignItems: 'center'}}
                    >
                        <View style={styles.btnBox}>
                            <Text style={styles.btnText}>解绑</Text>
                        </View>
                    </TouchableOpacity>
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

    // 删除绑定
    removeAccount(bankId) {
        this.setState({isLoading: true, loadingText: '解绑中...'});
        let formData = new FormData();
        formData.append("id", bankId);
        console.log(formData);
        fetch(requestUrl.unbundlingBankCard, {
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
                        loadingText: '解绑成功',
                    });
                    setTimeout(() => {
                        this.setState({
                            isLoading: false,
                        });
                        this.props.navigation.state.params.callback();
                        RouteName.pop();
                        this.props.navigation.goBack();
                    }, 1000)
                } else {
                    this.setState({
                        loadingText: "解绑失败"
                    })
                    setTimeout(() => {
                        this.setState({isLoading: false,});
                    }, 1000)
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                    this.refs.toast.show('绑定失败请稍后重试');
                    console.log('error', error);
                });
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
        paddingRight: px2dp(15),
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
    // 银行卡信息
    bankText: {
        fontSize: px2dp(16),
        color: '#212121',
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
        backgroundColor: '#566cb7',
        borderColor: '#566cb7'

    },
    btnText: {
        fontSize: FONT_SIZE(16),
        color: "#fff",
    },

});
