import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    BackHandler,
    StatusBar,
    DeviceEventEmitter,
    AsyncStorage,
    Keyboard,
    AppState,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import {Global} from '../../common/Global';
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import Loading from '../../common/Loading';
import Banner from '../../common/Banner';
import Orientation from 'react-native-orientation';
import px2dp from "../../common/Tool";
import PushNotification from 'react-native-push-notification';

export default class home extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.homeFlag = true;
        this.state = {
            oauthStatus: '',//0未认证 1认证一步 2审核 3认证
            systemTidings: 0,
            orderTidings: 0,
            groupTidings: 0,
            isLoading: true,
            loadingText: '',
            doctorDetailId: '',
            receiveFlag: false,
            TIFlag: false,
            pushFlag: false,
            // OIFlag: false,
            // SIFlag: false,
        }
    }

    getId() {
        fetch(requestUrl.getId)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '10') {
                    RouteName.splice(0, RouteName.length);
                    this.props.navigation.navigate('Login');
                } else {
                    this.setState({
                        isLoading: false,
                    });
                    UserInfo.doctorId = responseData.doctorId;
                    if (!WS.flag) {
                        WS.flag = true;
                        WS.fn(requestUrl.WS + '/websocket/chat?doctorDetailId=' + responseData.doctorId);
                    }
                    WS.ws.onmessage = (e) => {
                        console.log(JSON.parse(e.data));
                        let data = JSON.parse(e.data);
                        // 接收并处理未读消息
                        switch (data.type) {
                            case 'CI':// 聊天消息
                                if (Android && this.state.pushFlag) {
                                    PushNotification.localNotificationSchedule({
                                        message: data.messageContent ? data.messageContent : "您收到一条消息，请查看", // (required)
                                        date: new Date() //
                                    });
                                }
                                let CIArr = {count: 0};
                                AsyncStorage.getItem(UserInfo.doctorId + 'NoCIArr').then((result) => {
                                    if (result) {
                                        CIArr = JSON.parse(result);
                                    } else {
                                        CIArr.count = 0;
                                    }
                                    if (CIArr[data.chatRoomId]) {
                                        CIArr[data.chatRoomId].push(data);
                                        CIArr.count += 1;
                                    } else {
                                        let temp = [];
                                        temp.push(data);
                                        let key = data.chatRoomId;
                                        CIArr[key] = temp;
                                        CIArr.count += 1;
                                    }
                                    this.setState({
                                        groupTidings: CIArr.count,
                                    });
                                    GroupNum = CIArr.count;
                                    AsyncStorage.setItem(UserInfo.doctorId + 'NoCIArr', JSON.stringify(CIArr)).then(() => {
                                        DeviceEventEmitter.emit('Tidings', '首页推送');
                                        DeviceEventEmitter.emit('Chat', '首页推送');
                                        console.log('成功');
                                    }).catch((error) => {
                                        console.log('失败');
                                    });
                                });
                                break;
                            case 'OI':// 订单消息
                                if (Android && this.state.pushFlag) {
                                    PushNotification.localNotificationSchedule({
                                        message: data.informContent ? data.informContent : "您收到一条订单消息，请查看", // (required)
                                        date: new Date() //
                                    });
                                }
                                let OIArr = {"count": 0, "lists": []};
                                AsyncStorage.getItem(UserInfo.doctorId + 'OIArr').then((result) => {
                                    if (result) {
                                        OIArr = JSON.parse(result);
                                    } else {
                                        OIArr = {"count": 0, "lists": []};
                                    }
                                    OIArr.lists.unshift(data);
                                    OIArr.count += 1;
                                    this.setState({
                                        orderTidings: OIArr.count,
                                    });
                                    OrderNum = OIArr.count;
                                    AsyncStorage.setItem(UserInfo.doctorId + 'OIArr', JSON.stringify(OIArr)).then(() => {
                                        DeviceEventEmitter.emit('Tidings', '首页推送');
                                        console.log('成功');
                                    }).catch((error) => {
                                        console.log('失败');
                                    });
                                });
                                break;
                            case 'SI':// 系统消息
                                if (Android && this.state.pushFlag) {
                                    PushNotification.localNotificationSchedule({
                                        message: data.informContent ? data.informContent : "您收到一条系统消息，请查看", // (required)
                                        date: new Date() //
                                    });
                                }
                                let SIArr = {"count": 0, "lists": []};
                                AsyncStorage.getItem(UserInfo.doctorId + 'SIArr').then((result) => {
                                    if (result) {
                                        SIArr = JSON.parse(result);
                                    } else {
                                        SIArr = {"count": 0, "lists": []};
                                    }
                                    SIArr.lists.unshift(data);
                                    SIArr.count += 1;
                                    this.setState({
                                        systemTidings: SIArr.count,
                                    });
                                    SystemNum = SIArr.count;
                                    console.log(SystemNum);
                                    AsyncStorage.setItem(UserInfo.doctorId + 'SIArr', JSON.stringify(SIArr)).then(() => {
                                        DeviceEventEmitter.emit('Tidings', '首页推送');
                                        console.log('成功');
                                    }).catch((error) => {
                                        console.log('失败');
                                    });
                                });
                                break;
                            case 'OSI':// 认证审核通过
                                fetch(requestUrl.oauthStatus)
                                    .then((response) => response.json())
                                    .then((responseData) => {
                                        console.log(responseData);
                                        UserInfo.oauthStatus = responseData.status;// 认证状态
                                        this.setState({
                                            oauthStatus: responseData.status,
                                        });
                                        if (responseData.status === '3') {
                                            // 登陆医生信息
                                            fetch(requestUrl.baseInfo)
                                                .then((response) => response.json())
                                                .then((responseData) => {
                                                    console.log(responseData);
                                                    UserInfo.countryId = 'cc9e0348b3c311e7b77800163e08d49b';// 全国id
                                                    UserInfo.doctorId = responseData.id;// 登陆医生id
                                                    UserInfo.areaId = responseData.areaId;// 责任区域id
                                                    UserInfo.cityId = responseData.cityId;// 地区id
                                                    UserInfo.cityName = responseData.cityName;
                                                    UserInfo.deptId = responseData.deptId;
                                                    UserInfo.deptName = responseData.deptName;
                                                    UserInfo.fee = responseData.fee;
                                                    UserInfo.type = responseData.type;// 是否提供会诊服务 1是 0否
                                                })
                                                .catch(
                                                    (error) => {
                                                        this.setState({isLoading: false});
                                                        console.log('error', error);
                                                    });
                                        }

                                        // }
                                    })
                                    .catch(
                                        (error) => {
                                            console.log('error', error);
                                        });
                                console.log(UserInfo);
                                break;
                            case 'LG':// 帐号互冲
                                WS.flag = false;
                                WS.ws.close();
                                AsyncStorage.removeItem('UserPhone').then(() => {
                                    console.log('成功');
                                }).catch((error) => {
                                    console.log('失败');
                                });
                                RouteName.splice(0, RouteName.length);
                                Alert.alert('', '您的账号在其他设备登陆', [
                                    {
                                        text: '确认', onPress: () => {
                                            Obj.this.props.navigation.navigate('Login');
                                        }
                                    },
                                ], {cancelable: false});
                                break;
                            case 'DOI':// 会诊结束清未读聊天记录
                                AsyncStorage.getItem(UserInfo.doctorId + 'CIArr').then((result) => {
                                    if (result) {
                                        let CIArr = JSON.parse(result);
                                        if (CIArr && CIArr[data.messageContent]) {
                                            CIArr.count -= CIArr[data.messageContent].length;
                                            GroupNum -= CIArr[data.messageContent].length;
                                            CIArr[data.messageContent].splice(0, CIArr[data.consultationId].length);
                                            AsyncStorage.setItem(UserInfo.doctorId + 'CIArr', JSON.stringify(CIArr)).then(() => {
                                                console.log('成功');
                                            }).catch((error) => {
                                                console.log('失败');
                                            });
                                        }
                                    }
                                });
                                break;
                            case 'UR':// 未接收的推送信息
                                let chatRoomBeanList = data.chatRoomBeanList;
                                if (chatRoomBeanList.length > 0) {
                                    let CIArr = {count: 0,};
                                    AsyncStorage.getItem(UserInfo.doctorId + 'NoCIArr').then((result) => {
                                        if (result) {
                                            CIArr = JSON.parse(result);
                                            chatRoomBeanList.map((item, index) => {
                                                if (CIArr[item.chatRoomId]) {
                                                    CIArr[item.chatRoomId] = CIArr[item.chatRoomId].concat(item.chatRecordBeanList);
                                                    CIArr.count += item.chatRecordBeanList.length;
                                                } else {
                                                    CIArr[item.chatRoomId] = item.chatRecordBeanList;
                                                    CIArr.count += item.chatRecordBeanList.length;
                                                }
                                            });
                                            this.setState({
                                                groupTidings: CIArr.count,
                                            });
                                            GroupNum = CIArr.count;
                                            AsyncStorage.setItem(UserInfo.doctorId + 'NoCIArr', JSON.stringify(CIArr)).then(() => {
                                                DeviceEventEmitter.emit('Chat', '首页推送');
                                                console.log('成功');
                                            }).catch((error) => {
                                                console.log('失败');
                                            });
                                        } else {
                                            chatRoomBeanList.map((item, index) => {
                                                if (CIArr[item.chatRoomId]) {
                                                    CIArr[item.chatRoomId] = CIArr[item.chatRoomId].concat(item.chatRecordBeanList);
                                                    CIArr.count += item.chatRecordBeanList.length;
                                                } else {
                                                    CIArr[item.chatRoomId] = item.chatRecordBeanList;
                                                    CIArr.count += item.chatRecordBeanList.length;
                                                }
                                            });
                                            this.setState({
                                                groupTidings: CIArr.count,
                                            });
                                            GroupNum = CIArr.count;
                                            AsyncStorage.setItem(UserInfo.doctorId + 'NoCIArr', JSON.stringify(CIArr)).then(() => {
                                                DeviceEventEmitter.emit('Chat', '首页推送');
                                                console.log('成功');
                                            }).catch((error) => {
                                                console.log('失败');
                                            });
                                        }
                                    })
                                }
                                let orderRecordBeanList = data.orderRecordBeanList;
                                if (orderRecordBeanList.length > 0) {
                                    let OIArr = {count: 0, lists: []};
                                    AsyncStorage.getItem(UserInfo.doctorId + 'OIArr').then((result) => {
                                        if (result) {
                                            OIArr = JSON.parse(result);
                                            OIArr.lists = orderRecordBeanList.concat(OIArr.lists);
                                            OIArr.count += orderRecordBeanList.length;
                                        } else {
                                            OIArr.count = orderRecordBeanList.length;
                                            OIArr.lists = orderRecordBeanList;
                                        }
                                        this.setState({orderTidings: OIArr.count});
                                        OrderNum = OIArr.count;
                                        AsyncStorage.setItem(UserInfo.doctorId + 'OIArr', JSON.stringify(OIArr)).then(() => {
                                            DeviceEventEmitter.emit('Tidings', '首页推送');
                                            console.log('成功');
                                        }).catch((error) => {
                                            console.log('失败');
                                        });
                                    })
                                }
                                let sysRecordBeanList = data.sysRecordBeanList;
                                if (sysRecordBeanList.length > 0) {
                                    let SIArr = {count: 0, lists: []};
                                    AsyncStorage.getItem(UserInfo.doctorId + 'OIArr').then((result) => {
                                        if (result) {
                                            SIArr = JSON.parse(result);
                                            SIArr.lists = sysRecordBeanList.concat(SIArr.lists);
                                            SIArr.count += sysRecordBeanList.length;
                                        } else {
                                            SIArr.count = sysRecordBeanList.length;
                                            SIArr.lists = sysRecordBeanList;
                                        }
                                        this.setState({systemTidings: SIArr.count});
                                        SystemNum = SIArr.count;
                                        AsyncStorage.setItem(UserInfo.doctorId + 'SIArr', JSON.stringify(SIArr)).then(() => {
                                            DeviceEventEmitter.emit('Tidings', '首页推送');
                                            console.log('成功');
                                        }).catch((error) => {
                                            console.log('失败');
                                        });
                                    });

                                }
                                break;
                            default:
                                break;
                        }
                    };
                }
            })
            .catch(
                (error) => {
                    this.setState({
                        isLoading: false,
                    });
                    RouteName.splice(0, RouteName.length);
                    this.props.navigation.navigate('Login');
                    console.log('error', error);
                });
    }


    // 监听返回键－绑定事件
    componentWillMount() {
        AppState.addEventListener('change', this.AppStateChange);

        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (token) {
                //  获取到IOS token 发送至后台
                let formData = new FormData();
                formData.append("deviceToken", token.token);
                console.log(formData);
                fetch(requestUrl.initDeviceToken, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((responseData) => {
                        console.log(responseData)
                    })
                    .catch(
                        (error) => {
                            console.log('error', error);
                        });
            },
            onNotification: function (notification) {
                // 接收 APNs 的消息
                console.log('NOTIFICATION:', notification);
            },
            senderID: "YOUR GCM SENDER ID",
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
        Keyboard.dismiss();
        // socket 消息处理
        this.getId();
        // 强制竖屏
        Orientation.lockToPortrait();
        // 返回键监听
        RouteName.splice(0, RouteName.length);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }
        DeviceEventEmitter.addListener("Index", (data) => {
            this.getId();
        });
        // 消息条数处理
        DeviceEventEmitter.addListener('Home', (data) => {
            console.log(data);
            if (this.homeFlag) {
                // 系统消息数
                AsyncStorage.getItem(UserInfo.doctorId + 'SIArr').then((result) => {
                    if (result) {
                        this.setState({
                            systemTidings: JSON.parse(result).count,
                        })
                    }
                });
                // 订单消息数
                AsyncStorage.getItem(UserInfo.doctorId + 'OIArr').then((result) => {
                    if (result) {
                        this.setState({
                            orderTidings: JSON.parse(result).count,
                        })
                    }
                });
                // 聊天数
                AsyncStorage.getItem(UserInfo.doctorId + 'NoCIArr').then((result) => {
                    if (result) {
                        this.setState({
                            groupTidings: JSON.parse(result).count,
                        })
                    }
                });
            }
        });
        // 系统消息数
        AsyncStorage.getItem(UserInfo.doctorId + 'SIArr').then((result) => {
            if (result) {
                this.setState({
                    systemTidings: JSON.parse(result).count,
                })
            }
        });
        // 订单消息数
        AsyncStorage.getItem(UserInfo.doctorId + 'OIArr').then((result) => {
            console.log(result);
            if (result) {
                this.setState({
                    orderTidings: JSON.parse(result).count,
                })
            }
        });
        AsyncStorage.getItem(UserInfo.doctorId + 'NoCIArr').then((result) => {
            console.log(JSON.parse(result));
            if (result) {
                this.setState({
                    groupTidings: JSON.parse(result).count,
                })
            }
        });

        // DeviceEventEmitter.addListener('receive', (data) => {
        //     console.log(data);
        //     if (data.type === 'CI') {
        //         this.setState({
        //             receiveFlag: data.flag,
        //         });
        //     } else if (data.type === 'TI') {
        //         this.setState({
        //             TIFlag: data.flag,
        //         });
        //     }
        //     if (!data.flag) {
        //         AsyncStorage.getItem(UserInfo.doctorId + 'NoCIArr').then((result) => {
        //             if (result) {
        //                 this.setState({
        //                     groupTidings: JSON.parse(result).count,
        //                 });
        //                 GroupNum = JSON.parse(result).count;
        //             }
        //         });
        //         AsyncStorage.getItem(UserInfo.doctorId + 'OIArr').then((result) => {
        //             if (result) {
        //                 this.setState({
        //                     orderTidings: JSON.parse(result).count,
        //                 });
        //                 OrderNum = JSON.parse(result).count;
        //             }
        //         });
        //         AsyncStorage.getItem(UserInfo.doctorId + 'SIArr').then((result) => {
        //             if (result) {
        //                 this.setState({
        //                     systemTidings: JSON.parse(result).count,
        //                 });
        //                 SystemNum = JSON.parse(result).count;
        //             }
        //         });
        //     }
        // });
    }


    componentDidMount() {
        // AsyncStorage.clear();
        // 认证状态
        fetch(requestUrl.oauthStatus)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                UserInfo.oauthStatus = responseData.status;// 认证状态
                this.setState({
                    oauthStatus: responseData.status,
                });
                if (responseData.status === '3') {
                    // 登陆医生信息
                    fetch(requestUrl.baseInfo)
                        .then((response) => response.json())
                        .then((responseData) => {
                            console.log(responseData);
                            UserInfo.countryId = 'cc9e0348b3c311e7b77800163e08d49b';// 全国id
                            UserInfo.doctorId = responseData.id;// 登陆医生id
                            UserInfo.areaId = responseData.areaId;// 责任区域id
                            UserInfo.cityId = responseData.cityId;// 地区id
                            UserInfo.cityName = responseData.cityName;
                            UserInfo.deptId = responseData.deptId;
                            UserInfo.deptName = responseData.deptName;
                            UserInfo.fee = responseData.fee;
                            UserInfo.type = responseData.type;// 是否提供会诊服务 1是 0否
                        })
                        .catch(
                            (error) => {
                                this.setState({isLoading: false});
                                console.log('error', error);
                            });
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
    }

    AppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            this.setState({
                pushFlag: false,
            })
        }else{
            this.setState({
                pushFlag: true,
            })
        }
    }

    // 监听返回键－解除绑定事件
    componentWillUnmount() {
        this.homeFlag = false;
        DeviceEventEmitter.removeAllListeners('Home');
        DeviceEventEmitter.removeAllListeners('Index');
        AppState.removeEventListener('change', this.AppStateChange);
        // DeviceEventEmitter.removeAllListeners('receive');
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>

                {this.state.isLoading ? <Loading text={'加载中...'}/> : null}
                <StatusBar//状态栏
                    animated={true}//是否动画
                    hidden={false}//是否隐藏
                    backgroundColor={'#000'}//android 设置状态栏背景颜色
                    translucent={false}//android 设置状态栏是否为透明
                    showHideTransition="fade"//IOS状态栏改变时动画 fade:默认 slide
                    networkActivityIndicatorVisible={this.state.isLoading}
                    statusBarStyle={"default"}//ios:白底黑字  android:黑底白字
                />
                {/*<Banner data={this}/>*/}
                <Banner/>
                <View style={styles.topBox}>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.state.oauthStatus === '0' || this.state.oauthStatus === '1') {
                                // 未认证 认证完成第一步
                                navigate('AttestationOne');
                            } else if (this.state.oauthStatus === '2') {
                                // 审核中
                                navigate('AttestationThree');
                            } else if (this.state.oauthStatus === '3') {
                                // 已经认证
                                navigate('Search', {'api': 'homeSearch'})
                            } else if (this.state.oauthStatus === '4') {
                                Alert.alert('', '系统维护中...')
                            } else if (this.state.oauthStatus === '5') {
                                // 已经认证
                                navigate('AttestationOne')
                            } else {
                                Alert.alert('', '系统维护中...')
                            }
                        }}
                        activeOpacity={0.8}
                    >
                        <View style={styles.searchBox}>
                            <Image source={require('../../images/search.png')} style={styles.searchIcon}/>
                            <Text style={styles.searchText}>搜索医院、科室、医生、疾病</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigate('Tidings', {data: this.state})
                        }}
                        style={{
                            height: px2dp(45),
                            width: px2dp(45),
                            justifyContent: 'center',
                        }}
                        activeOpacity={0.8}
                    >
                        <Image source={require('../../images/tidings_icon.png')} style={styles.xiaoxiIcon}/>
                        {this.state.groupTidings + this.state.orderTidings + this.state.systemTidings > 0 ?
                            <View style={styles.tidingsBox}>
                                <Text
                                    style={styles.tidingsText}>{this.state.groupTidings + this.state.orderTidings + this.state.systemTidings > 99 ? '...' : this.state.groupTidings + this.state.orderTidings + this.state.systemTidings}</Text>
                            </View> : null}
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <ImageBackground
                        source={require('../../images/bg.png')}
                        style={styles.bgImg}
                    >
                        <View style={styles.expertBox}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (this.state.oauthStatus === '0' || this.state.oauthStatus === '1') {
                                        // 未认证 认证完成第一步
                                        navigate('AttestationOne');
                                    } else if (this.state.oauthStatus === '2') {
                                        // 审核中
                                        navigate('AttestationThree');
                                    } else if (this.state.oauthStatus === '3') {
                                        // 已经认证
                                        navigate('Expert');
                                    } else if (this.state.oauthStatus === '4') {
                                        Alert.alert('', '系统维护中...')
                                    } else if (this.state.oauthStatus === '5') {
                                        // 已经认证
                                        navigate('AttestationOne')
                                    } else {
                                        Alert.alert('', '系统维护中...')
                                    }

                                }}
                                activeOpacity={1}
                                style={[styles.clickBox, {
                                    width: px2dp(145),
                                    height: px2dp(110),
                                }]}
                            >
                                <Text style={styles.cloverTitle}>
                                    会诊专家
                                </Text>
                                <Text style={styles.cloverText}>
                                    选择合适的会诊专家
                                </Text>
                                <Image style={styles.cloverImg} source={require('../../images/expert.png')}/>


                            </TouchableOpacity>
                        </View>
                        <View style={styles.bingliBox}>

                            <View style={styles.library}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigate('Library');
                                    }}
                                    activeOpacity={1}
                                    style={[styles.clickBox, {
                                        width: px2dp(145),
                                        height: px2dp(105),
                                    }]}
                                >
                                    <Text style={styles.cloverTitle}>
                                        病例库
                                    </Text>
                                    <Text style={styles.cloverText}>
                                        分享精选会诊案例
                                    </Text>
                                    <Image style={styles.cloverImg}
                                           source={require('../../images/bingli_library.png')}/>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.pool}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigate('Pool');
                                    }}
                                    activeOpacity={1}
                                    style={[styles.clickBox, {
                                        width: px2dp(150),
                                        height: px2dp(105),
                                    }]}
                                >
                                    <Text style={styles.cloverTitle}>
                                        病历池
                                    </Text>
                                    <Text style={styles.cloverText}>
                                        查看亟待会诊的订单
                                    </Text>
                                    <Image style={[styles.cloverImg, {marginLeft: 10}]}
                                           source={require('../../images/bingli_pool.png')}/>

                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.launchBox}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (this.state.oauthStatus === '0' || this.state.oauthStatus === '1') {
                                        // 未认证 认证完成第一步
                                        navigate('AttestationOne');
                                    } else if (this.state.oauthStatus === '2') {
                                        // 审核中
                                        navigate('AttestationThree');
                                    } else if (this.state.oauthStatus === '3') {
                                        // 已经认证
                                        navigate('Launch');
                                    } else if (this.state.oauthStatus === '4') {
                                        Alert.alert('', '系统维护中...')
                                    } else if (this.state.oauthStatus === '5') {
                                        // 已经认证
                                        navigate('AttestationOne')
                                    } else {
                                        Alert.alert('', '系统维护中...')
                                    }
                                }}
                                activeOpacity={1}
                                style={[styles.clickBox, {
                                    width: px2dp(145),
                                    height: px2dp(100),
                                }]}
                            >
                                <Text style={styles.cloverTitle}>
                                    发起会诊
                                </Text>
                                <Text style={styles.cloverText}>
                                    创建一份会诊病历
                                </Text>
                                <Image style={styles.cloverImg} source={require('../../images/launch.png')}/>


                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
                <Toast
                    ref='toast'
                    style={{backgroundColor: '#333333', borderRadius: 10,}}
                    position={'center'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeInDuration={1000}
                    opacity={.8}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    swiperContent: {
        width: SCREEN_WIDTH,
        height: px2dp(220),
    },
    topBox: {
        position: 'absolute',
        top: IOS ? 20 : 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: px2dp(45),
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: px2dp(15),
        width: SCREEN_WIDTH * 0.8,
        height: px2dp(30),
        borderRadius: px2dp(15),
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    searchIcon: {
        width: px2dp(15),
        height: px2dp(15),
        marginRight: px2dp(10),
    },
    searchText: {
        color: "#ffffff",
        fontSize: FONT_SIZE(13),
    },
    xiaoxiIcon: {
        width: px2dp(29),
        height: px2dp(28),
    },
    tidingsBox: {
        position: 'absolute',
        top: px2dp(5),
        right: px2dp(8),
        alignItems: 'center',
        justifyContent: 'center',
        width: px2dp(20),
        height: px2dp(20),
        borderRadius: px2dp(10),
        overflow: 'hidden',
        backgroundColor: 'red',
    },
    tidingsText: {
        fontSize: FONT_SIZE(12),
        color: '#fff',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgImg: {
        width: px2dp(347),
        height: px2dp(347),
    },
    //四叶草
    clickBox: {
        alignItems: 'center',
        // backgroundColor: 'red',
    },
    expertBox: {
        marginTop: px2dp(20),
        alignItems: 'center',
    },
    bingliBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pool: {
        // paddingTop: px2dp(8),
        alignItems: 'center',
    },
    library: {
        alignItems: 'center',
        // paddingTop: px2dp(8),
    },
    launchBox: {
        alignItems: 'center',
    },
    cloverTitle: {
        textAlign: 'center',
        color: '#566cb7',
        fontSize: FONT_SIZE(24),
        backgroundColor: 'transparent',
    },
    cloverText: {
        marginTop: px2dp(5),
        textAlign: 'center',
        color: '#898989',
        fontSize: FONT_SIZE(12),
        backgroundColor: 'transparent',
    },
    cloverImg: {
        marginTop: IOS ? px2dp(18) : px2dp(13),
    }
});
