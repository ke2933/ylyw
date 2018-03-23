import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    BackHandler,
    Image,
    DeviceEventEmitter,
    TouchableOpacity,
    FlatList,
    AsyncStorage,
    AppState,
} from 'react-native';
import Nav from '../../common/Nav';//导航
import {Global} from '../../common/Global';
import {requestUrl} from '../../Network/url';//接口url

// import SystemTidings from './systemTidings';// 系统消息
// import OrderTidings from './orderTidings';// 订单消息
// import GroupTidings from './groupTidings';
import px2dp from "../../common/Tool";
// 会诊互动
const SystemIcon = require('../../images/system_tidings.png');
const SystemEleIcon = require('../../images/system_ele_tidings.png');
const OrderIcon = require('../../images/order_tidings.png');
const OrderEleIcon = require('../../images/order_ele_tidings.png');
const GroupIcon = require('../../images/group_tidings.png');
const GroupEleIcon = require('../../images/group_ele_tidings.png');

class Tiding extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            tabFlag: '1',
            data: '',
            isRefresh: false,
            isLoading: false,
            chatRoomList: [],
            doctorDetailId: '',// 当前医生id
            groupNum: 0,
            orderArr: [],
            orderNum: 0,
            systemArr: [],
            systemNum: 0,
        };
        this.stateFlag = true;
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
        // 数据刷新
        DeviceEventEmitter.addListener('Tidings', (data) => {
            console.log(data);
            if (this.stateFlag) {
                // 获取聊天室列表
                this.ChatRefresh();
                // 获取系统消息记录
                AsyncStorage.getItem(UserInfo.doctorId + 'SIArr').then((result) => {
                    console.log(result);
                    if (result) {
                        let temp = JSON.parse(result).lists;
                        if (temp) {
                            this.setState({
                                systemArr: temp,
                                systemNum: JSON.parse(result).count,
                            })
                        }
                    }
                });
                // 获取订单消息记录
                AsyncStorage.getItem(UserInfo.doctorId + 'OIArr').then((result) => {
                    console.log(result);
                    if (result) {
                        let temp = JSON.parse(result).lists;
                        if (temp) {
                            this.setState({
                                orderArr: temp,
                                orderNum: JSON.parse(result).count,
                            })
                        }
                    }
                });
            }
        });
        // 获取聊天室列表
        this.ChatRefresh();
        // 获取系统消息记录
        AsyncStorage.getItem(UserInfo.doctorId + 'SIArr').then((result) => {
            if (result) {
                let temp = JSON.parse(result).lists;
                if (temp) {
                    this.setState({
                        systemArr: temp,
                        systemNum: JSON.parse(result).count,
                    })
                }
            }
        });
        // 获取订单消息记录
        AsyncStorage.getItem(UserInfo.doctorId + 'OIArr').then((result) => {
            if (result) {
                let temp = JSON.parse(result).lists;
                if (temp) {
                    this.setState({
                        orderArr: temp,
                        orderNum: JSON.parse(result).count,
                    })
                }
            }
        });

        AppState.addEventListener('change', this.AppStateChange);
        // // 接管首页消息接听
        // DeviceEventEmitter.emit('receive', {'type': 'TI', 'flag': true});
        // DeviceEventEmitter.addListener('message', (data) => {
        //     console.log(data);
        //     switch (data.type) {
        //         case 'CI':// 聊天消息
        //             DeviceEventEmitter.emit('Tidings',{});
        //             let CIArr = {count: 0};
        //             AsyncStorage.getItem(UserInfo.doctorId + 'NoCIArr').then((result) => {
        //                 if (result) {
        //                     CIArr = JSON.parse(result);
        //                 } else {
        //                     CIArr.count = 0;
        //                     GroupNum = 0;
        //                 }
        //                 if (CIArr[data.chatRoomId]) {
        //                     CIArr[data.chatRoomId].push(data);
        //                     CIArr.count += 1;
        //                     GroupNum += 1;
        //                 } else {
        //                     let temp = [];
        //                     temp.push(data);
        //                     let key = data.chatRoomId;
        //                     CIArr[key] = temp;
        //                     CIArr.count += 1;
        //                     GroupNum += 1;
        //                 }
        //                 this.setState({
        //                     groupTidings: CIArr.count,
        //                 });
        //                 GroupNum = CIArr.count;
        //                 AsyncStorage.setItem(UserInfo.doctorId + 'NoCIArr', JSON.stringify(CIArr)).then(() => {
        //                     console.log('成功');
        //                 }).catch((error) => {
        //                     console.log('失败');
        //                 });
        //             });
        //             break;
        //         case 'OI':// 订单消息
        //             // if (this.state.orderFlag) {
        //             let temp = this.state.orderArr;
        //             temp.unshift(data);
        //             this.setState({
        //                 orderArr: temp,
        //                 orderNum: this.state.orderNum += 1,
        //             });
        //             // DeviceEventEmitter.emit('OrderRefresh', {'orderType': '会诊订单', 'status': '正在会诊'});
        //             // this.state.orderFlag ? OrderNum = 0 : OrderNum += 1;
        //             // } else {
        //             //     console.log('保存Order')
        //             //     let OIArr = {"count": 0, "lists": []};
        //             //     AsyncStorage.getItem(UserInfo.doctorId+'OIArr').then((result) => {
        //             //         if (result) {
        //             //             OIArr = JSON.parse(result);
        //             //         } else {
        //             //             OIArr = {"count": 0, "lists": []};
        //             //         }
        //             //         OIArr.lists.unshift(data);
        //             //         OIArr.count += 1;
        //             //         OrderNum = OIArr.count;
        //             //         AsyncStorage.setItem(UserInfo.doctorId+'OIArr', JSON.stringify(OIArr)).then(() => {
        //             //             console.log('成功');
        //             //         }).catch((error) => {
        //             //             console.log('失败');
        //             //         });
        //             //     });
        //             // }
        //             break;
        //         case 'LG':// 异地登陆
        //             Alert.alert('', '您的账号在其他设备登陆', [
        //                 {
        //                     text: '确认', onPress: () => {
        //                     Obj.this.props.navigation.navigate('Login');
        //                 }
        //                 },
        //             ]);
        //             WS.ws.onclose = (e) => {
        //                 console.log(e)
        //             };
        //             RouteName.splice(0, RouteName.length);
        //             DeviceEventEmitter.emit('receive', {'type': 'TI', 'flag': false});
        //             let _temp = {count: this.state.orderNum, lists: this.state.orderArr};
        //             AsyncStorage.setItem(UserInfo.doctorId + 'OIArr', JSON.stringify(_temp)).then(() => {
        //                 console.log('成功');
        //             }).catch((error) => {
        //                 console.log('失败');
        //             });
        //             let _tempSi = {count: this.state.systemNum, lists: this.state.systemArr};
        //             AsyncStorage.setItem(UserInfo.doctorId + 'SIArr', JSON.stringify(_tempSi)).then(() => {
        //                 console.log('成功');
        //             }).catch((error) => {
        //                 console.log('失败');
        //             });
        //             break;
        //         case 'OSI':// 认证审核通过
        //             fetch(requestUrl.oauthStatus)
        //                 .then((response) => response.json())
        //                 .then((responseData) => {
        //                     console.log(responseData);
        //                     this.setState({isLoading: false});
        //                     if (responseData.status === '10') {
        //                         this.props.navigation.navigate('Login');
        //                     } else {
        //                         UserInfo.oauthStatus = responseData.status;// 认证状态
        //                         this.setState({
        //                             oauthStatus: responseData.status,
        //                         });
        //                         if (responseData.status === '3') {
        //                             // 登陆医生信息
        //                             fetch(requestUrl.baseInfo)
        //                                 .then((response) => response.json())
        //                                 .then((responseData) => {
        //                                     console.log(responseData);
        //                                     UserInfo.countryId = 'cc9e0348b3c311e7b77800163e08d49b';// 全国id
        //                                     UserInfo.doctorId = responseData.id;// 登陆医生id
        //                                     UserInfo.areaId = responseData.areaId;// 责任区域id
        //                                     UserInfo.cityId = responseData.cityId;// 地区id
        //                                     UserInfo.cityName = responseData.cityName;
        //                                     UserInfo.deptId = responseData.deptId;
        //                                     UserInfo.deptName = responseData.deptName;
        //                                     UserInfo.fee = responseData.fee;
        //                                     UserInfo.type = responseData.type;// 是否提供会诊服务 1是 0否
        //                                 })
        //                                 .catch(
        //                                     (error) => {
        //                                         this.setState({isLoading: false});
        //                                         console.log('error', error);
        //                                     });
        //                         }
        //
        //                     }
        //                 })
        //                 .catch(
        //                     (error) => {
        //                         console.log('error', error);
        //                     });
        //             break;
        //         case 'DOI':// 订单完成，删除聊天记录
        //             AsyncStorage.getItem(UserInfo.doctorId + 'NoCIArr').then((result) => {
        //                 if (result) {
        //                     let CIArr = JSON.parse(result);
        //                     if (CIArr && CIArr[data.messageContent]) {
        //                         CIArr.count -= CIArr[data.messageContent].length;
        //                         GroupNum -= CIArr[data.messageContent].length;
        //                         CIArr[data.messageContent].splice(0, CIArr[data.consultationId].length);
        //                         AsyncStorage.setItem(UserInfo.doctorId + 'NoCIArr', JSON.stringify(CIArr)).then(() => {
        //                             console.log('成功');
        //                         }).catch((error) => {
        //                             console.log('失败');
        //                         });
        //                     }
        //                 }
        //             });
        //             AsyncStorage.getItem(UserInfo.doctorId + 'CIArr').then((result) => {
        //                 if (result) {
        //                     let CIArr = JSON.parse(result);
        //                     if (CIArr && CIArr[data.messageContent]) {
        //                         CIArr[data.messageContent].splice(0, CIArr[data.consultationId].length);
        //                         AsyncStorage.setItem(UserInfo.doctorId + 'CIArr', JSON.stringify(CIArr)).then(() => {
        //                             console.log('成功');
        //                         }).catch((error) => {
        //                             console.log('失败');
        //                         });
        //                     }
        //                 }
        //             });
        //             break;
        //         case 'SI':// 系统消息
        //             // if (this.state.systemFlag) {
        //             let tempSi = this.state.systemArr;
        //             tempSi.unshift(data);
        //             this.setState({
        //                 systemArr: tempSi,
        //                 systemNum: this.state.systemNum += 1,
        //             });
        //             // this.state.systemFlag ? SystemNum = 0 : SystemNum += 1;
        //             // } else {
        //             //     console.log('保存系统');
        //             //     let SIArr = {"count": 0, "lists": []};
        //             //     AsyncStorage.getItem(UserInfo.doctorId+'SIArr').then((result) => {
        //             //         if (result) {
        //             //             SIArr = JSON.parse(result);
        //             //         } else {
        //             //             SIArr = {"count": 0, "lists": []};
        //             //         }
        //             //         SIArr.lists.unshift(data);
        //             //         SIArr.count += 1;
        //             //         SystemNum = SIArr.count;
        //             //         AsyncStorage.setItem(UserInfo.doctorId+'SIArr', JSON.stringify(SIArr)).then(() => {
        //             //             console.log('成功');
        //             //         }).catch((error) => {
        //             //             console.log('失败');
        //             //         });
        //             //     });
        //             // }
        //             break;
        //         default:
        //             break;
        //     }
        // });
        fetch(requestUrl.selectDoctorDetailIdByDoctorId)
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status === '0') {
                    this.setState({
                        doctorDetailId: responseData.doctorDetailId,
                    })
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
        // 获取聊天室列表
        this.ChatRefresh();
    }

    componentWillUnmount() {
        this.stateFlag = false;
        DeviceEventEmitter.emit('Home', '消息列表');
        // 退出时 保存数据
        // let tempOI = {count: this.state.orderNum, lists: this.state.orderArr};
        // AsyncStorage.setItem(UserInfo.doctorId + 'OIArr', JSON.stringify(tempOI)).then(() => {
        //     console.log('成功');
        // }).catch((error) => {
        //     console.log('失败');
        // });
        // let tempSi = {count: this.state.systemNum, lists: this.state.systemArr};
        // AsyncStorage.setItem(UserInfo.doctorId + 'SIArr', JSON.stringify(tempSi)).then(() => {
        //     console.log('成功');
        // }).catch((error) => {
        //     console.log('失败');
        // });
        // DeviceEventEmitter.emit('receive', {type: 'TI', flag: false});
        AppState.removeEventListener('change', this.AppStateChange);
        DeviceEventEmitter.removeAllListeners('Tidings');
    }

    render() {
        const {navigate, goBack} = this.props.navigation;

        return (
            <View style={styles.container}>
                <Nav navigation={this.props.navigation}
                     leftClick={() => {
                         RouteName.pop();
                         goBack();
                     }}
                     data={{
                         'leftBtn': true,
                         'title': '消息',
                         'rightBtn': {type: false}
                     }}/>
                <View style={styles.tabContent}>
                    <TouchableOpacity
                        onPress={() => {
                            this.tabClick('1');
                        }}
                        activeOpacity={.8}
                    >
                        <View style={[styles.tabBox, {borderRightWidth: Pixel}]}>
                            <Image style={styles.tabImg}
                                   source={this.state.tabFlag === '1' ? GroupEleIcon : GroupIcon}/>
                            <Text style={[styles.tabText, {color: this.state.tabFlag === '1' ? '#566cb7' : '#757575'}]}>会诊互动</Text>
                            {this.state.groupNum > 0 ? <View style={styles.unreadBox}>
                                <Text
                                    style={styles.unreadNum}>{this.state.groupNum > 99 ? '...' : this.state.groupNum}</Text>
                            </View> : null}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.tabClick('2');
                        }}
                        activeOpacity={.8}
                    >
                        <View style={[styles.tabBox, {borderRightWidth: Pixel}]}>
                            <Image style={styles.tabImg}
                                   source={this.state.tabFlag === '2' ? OrderEleIcon : OrderIcon}/>
                            <Text style={[styles.tabText, {color: this.state.tabFlag === '2' ? '#566cb7' : '#757575'}]}>订单</Text>
                            {this.state.orderNum > 0 ? <View style={styles.unreadBox}>
                                <Text
                                    style={styles.unreadNum}>{this.state.orderNum > 99 ? '...' : this.state.orderNum}</Text>
                            </View> : null}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.tabClick('3');
                        }}
                        activeOpacity={.8}
                    >
                        <View style={styles.tabBox}>
                            <Image style={styles.tabImg}
                                   source={this.state.tabFlag === '3' ? SystemEleIcon : SystemIcon}/>
                            <Text style={[styles.tabText, {color: this.state.tabFlag === '3' ? '#566cb7' : '#757575'}]}>系统消息</Text>
                            {this.state.systemNum > 0 ? <View style={styles.unreadBox}>
                                <Text
                                    style={styles.unreadNum}>{this.state.systemNum > 99 ? '...' : this.state.systemNum}</Text>
                            </View> : null}
                        </View>
                    </TouchableOpacity>
                </View>
                {this.renderContent()}

            </View>
        );
    }

    tabClick(num) {
        if (num === '2') {
            this.setState({
                tabFlag: num,
                orderFlag: true,
                systemFlag: false,
                orderNum: 0,
            });
            OrderNum = 0;
            let SIArr = {"count": 0, "lists": this.state.orderArr};
            AsyncStorage.setItem(UserInfo.doctorId + 'OIArr', JSON.stringify(SIArr)).then(() => {
                console.log('成功');
            }).catch((error) => {
                console.log('失败');
            });
        } else if (num === '3') {
            this.setState({
                tabFlag: num,
                systemFlag: true,
                orderFlag: false,
                systemNum: 0,
            });
            SystemNum = 0;
            let SIArr = {"count": 0, "lists": this.state.systemArr};
            AsyncStorage.setItem(UserInfo.doctorId + 'SIArr', JSON.stringify(SIArr)).then(() => {
                console.log('成功');
            }).catch((error) => {
                console.log('失败');
            });
        } else if (num === '1') {
            this.setState({
                tabFlag: num,
                orderFlag: false,
                systemFlag: false,
            });
        } else {
            return false;
        }

    }

    renderContent() {
        if (this.state.tabFlag === '1') {
            return (
                <FlatList
                    style={styles.FlatListStyle}
                    data={this.state.chatRoomList}
                    ItemSeparatorComponent={() => {
                        return (<View style={styles.FlatListLine}></View>)
                    }}// 分割线
                    initialNumToRender={20}//首批渲染数量
                    keyExtractor={item => item.id}
                    renderItem={({item}) => this.renderGroupItem(item)}
                    onRefresh={() => {
                        this.setState({
                            isRefresh: true,
                        });
                        this.ChatRefresh();
                    }}
                    refreshing={this.state.isRefresh}//加载图案
                    ListEmptyComponent={() => {
                        return (
                            <View style={styles.noDataBox}>
                                <Image source={require('../../images/no_data.png')}/>
                                <Text style={styles.noDataText}>暂无信息</Text>
                            </View>
                        )
                    }}
                />
            )
        } else if (this.state.tabFlag === '2') {
            return (
                <FlatList
                    style={styles.FlatListStyle}
                    data={this.state.orderArr}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{height: px2dp(10),}}></View>
                        )
                    }}// 分割线
                    initialNumToRender={20}//首批渲染数量
                    keyExtractor={item => item.id}
                    renderItem={({item}) => this.renderOrderItem(item)}
                    onEndReached={() => {
                        // this.onEndReached()
                    }}
                    onEndReachedThreshold={.1}
                    onRefresh={() => {
                        // this.setState({pageNo: '1'});
                        // this.fetchData(this.state.unread);
                    }}
                    refreshing={this.state.isRefresh}//加载图案
                    ListEmptyComponent={() => {
                        return (
                            <View style={styles.noDataBox}>
                                <Image source={require('../../images/no_data.png')}/>
                                <Text style={styles.noDataText}>暂无信息</Text>
                            </View>
                        )
                    }}
                />
            )
        } else if (this.state.tabFlag === '3') {
            return (
                <FlatList
                    style={styles.FlatListStyle}
                    data={this.state.systemArr}
                    ItemSeparatorComponent={() => {
                        return (<View style={{height: px2dp(10)}}></View>)
                    }} // 分割线
                    initialNumToRender={20}//首批渲染数量
                    keyExtractor={item => item.id}
                    renderItem={({item}) => this.renderSystemItem(item)}
                    onEndReached={() => {
                        // this.onEndReached()
                    }}
                    // onEndReachedThreshold={.1}
                    onRefresh={() => {
                        // this.setState({pageNo: '1'});
                        // this.fetchData(this.state.unread);
                    }}
                    refreshing={this.state.isRefresh}//加载图案
                    ListEmptyComponent={() => {
                        return (
                            <View style={styles.noDataBox}>
                                <Image source={require('../../images/no_data.png')}/>
                                <Text style={styles.noDataText}>暂无信息</Text>
                            </View>
                        )
                    }}
                />
            )
        }
    }

    ChatRefresh() {
        fetch(requestUrl.getChatRoom)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({
                    isRefresh: false,
                });
                if (responseData.status === '0') {
                    let chatRoomList = responseData.chatRoomList;
                    chatRoomList.map((item, index) => {
                        AsyncStorage.getItem(UserInfo.doctorId + 'NoCIArr').then((result) => {
                            if (result) {
                                this.setState({
                                    groupNum: JSON.parse(result).count,
                                });
                                let temp = JSON.parse(result)[item.id];
                                if (temp && temp.length > 0) {
                                    item.unreadNum = temp.length;
                                    item.text = temp[temp.length - 1].messageContent;
                                } else {
                                    AsyncStorage.getItem(UserInfo.doctorId + 'CIArr').then((result) => {
                                        if (result) {
                                            let CIArr = JSON.parse(result)[item.id];
                                            if (CIArr && CIArr.length > 0) {
                                                item.text = CIArr[CIArr.length - 1].messageContent;
                                                item.unreadNum = 0;
                                            } else {
                                                item.unreadNum = 0;
                                                item.text = '';
                                            }
                                        } else {
                                            item.unreadNum = 0;
                                            item.text = '';
                                        }
                                    });
                                }
                            } else {
                                AsyncStorage.getItem(UserInfo.doctorId + 'CIArr').then((result) => {
                                    if (result) {
                                        let CIArr = JSON.parse(result)[item.id];
                                        if (CIArr && CIArr.length > 0) {
                                            item.text = CIArr[CIArr.length - 1].messageContent;
                                            item.unreadNum = 0;
                                        } else {
                                            item.unreadNum = 0;
                                            item.text = '';
                                        }
                                    } else {
                                        item.unreadNum = 0;
                                        item.text = '';
                                    }
                                });
                            }
                        });
                    });
                    setTimeout(() => {
                        if (this.stateFlag) {
                            this.setState({
                                chatRoomList: chatRoomList,
                            })
                        }
                    }, 500)
                }
            })
            .catch(
                (error) => {
                    this.setState({isRefresh: false,});
                    console.log('error', error);
                });
    }

    renderGroupItem = (item) => {
        const {navigate, goBack} = Obj.this.props.navigation;
        let doctorDetailList = item.doctorDetailList;
        let userImgArr = [];
        let smallStyle = {width: px2dp(48), height: px2dp(48)};
        for (let i = 0; i < doctorDetailList.length; i++) {
            userImgArr.push(
                <Image key={i} source={{uri: requestUrl.ImgIp + doctorDetailList[i].doctorPhotoPath}}
                       style={[styles.userImg, doctorDetailList.length <= 1 ? smallStyle : null]}/>
            )
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    // DeviceEventEmitter.emit('receive', {type: 'TI', flag: false});
                    navigate('Chat', {data: {"consultationId": item.id}});
                }}
                activeOpacity={.8}
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                }}
            >
                <View style={styles.groupTidingsItem}>
                    <View style={styles.userImgBox}>
                        {userImgArr}
                    </View>
                    <View style={styles.rightBox}>
                        <View style={styles.userNameBox}>
                            <Text style={styles.userName}>{item.roomName}</Text>
                        </View>
                        <Text numberOfLines={1} style={styles.tidingsText}>{item.text}</Text>
                        {item.unreadNum > 0 ? <View style={styles.unreadNumBox}>
                            <Text style={styles.unreadNum}>{item.unreadNum > 99 ? '...' : item.unreadNum}</Text>
                        </View> : null}
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    renderOrderItem = (item) => {
        let str = '';
        let newDate = new Date();
        let newYear = newDate.getFullYear() + '';
        let newMonth = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1 + '';
        let newDay = newDate.getDate() > 0 ? newDate.getDate() + '' : '0' + newDate.getDate() + '';
        if (item.createTime) {
            let temp = item.createTime;
            let _data = temp.split(' ')[0];
            let _time = temp.split(' ')[1];
            _time = _time.split(':')[0] + ':' + _time.split(':')[1];
            let year = _data.split('-')[0] + '';
            let month = _data.split('-')[1] + '';
            let day = _data.split('-')[2] + '';
            if (day === newDay && month === newMonth && year === newYear) {
                str = '今天 ' + _time;
            } else {
                str = _data;
            }
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    // DeviceEventEmitter.emit('receive', {type: 'TI', flag: false});
                    this.selectConsultationById(item.consultationId);
                }}
                activeOpacity={.8}
                key={item.id}
            >
                <View style={styles.tidingsBox}>
                    <View style={styles.tidingsTop}>
                        <Text style={styles.informTitle}>{item.informTitle}</Text>
                        <Text style={styles.createTime}>{str}</Text>
                    </View>
                    <Text style={styles.informContent}>{item.informContent}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    // 通过订单id 获取订单详情
    selectConsultationById(id) {
        let formData = new FormData();
        formData.append("consultationId", id);
        console.log(formData);
        fetch(requestUrl.selectConsultationById, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({isLoading: false});
                if (responseData.consultationDoctorId === UserInfo.doctorId) {
                    // 会诊
                    if (responseData.statusName === '会诊中') {
                        Obj.this.props.navigation.navigate('GroupOrderInfo', {
                            data: {
                                id: id,
                                beginTime: responseData.beginTime,
                                duration: responseData.duration
                            }
                        })
                    } else if (responseData.statusName === '完善病历') {
                        Obj.this.props.navigation.navigate('GroupOrderInfo', {
                            data: {
                                id: id,
                                beginTime: responseData.beginTime,
                                duration: responseData.duration
                            }
                        })
                    } else if (responseData.statusName === '待回复') {
                        Obj.this.props.navigation.navigate('GroupReply', {
                            data: {
                                id: id,
                                beginTime: responseData.beginTime,
                                duration: responseData.duration
                            }
                        });
                    } else if (responseData.statusName === '会诊超时') {
                        Obj.this.props.navigation.navigate('GroupOverTimeInfo', {
                            data: {
                                id: id,
                                beginTime: responseData.beginTime,
                                duration: responseData.duration
                            }
                        })
                    } else if (responseData.statusName === '会诊结束') {
                        Obj.this.props.navigation.navigate('GroupEnd', {
                            data: {
                                id: id,
                                beginTime: responseData.beginTime,
                                duration: responseData.duration
                            }
                        });
                    }
                } else {
                    // 首诊
                    if (responseData.statusName === '会诊中') {
                        Obj.this.props.navigation.navigate('OrderInfo', {
                            data: {
                                id: id,
                                beginTime: responseData.beginTime,
                                duration: responseData.duration
                            }
                        })
                    } else if (responseData.statusName === '完善病历') {
                        Obj.this.props.navigation.navigate('OrderPerfect', {
                            data: {
                                id: id,
                                beginTime: responseData.beginTime,
                                duration: responseData.duration
                            }
                        })
                    } else if (responseData.statusName === '待支付') {
                        Obj.this.props.navigation.navigate('FirstPay', {
                            data: {
                                id: id,
                                beginTime: responseData.beginTime,
                                duration: responseData.duration
                            }
                        })
                    } else if (responseData.statusName === '待回复') {
                        Obj.this.props.navigation.navigate('FirstReply', {
                            data: {
                                id: id,
                                beginTime: responseData.beginTime,
                                duration: responseData.duration
                            }
                        })
                    } else if (responseData.statusName === '病历池') {
                        Obj.this.props.navigation.navigate('FirstPool', {
                            data: {
                                id: id,
                                beginTime: responseData.beginTime,
                                duration: responseData.duration
                            }
                        })
                    } else if (responseData.statusName === '会诊超时') {
                        Obj.this.props.navigation.navigate('OrderInfo', {
                            data: {
                                id: id,
                                beginTime: responseData.beginTime,
                                duration: responseData.duration
                            }
                        });
                    } else if (responseData.statusName === '已退款') {
                        Obj.this.props.navigation.navigate('OrderRefund', {
                            data: {
                                id: id,
                                beginTime: responseData.beginTime,
                                duration: responseData.duration
                            }
                        })
                    } else if (responseData.statusName === '退款中') {
                        Obj.this.props.navigation.navigate('OrderRefund', {
                            data: {
                                id: id,
                                beginTime: responseData.beginTime,
                                duration: responseData.duration
                            }
                        })
                    } else if (responseData.statusName === '会诊结束') {
                        Obj.this.props.navigation.navigate('FirstEnd', {
                            data: {
                                id: id,
                                beginTime: responseData.beginTime,
                                duration: responseData.duration
                            }
                        })
                    }
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false});
                    console.log('error', error);
                });
    }

    renderSystemItem = (item) => {
        let str = '';
        let newDate = new Date();
        let newYear = newDate.getFullYear() + '';
        let newMonth = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1 + '';
        let newDay = newDate.getDate() > 0 ? newDate.getDate() + '' : '0' + newDate.getDate() + '';
        if (item.createTime) {
            let temp = item.createTime;
            let _data = temp.split(' ')[0];
            let _time = temp.split(' ')[1];
            _time = _time.split(':')[0] + ':' + _time.split(':')[1];
            let year = _data.split('-')[0] + '';
            let month = _data.split('-')[1] + '';
            let day = _data.split('-')[2] + '';
            if (day === newDay && month === newMonth && year === newYear) {
                str = '今天 ' + _time;
            } else {
                str = _data;
            }
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    console.log(item.id)
                }}
                activeOpacity={.8}
                key={item.id}
            >
                <View style={styles.tidingsBox}>
                    <View style={styles.tidingsTop}>
                        <Text style={styles.informTitle}>{item.informTitle}</Text>
                        <Text style={styles.createTime}>{str}</Text>
                    </View>
                    <Text style={styles.informContent}>{item.informContent}</Text>
                </View>
            </TouchableOpacity>
        )
    };
    // 后台 或 任务切换
    AppStateChange = (nextAppState) => {
        if (nextAppState === 'inactive' || nextAppState === 'background') {
            // AsyncStorage.setItem(UserInfo.doctorId+'OIArr', JSON.stringify(this.state.orderArr)).then(() => {
            //     console.log('成功');
            // }).catch((error) => {
            //     console.log('失败');
            // });
            // AsyncStorage.setItem(UserInfo.doctorId+'SIArr', JSON.stringify(this.state.systemArr)).then(() => {
            //     console.log('成功');
            // }).catch((error) => {
            //     console.log('失败');
            // });
            let tempOI = {count: this.state.orderNum, lists: this.state.orderArr};
            AsyncStorage.setItem(UserInfo.doctorId + 'OIArr', JSON.stringify(tempOI)).then(() => {
                console.log('成功');
            }).catch((error) => {
                console.log('失败');
            });
            let tempSi = {count: this.state.systemNum, lists: this.state.systemArr};
            AsyncStorage.setItem(UserInfo.doctorId + 'SIArr', JSON.stringify(tempSi)).then(() => {
                console.log('成功');
            }).catch((error) => {
                console.log('失败');
            });
            // DeviceEventEmitter.emit('receive', {type: 'TI', flag: false});
        }
    };
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EFEFEF',
        flex: 1,
    },
    tabContent: {
        flexDirection: 'row',
        paddingTop: px2dp(11),
        paddingBottom: px2dp(11),
        backgroundColor: '#fff',
        borderBottomWidth: Pixel,
        borderBottomColor: '#dbdbdb',
        marginBottom: px2dp(10),
    },
    tabBox: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: SCREEN_WIDTH / 3,
        borderColor: '#dbdbdb',
    },
    tabImg: {
        width: 22,
        height: 22,
    },
    tabText: {
        fontSize: 14,
        color: '#757575',
    },
    unreadBox: {
        position: 'absolute',
        top: 0,
        right: px2dp(45),
        alignItems: 'center',
        justifyContent: 'center',
        width: px2dp(16),
        height: px2dp(16),
        borderRadius: px2dp(8),
        overflow: 'hidden',
        backgroundColor: 'red',
    },
    unreadNum: {
        fontSize: FONT_SIZE(12),
        color: '#fff',
        fontWeight: '500',
    },
    // 会诊互动FlatList
    FlatListLine: {
        height: Pixel,
        backgroundColor: '#d6e1e8',
    },
    // 会诊互动item
    groupTidingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(50),
        marginLeft: px2dp(20),
        marginRight: px2dp(20),
        marginTop: px2dp(15),
        marginBottom: px2dp(15),
    },
    userImgBox: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: px2dp(50),
        height: px2dp(50),
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        borderRadius: px2dp(5),
        padding: px2dp(1),
    },
    userImg: {
        width: px2dp(23),
        height: px2dp(23),
        marginBottom: px2dp(1),
        borderRadius: px2dp(5),
    },
    rightBox: {
        flex: 1,
        marginLeft: px2dp(12),
        height: px2dp(50),
        justifyContent: 'space-between',
    },
    userNameBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userName: {
        lineHeight: px2dp(23),
        fontSize: FONT_SIZE(18),
        color: '#333',
    },
    time: {
        lineHeight: px2dp(23),
        fontSize: FONT_SIZE(14),
        color: '#898989',
    },
    tidingsText: {
        width: px2dp(260),
        fontSize: FONT_SIZE(14),
        color: '#898989',
        lineHeight: px2dp(23),
    },
    unreadNumBox: {
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

    // 订单item
    tidingsBox: {
        justifyContent: 'center',
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        borderRadius: px2dp(10),
        backgroundColor: '#fff',
    },
    tidingsTop: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: px2dp(15),
    },
    informTitle: {
        fontWeight: '500',
        fontSize: FONT_SIZE(16),
        color: '#212121',
    },
    informContent: {
        marginTop: px2dp(12),
        marginBottom: px2dp(18),
        lineHeight: px2dp(20),
        fontSize: FONT_SIZE(14),
        color: '#898989',
    },
    createTime: {
        fontSize: FONT_SIZE(14),
        color: '#bdbdbd',
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

export default Tiding;

