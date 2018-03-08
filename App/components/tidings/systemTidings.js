import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    FlatList,
    Image,
    AsyncStorage,
    DeviceEventEmitter,
    AppState,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Button from '../../common/Button';//按钮
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import px2dp from "../../common/Tool";

export default class systemTidings extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isRefresh: false,
            systemArr: [],
            isLoading: false,
        }
    }

    componentWillMount() {
        AppState.addEventListener('change', this.AppStateChange);
        // 获取订单消息记录
        AsyncStorage.getItem(UserInfo.doctorId+'SIArr').then((result) => {
            if (result) {
                let temp = JSON.parse(result).lists;
                if (temp) {
                    this.setState({
                        systemArr: temp,
                    })
                }
            }
        });
        // 接管首页消息接听
        DeviceEventEmitter.emit('receive', {type: 'SI', flag: true});
        DeviceEventEmitter.addListener('message', (data) => {
            switch (data.type) {
                case 'CI':// 聊天消息
                    let CIArr = {count: 0};
                    AsyncStorage.getItem(UserInfo.doctorId+'CIArr').then((result) => {
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
                        AsyncStorage.setItem(UserInfo.doctorId+'CIArr', JSON.stringify(CIArr)).then(() => {
                            console.log('成功');
                        }).catch((error) => {
                            console.log('失败');
                        });
                    });
                    break;
                case 'OI':// 订单消息
                    let OIArr = {"count": 0,"lists": []};
                    AsyncStorage.getItem(UserInfo.doctorId+'OIArr').then((result) => {
                        if (result) {
                            OIArr = JSON.parse(result);
                        } else {
                            OIArr = {"count": 0,"lists": []};
                        }
                        OIArr.lists.unshift(data);
                        OIArr.count += 1;
                        AsyncStorage.setItem(UserInfo.doctorId+'OIArr', JSON.stringify(OIArr)).then(() => {
                            console.log('成功');
                        }).catch((error) => {
                            console.log('失败');
                        });
                    });
                    break;
                case 'LG':// 系统消息
                    DeviceEventEmitter.emit('receive', {type: 'SI', flag: false});
                    let _temp = {count: 0, lists: this.state.systemArr};
                    AsyncStorage.setItem(UserInfo.doctorId+'SIArr', JSON.stringify(_temp)).then(() => {
                        console.log('成功');
                    }).catch((error) => {
                        console.log('失败');
                    });
                    Alert.alert('', '您的账号在其他设备登陆', [
                        {text: '确认', onPress: () => {Obj.this.props.navigation.navigate('Login');}},
                    ]);
                    break;
                case 'DOI':// 系统消息
                    AsyncStorage.getItem(UserInfo.doctorId+'CIArr').then((result) => {
                        if (result) {
                            let CIArr = JSON.parse(result);
                            if (CIArr && CIArr[data.messageContent]) {
                                CIArr.count -= CIArr[data.messageContent].length;
                                GroupNum -= CIArr[data.messageContent].length;
                                CIArr[data.messageContent].splice(0, CIArr[data.consultationId].length);
                                console.log(CIArr);
                                AsyncStorage.setItem(UserInfo.doctorId+'CIArr', JSON.stringify(CIArr)).then(() => {
                                    console.log('成功');
                                }).catch((error) => {
                                    console.log('失败');
                                });
                            }
                        }
                    });
                    break;
                case 'OSI':// 认证审核通过
                    fetch(requestUrl.oauthStatus)
                        .then((response) => response.json())
                        .then((responseData) => {
                            console.log(responseData);
                            this.setState({isLoading: false});
                            if (responseData.status === '10') {
                                this.props.navigation.navigate('Login');
                            } else {
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

                            }
                        })
                        .catch(
                            (error) => {
                                console.log('error', error);
                            });
                    break;
                case 'SI':// 系统消息
                    let temp = this.state.systemArr;
                    temp.unshift(data);
                    this.setState({
                        systemArr: temp,
                    });
                    break;
                default:
                    break;
            }
        })


    }

    AppStateChange = (nextAppState) => {
        if (nextAppState === 'inactive' || nextAppState === 'background') {
            AsyncStorage.setItem(UserInfo.doctorId+'SIArr', JSON.stringify(this.state.systemArr)).then(() => {
                console.log('成功');
            }).catch((error) => {
                console.log('失败');
            });

            DeviceEventEmitter.emit('receive', {type: 'SI', flag: false});
        }
    };

    componentWillUnmount() {
        // 退出时 保存数据
        let temp = {count: 0, lists: this.state.systemArr};
        AsyncStorage.setItem(UserInfo.doctorId+'SIArr', JSON.stringify(temp)).then(() => {
            console.log('成功');
        }).catch((error) => {
            console.log('失败');
        });
        DeviceEventEmitter.emit('receive', {type: 'SI', flag: false});
        AppState.removeEventListener('change', this.AppStateChange);
    }
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.FlatListStyle}
                    data={this.state.systemArr}
                    ItemSeparatorComponent={() => {
                        return (<View style={{height:px2dp(10)}}></View>)
                    }} // 分割线
                    initialNumToRender={20}//首批渲染数量
                    keyExtractor={item => item.id}
                    renderItem={({item}) => this.renderItem(item)}
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
            </View>
        );
    }

    renderItem = (item) => {
        let str = '';
        let temp = item.createTime;
        let _data = temp.split(' ')[0];
        let _time = temp.split(' ')[1];
        let year = _data.split('-')[0];
        let month = _data.split('-')[1];
        let day = _data.split('-')[2];
        let newDate = new Date();
        let newYear = newDate.getFullYear() + '';
        let newMonth = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1 + '';
        let newDay = newDate.getDate() > 0 ? '0' + newDate.getDate() : newDate.getDate() + '';
        if (day === newDay && month === newMonth && year === newYear) {
            str = '今天 ' + _time;
        } else {
            str = _data;
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
    // fetchData(Unread) {
    //     this.setState({isLoading: true,});
    //     let url = `${requestUrl.getSysInform}?countNo=${Unread}`;
    //     fetch(url)
    //         .then((response) => response.json())
    //         .then((responseData) => {
    //             this.setState({isLoading: false,});
    //
    //             if (responseData.doctorInformList.length >= this.state.pageSize) {
    //                 this.setState({
    //                     doctorInformList: responseData.doctorInformList,
    //                     isRefresh: false,
    //                     dataFlag: true,
    //                 });
    //             } else {
    //                 this.setState({
    //                     doctorInformList: responseData.doctorInformList,
    //                     isRefresh: false,
    //                     dataFlag: false,
    //                 });
    //             }
    //
    //         })
    //         .catch(
    //             (error) => {
    //                 this.setState({isLoading: true,});
    //
    //                 console.log('error', error);
    //             });
    // }
    //
    // onEndReached() {
    //     if (this.state.dataFlag) {
    //         let tempNo = this.state.pageNo * 1 + 1 + '';
    //         this.setState({
    //             pageNo: tempNo,
    //         });
    //         this.fetchMoreData(tempNo);
    //     }
    // }
    //
    // fetchMoreData(PageNo) {
    //     this.setState({isLoading: true,});
    //
    //     let url = `${requestUrl.getSysInformHistory}?pageNo=${PageNo}&pageSize=${this.state.pageSize}`;
    //     fetch(url)
    //         .then((response) => response.json())
    //         .then((responseData) => {
    //             this.setState({isLoading: false,});
    //
    //             if (responseData.doctorInformList.length >= this.state.pageSize) {
    //                 let temp = this.state.doctorInformList;
    //                 temp = temp.concat(responseData.doctorInformList);
    //                 this.setState({
    //                     doctorInformList: temp,
    //                     isRefresh: false,
    //                     dataFlag: true,
    //                 })
    //             } else {
    //                 let temp = this.state.doctorInformList;
    //                 temp = temp.concat(responseData.doctorInformList);
    //                 this.setState({
    //                     doctorInformList: temp,
    //                     isRefresh: false,
    //                     dataFlag: false,
    //                 });
    //             }
    //         })
    //         .catch(
    //             (error) => {
    //                 this.setState({isLoading: true,});
    //
    //                 console.log('error', error);
    //             });
    // }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
    },
    tidingsBox: {
        justifyContent: 'center',
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        borderRadius: px2dp(10),
        backgroundColor: '#fff',
    },
    tidingsTop:{
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
    FlatListStyle: {
        marginTop: px2dp(10),
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
