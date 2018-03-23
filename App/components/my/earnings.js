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
import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import px2dp from "../../common/Tool";

export default class Earnings extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            priceColor: true,//true为正
            balance: '',// 余额
            totalRevenue: '',// 累计收益
            paymentPassword: '',// 开启支付 1No 0Yes
            status: '',// 认证状态
            statusText: '',
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
        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params.data;
            this.setState({
                status: data.status,// 认证状态
                statusText: data.statusText,
            })
        }
    }

    componentDidMount() {
        fetch(requestUrl.getPurse)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData)
                if (responseData.status === '10') {
                    this.props.navigation.navigate('Login');
                } else if (responseData.status === '0') {
                    this.setState({
                        balance: responseData.purse.balance,// 余额
                        totalRevenue: responseData.purse.totalRevenue,// 累计收益
                        paymentPassword: responseData.purse.paymentPassword,// 开启支付 1No 0Yes
                    });
                    UserInfo.payment = responseData.purse.paymentPassword;
                } else {

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
                         'title': '收益',
                         rightBtn: {type: 'false'}
                     }}/>
                <View style={styles.balanceBox}>
                    <Text style={styles.balanceText}>余额</Text>
                    <Text style={styles.balanceNum}>¥{this.state.balance}</Text>
                </View>
                <ScrollView style={styles.NavList}>
                    <TouchableOpacity
                        onPress={() => {
                        }}
                        activeOpacity={1}
                    >
                        <View style={styles.navItem}>
                            <Image source={require('../../images/cumulative.png')}/>
                            <View style={[styles.navBox, {borderBottomWidth: Pixel,}]}>
                                <Text style={styles.navText}>累计诊费收益</Text>
                                <Text style={styles.cumulativeText}>¥{this.state.totalRevenue}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.state.status === '0') {
                                navigate('WithdrawCash', {
                                    data: this.state,
                                    callback: (data) => {
                                        console.log(data);
                                        this.setState({
                                            balance: (this.state.balance * 100 - data * 100) / 100
                                        })
                                    }
                                });
                            } else if (this.state.status === '3') {
                                this.refs.toast.show(this.state.statusText)
                            } else {
                                Alert.alert('', '您还未认证，去认证?', [
                                    {
                                        text: '取消', onPress: () => {
                                        }
                                    },
                                    {
                                        text: '确认', onPress: () => {
                                            navigate('AttestationOne');
                                        }
                                    },
                                ])
                            }
                        }}
                        activeOpacity={.8}
                    >
                        <View style={styles.navItem}>
                            <Image source={require('../../images/carry.png')}/>
                            <View style={[styles.navBox, {borderBottomWidth: Pixel,}]}>
                                <Text style={styles.navText}>去提现</Text>
                                <Image source={require('../../images/arrow_gray_right.png')}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.state.status === '0') {
                                navigate('IncomeList');
                            } else if (this.state.status === '3') {
                                this.refs.toast.show(this.state.statusText)
                            } else {
                                Alert.alert('', '您还未认证，去认证?', [
                                    {
                                        text: '取消', onPress: () => {
                                        }
                                    },
                                    {
                                        text: '确认', onPress: () => {
                                            navigate('AttestationOne');
                                        }
                                    },
                                ])
                            }
                        }}
                        activeOpacity={.8}
                    >
                        <View style={styles.navItem}>
                            <Image source={require('../../images/detail.png')}/>
                            <View style={[styles.navBox, {borderBottomWidth: Pixel,}]}>
                                <Text style={styles.navText}>查看收益明细</Text>
                                <Image source={require('../../images/arrow_gray_right.png')}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {

                            if (this.state.status === '0') {
                                navigate('Manage');
                            } else if (this.state.status === '3') {
                                this.refs.toast.show(this.state.statusText)
                            } else {
                                Alert.alert('', '您还未认证，去认证?', [
                                    {
                                        text: '取消', onPress: () => {
                                        }
                                    },
                                    {
                                        text: '确认', onPress: () => {
                                            navigate('AttestationOne');
                                        }
                                    },
                                ])
                            }
                        }}
                        activeOpacity={.8}
                    >
                        <View style={styles.navItem}>
                            <Image source={require('../../images/manage.png')}/>
                            <View style={styles.navBox}>
                                <Text style={styles.navText}>提现管理</Text>
                                <Image source={require('../../images/arrow_gray_right.png')}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {IPhoneX ? <View style={{height: 34,}}></View> : null}
                </ScrollView>
                <TouchableOpacity
                    activeOpacity={.8}
                    onPress={() => {
                        navigate('Problem')
                    }}
                >
                    <Text style={styles.FAQ}>常见问题</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EFEFEF',
        flex: 1,
        // height: IOS ? 0 : StatusBar.currentHeight,
        // borderWidth: Pixel,
    },
    // 余额
    balanceBox: {
        height: px2dp(130),
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceText: {
        fontSize: FONT_SIZE(14),
        color: '#212121',
    },
    balanceNum: {
        // marginTop: px2dp(10),
        fontSize: FONT_SIZE(30),
        fontWeight: '500',
        color: '#212121',
    },
    // 跳转列表
    NavList: {
        flex: 1,
    },
    // 跳转item
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(50),
        paddingLeft: px2dp(15),
        backgroundColor: '#fff',
    },
    navBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: px2dp(15),
        height: px2dp(50),
        paddingRight: px2dp(15),
        borderBottomColor: '#dbdbdb',
    },
    navText: {
        fontSize: FONT_SIZE(16),
        color: '#212121',
    },
    // 累计收益
    cumulativeText: {
        fontSize: FONT_SIZE(16),
        color: '#f08058'
    },

    //常见问题
    FAQ: {
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingTop: px2dp(28),
        paddingBottom: IPhoneX ? px2dp(72) : px2dp(38),
        fontSize: FONT_SIZE(14),
        color: '#898989',
    }
});
