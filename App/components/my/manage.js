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
            isLoading: false,
            loadingText: '加载中...',
            passFlag: false,
            bankFlag: false,
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
        if (UserInfo.payment === '0') {
            this.setState({
                passFlag: false,
            })
        } else {
            this.setState({
                passFlag: true,
            })
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
                        bankFlag: true,
                    })
                } else if(responseData.status === '1'){
                    this.setState({
                        bankFlag: false,
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
                         'title': '提现管理',
                         rightBtn: {type: 'false'}
                     }}
                />
                <ScrollView style={{flex: 1}}>
                    {/*绑定银行卡*/}
                    <View style={{marginTop: px2dp(10)}}>
                        {this.state.bankFlag ?
                            <TouchableOpacity
                                onPress={() => {
                                    navigate('Unbind',{
                                        'callback': ()=>{
                                            this.setState({
                                                bankFlag: false,
                                            })
                                        }
                                    })

                                }}
                                activeOpacity={.8}
                            >
                                <View style={styles.itemContent}>
                                    <Image style={styles.itemImg} source={require('../../images/enable.png')}/>
                                    <View style={styles.itemBox}>
                                        <Text style={styles.itemText}>银行卡管理</Text>
                                        <Image source={require('../../images/arrow_gray_right.png')}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => {
                                    navigate('TiedCard',{
                                        'callback': () => {
                                            this.setState({
                                                bankFlag: true,
                                            })
                                        }
                                    });
                                }}
                                activeOpacity={.8}
                            >
                                <View style={styles.itemContent}>
                                    <Image style={styles.itemImg} source={require('../../images/enable.png')}/>
                                    <View style={styles.itemBox}>
                                        <Text style={styles.itemText}>绑定银行卡</Text>
                                        <Image source={require('../../images/arrow_gray_right.png')}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>

                    {this.state.passFlag ?
                        <View style={styles.itemContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigate('PayPass', {
                                        'title': '设置支付密码',
                                        'callback': (data) => {
                                            this.setState({
                                                passFlag: data,
                                            })
                                        }
                                    })
                                }}
                                activeOpacity={.8}
                            >
                                <View style={styles.itemContent}>
                                    <Image style={styles.itemImg} source={require('../../images/enable.png')}/>
                                    <View style={styles.itemBox}>
                                        <Text style={styles.itemText}>启用支付密码</Text>
                                        <Image source={require('../../images/arrow_gray_right.png')}/>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.itemContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigate('CheckPayPass');
                                }}
                                activeOpacity={.8}
                            >
                                <View style={styles.itemContent}>
                                    <Image style={styles.itemImg} source={require('../../images/enable.png')}/>
                                    <View style={[styles.itemBox, {borderBottomWidth: Pixel,}]}>
                                        <Text style={styles.itemText}>修改支付密码</Text>
                                        <Image source={require('../../images/arrow_gray_right.png')}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            < TouchableOpacity
                                onPress={() => {
                                    navigate('Validate');
                                }}
                                activeOpacity={.8}
                            >
                                <View style={styles.itemContent}>
                                    <Image style={styles.itemImg} source={require('../../images/forget.png')}/>
                                    <View style={styles.itemBox}>
                                        <Text style={styles.itemText}>忘记支付密码</Text>
                                        <Image source={require('../../images/arrow_gray_right.png')}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                    {IPhoneX ? <View style={{height: 34,}}></View> : null}
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
        )
            ;
    }



    // 删除绑定
    removeAccount(accoundType) {
        this.setState({isLoading: true, loadingText: '解绑中...'});
        fetch(requestUrl.removeAccount + '?accoundType=' + accoundType)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '10') {
                    this.props.navigation.navigate('Login');
                } else if (responseData.status === '0') {
                    this.setState({loadingText: '解绑成功'});
                    setTimeout(() => {
                        if (responseData.type === '支付宝') {
                            this.setState({
                                isLoading: false,
                                accountALi: false,
                                aLiId: '',
                            })
                        } else if (responseData.type === '微信') {
                            this.setState({
                                isLoading: false,
                                accountWeChat: false,
                                weChatId: '',
                            })
                        }
                    }, 1000);
                } else {
                    this.setState({isLoading: false});
                    this.refs.toast.show('删除失败');
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
    itemContainer: {
        marginTop: px2dp(10),
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(50),
        backgroundColor: '#fff',
    },
    itemBox: {
        flex: 1,
        height: px2dp(50),
        paddingRight: px2dp(15),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#eeeeee',
    },
    itemText: {
        fontSize: px2dp(16),
        color: '#212121',
    },
    itemImg: {
        marginLeft: px2dp(18),
        marginRight: px2dp(16),
    },
    // 账户卡片
    accountCard: {
        marginTop: px2dp(25),
        marginLeft: px2dp(10),
        marginRight: px2dp(10),
        borderRadius: px2dp(10),
        overflow: 'hidden',
    },
    accountCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(45),
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
    },
    accountCardTitle: {
        marginLeft: px2dp(10),
        color: '#fff',
        fontSize: FONT_SIZE(16),
    },

    accountCardBottom: {
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    // 删除 btn
    delBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: px2dp(15),
        width: px2dp(170),
        height: px2dp(30),
        borderRadius: px2dp(5),
        borderColor: '#ff4b4b',
        borderWidth: Pixel,
    },
    delText: {
        fontSize: FONT_SIZE(14),
        color: '#ff4b4b',
    },
    // 绑定 btn
    bindBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: px2dp(15),
        width: px2dp(170),
        height: px2dp(30),
        borderRadius: px2dp(5),
        borderColor: '#566cb7',
        borderWidth: Pixel,
    },
    bindText: {
        fontSize: FONT_SIZE(14),
        color: '#566cb7',
    },
    accountCardBox: {
        height: px2dp(65),
        alignItems: 'center',
        justifyContent: 'center',
    },
    accountCardText: {
        fontSize: FONT_SIZE(20),
    },
    accountCardInput: {
        width: SCREEN_WIDTH - px2dp(30),
        textAlign: 'center',
        height: px2dp(65),
        fontSize: FONT_SIZE(20),
    },

});
