import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    FlatList,
    Image,
    DeviceEventEmitter,
    BackHandler,
} from 'react-native';
import {Global} from '../../common/Global';
import {requestUrl} from "../../Network/url";
import CountDown from '../../common/CountDown';// 倒计时
import Loading from '../../common/Loading';

export default class selectHospital extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isRefresh: false,
            filterBox: false,
            orderType: '会诊订单',
            status: '全部',
            allSize: '',//总个数
            consultationIngSize: '',//正在会诊个数
            timeOutSize: '',//超时个数
            waitingReplySize: '',//待回复个数
        }
    }

    componentWillMount() {
        // RouteName.push(this.props.navigation.state);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }
        if (OrderType !== '' && Status !== '') {
            this.setState({
                orderType: OrderType,
                status: Status,
            });
            OrderType = '';
            Status = '';
        }
        DeviceEventEmitter.addListener('OrderRefresh', (data) => {
            console.log("jfasldfj")
            this.setState({
                orderType: data.orderType,
                status: data.status,
            });
            this.fetchData(data.orderType, data.status);
            this.orderSize(data.orderType);
        });
    }

    componentDidMount() {
        this.fetchData(this.state.orderType, this.state.status);
        this.orderSize(this.state.orderType);
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('OrderRefresh');
    }

    render() {
        const {navigate, goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
                {this.state.isLoading ? <Loading text={'加载中...'}/> : null}
                <StatusBar//状态栏
                    animated={true}//是否动画
                    hidden={false}//是否隐藏
                    backgroundColor={'#000'}//android 设置状态栏背景颜色
                    translucent={false}//android 设置状态栏是否为透明
                    showHideTransition="fade"//IOS状态栏改变时动画 fade:默认 slide
                    networkActivityIndicatorVisible={this.state.isLoading}//IOS设定网络活动指示器(就是那个菊花)是否显示在状态栏。
                    statusBarStyle={"default"}//ios:白底黑字  android:黑底白字
                />
                <View style={styles.navContent}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({isLoading: true});
                            if (this.state.orderType === '首诊订单') {
                                this.setState({orderType: '会诊订单'});
                                this.orderSize('会诊订单');
                                this.fetchData('会诊订单', this.state.status);
                            } else {
                                this.setState({orderType: '首诊订单'});
                                this.orderSize('首诊订单');
                                this.fetchData('首诊订单', this.state.status);
                            }
                        }}
                        activeOpacity={.8}
                    >
                        <View style={styles.navCenter}>
                            <Text style={styles.navTitle}>{this.state.orderType}</Text>
                            <Image source={require('../../images/switch.png')}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                filterBox: !this.state.filterBox,
                            })
                        }}
                        activeOpacity={.8}
                        style={styles.rightClick}
                    >
                        <View style={styles.navRight}>
                            <Image source={require('../../images/select.png')}/>
                            <Text style={styles.btnText}>筛选</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {this.state.filterBox ? this.filterBoxRender() : null}
                <FlatList
                    style={styles.FlatListStyle}
                    data={this.state.lists}
                    initialNumToRender={20}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => this.renderItem(item)}
                    onRefresh={() => {
                        this.fetchData(this.state.orderType, this.state.status);
                        this.orderSize(this.state.orderType);
                    }}
                    refreshing={this.state.isRefresh}
                    ListEmptyComponent={() => {
                        return (
                            <View style={styles.noDataBox}>
                                <Image source={require('../../images/no_data.png')}/>
                                <Text style={styles.noDataText}>暂无信息</Text>
                            </View>
                        )
                    }}
                />
            </View>
        );
    }

    renderItem = (item) => {
        const {navigate, goBack} = this.props.navigation;
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.state.orderType === '首诊订单') {
                        if (item.statusName === '会诊中') {
                            navigate('OrderInfo', {data: item})
                        } else if (item.statusName === '完善病历') {
                            navigate('OrderPerfect', {data: item})
                        } else if (item.statusName === '待支付') {
                            navigate('FirstPay', {data: item})
                        } else if (item.statusName === '待回复') {
                            navigate('FirstReply', {data: item})
                        } else if (item.statusName === '病历池') {
                            navigate('FirstPool', {data: item})
                        } else if (item.statusName === '会诊超时') {
                            navigate('OrderInfo', {data: item});
                        } else if (item.statusName === '已退款') {
                            navigate('OrderRefund', {data: item})
                        } else if (item.statusName === '会诊结束') {
                            navigate('FirstEnd', {data: item})
                        }
                    } else {
                        if (item.statusName === '会诊中') {
                            navigate('GroupOrderInfo', {data: item})
                        } else if (item.statusName === '完善病历') {
                            navigate('GroupOrderInfo', {data: item})
                        } else if (item.statusName === '待回复') {
                            navigate('GroupReply', {data: item});
                        } else if (item.statusName === '会诊超时') {
                            navigate('GroupOverTimeInfo', {data: item})
                        } else if (item.statusName === '会诊结束') {
                            navigate('GroupEnd', {data: item});
                        }
                    }

                }}
                activeOpacity={.8}
            >
                <View style={styles.orderItem}>
                    <View style={styles.statusBox}>
                        <Text style={styles.statusText}>{item.statusName}</Text>
                    </View>
                    <View style={styles.orderInfo}>
                        <Text style={styles.diseaseName}>{item.diseaseName}</Text>
                        <Text style={styles.patientInfo}>
                            {this.state.orderType === '首诊订单' ? this.state.statusName === '待支付' ? item.name : item.name + '/' + item.sex + '/' + item.age : item.sex + '/' + item.age}
                        </Text>

                    </View>
                    <Text numberOfLines={3} style={styles.consultationReason}>会诊目的：{item.consultationReason}</Text>
                    <View style={styles.bottomBox}>
                        <View style={styles.orderPriceBox}>
                            <Text
                                style={styles.orderPrice}>{item.price === '' ? '¥ -' : `¥${item.price}`}</Text>
                            {item.statusName === '待支付' || item.statusName === '会诊结束' || item.statusName === '会诊超时' || item.statusName === '已退款' ?
                                null :
                                <Text style={styles.orderDownTime}>还剩 <CountDown style={{color: '#333', fontSize: 16,}}
                                                                                 duration={item.duration}
                                                                                 beginTime={item.beginTime}/></Text>}
                        </View>
                        <Image source={require('../../images/arrow_gray_right.png')}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    filterBoxRender() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        filterBox: false,
                    })
                }}
                activeOpacity={.8}
                style={styles.filterClick}
            >
                <TouchableOpacity
                    onPress={() => {
                    }}
                    activeOpacity={1}
                >
                    <View style={styles.selectContent}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({isLoading: true});
                                this.setState({
                                    status: '正在会诊',
                                    filterBox: false,
                                });
                                this.fetchData(this.state.orderType, '正在会诊');
                            }}
                            activeOpacity={.8}
                        >
                            <View
                                style={[styles.selectBox, {backgroundColor: this.state.status === '正在会诊' ? Colors.color : null}]}>
                                <Text
                                    style={[styles.selectText, {color: this.state.status === '正在会诊' ? '#fff' : '#757575'}]}>正在会诊 {this.state.consultationIngSize}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({isLoading: true});
                                this.setState({
                                    status: '待接收',
                                    filterBox: false,
                                });
                                this.fetchData(this.state.orderType, '待接收');
                            }}
                            activeOpacity={.8}
                        >
                            <View
                                style={[styles.selectBox, {backgroundColor: this.state.status === '待接收' ? Colors.color : null}]}>
                                <Text
                                    style={[styles.selectText, {color: this.state.status === '待接收' ? '#fff' : '#757575'}]}>{this.state.orderType === '首诊订单' ? '待接收' : '待回复'} {this.state.waitingReplySize}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({isLoading: true});
                                this.setState({
                                    status: '超时',
                                    filterBox: false,
                                });
                                this.fetchData(this.state.orderType, '超时');
                            }}
                            activeOpacity={.8}
                        >
                            <View
                                style={[styles.selectBox, {backgroundColor: this.state.status === '超时' ? Colors.color : null}]}>
                                <Text
                                    style={[styles.selectText, {color: this.state.status === '超时' ? '#fff' : '#757575'}]}>超时 {this.state.timeOutSize}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({isLoading: true});
                                this.setState({
                                    status: '全部',
                                    filterBox: false,
                                });
                                this.fetchData(this.state.orderType, '全部');
                            }}
                            activeOpacity={.8}
                        >
                            <View
                                style={[styles.selectBox, {backgroundColor: this.state.status === '全部' ? Colors.color : null}]}>
                                <Text
                                    style={[styles.selectText, {color: this.state.status === '全部' ? '#fff' : '#757575'}]}>全部 {this.state.allSize}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    // 获取订单数量
    orderSize(type) {
        let formData = new FormData();
        formData.append("type", type);
        console.log(formData);
        fetch(requestUrl.orderSize, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '2') {
                    this.setState({
                        allSize: 0,
                        consultationIngSize: 0,
                        timeOutSize: 0,
                        waitingReplySize: 0,
                    })
                } else {
                    this.setState({
                        allSize: responseData.allSize,
                        consultationIngSize: responseData.consultationIngSize,
                        timeOutSize: responseData.timeOutSize,
                        waitingReplySize: responseData.waitingReplySize,
                    })
                }

            })
            .catch(
                (error) => {
                    this.setState({isLoading: false});
                    console.log('error', error);
                });
    }

    // 获取订单列表
    fetchData(orderType, type) {
        let formData = new FormData();
        formData.append("type", orderType);
        formData.append("status", type);
        console.log(formData);
        fetch(requestUrl.partake, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({isLoading: false, lists: []});
                console.log(responseData);
                if (responseData.status === '10') {
                    RouteName.splice(0, RouteName.length);
                    this.props.navigation.navigate('Login');
                } else if (responseData.status === '0') {
                    this.setState({
                        lists: responseData.lists,
                    })
                } else if (responseData.status === '2') {
                    this.setState({
                        lists: [],
                    })
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false});
                    console.log('error', error);
                });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    navContent: {
        height: IOS ? 65 : 65 - StatusBarHeight,
        paddingTop: IOS ? 20 : 0,
        backgroundColor: Colors.color,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navCenter: {
        flexDirection: 'row',
        height: 45,
        width: SCREEN_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navTitle: {
        marginRight: px2dp(10),
        fontSize: FONT_SIZE(20),
        color: '#fff',
    },
    rightClick: {
        position: 'absolute',
        top: IOS ? 20 : 0,
        right: 0,
    },
    navRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: px2dp(45),
        paddingRight: px2dp(19),
    },
    btnText: {
        marginLeft: px2dp(5),
        fontSize: FONT_SIZE(14),
        color: '#ffffff',
    },
    // 筛选
    filterClick: {
        position: 'absolute',
        top: IOS ? px2dp(65) : px2dp(65 - StatusBarHeight),
        left: 0,
        flex: 1,
        zIndex: 2,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(0,0,0,.2)',
    },
    selectContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        backgroundColor: '#fff',
        paddingRight: px2dp(15),
        paddingLeft: px2dp(15),
        paddingTop: px2dp(10),
        paddingBottom: px2dp(20),
    },
    selectBox: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: px2dp(10),
        width: px2dp(167),
        height: px2dp(30),
        borderRadius: px2dp(15),
        borderWidth: Pixel,
        borderColor: '#dbdbdb',
    },
    selectText: {
        fontSize: FONT_SIZE(14),
        color: '#757575',
    },

    // 列表
    hospitalFlatList: {
        flex: 1,
    },
    // 带接收
    orderItem: {
        marginTop: px2dp(8),
        marginLeft: px2dp(8),
        marginRight: px2dp(8),
        borderRadius: px2dp(10),
        paddingLeft: px2dp(12),
        paddingTop: px2dp(19),
        paddingRight: px2dp(12),
        backgroundColor: '#fff',
        borderColor: '#e6e6e6',
        borderWidth: Pixel,
    },
    statusBox: {
        position: 'absolute',
        top: px2dp(9),
        right: 0,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        paddingTop: px2dp(5),
        paddingBottom: px2dp(5),
        backgroundColor: '#fff',
        borderColor: '#e6e6e6',
        borderTopWidth: Pixel,
        borderBottomWidth: Pixel,
        borderLeftWidth: Pixel,
        borderTopLeftRadius: px2dp(10),
        borderBottomLeftRadius: px2dp(10),
    },
    statusText: {
        fontSize: FONT_SIZE(13),
        color: '#566CB7',
    },
    orderInfo: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: px2dp(9),
    },
    diseaseName: {
        marginRight: px2dp(13),
        fontSize: FONT_SIZE(19),
        color: '#333',
    },
    patientInfo: {
        fontSize: FONT_SIZE(14),
        color: '#333333',
    },
    consultationReason: {
        marginBottom: px2dp(10),
        fontSize: FONT_SIZE(14),
        color: '#333',
        lineHeight: px2dp(23),
    },
    bottomBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: px2dp(51),
        borderTopWidth: Pixel,
        borderTopColor: '#eeeeee',
    },
    orderPriceBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderPrice: {
        marginRight: px2dp(13),
        fontSize: FONT_SIZE(19),
        color: '#333',
    },
    orderDownTime: {
        fontSize: FONT_SIZE(14),
        color: '#333',
    },
    orderClick: {
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(91),
        height: px2dp(41),
        borderRadius: px2dp(10),
        backgroundColor: '#f08058',
    },
    orderClickText: {
        fontSize: FONT_SIZE(16),
        color: '#FFFEFE',
    },

    // 无数据模块
    noDataBox: {
        flex: 1,
        marginTop: px2dp(150),
        alignItems: 'center',
    },
    noDataText: {
        marginTop: px2dp(20),
        fontSize: FONT_SIZE(16),
        color: '#757575',
    },
});