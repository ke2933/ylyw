import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ScrollView,
    RefreshControl,
    Animated,
    Easing,
    DeviceEventEmitter,
    AsyncStorage,
    AppState,
    BackHandler,
    Keyboard,
    KeyboardAvoidingView,
} from 'react-native';

import {requestUrl} from '../Network/url';//接口url
import {RegExp} from '../Network/RegExp';//正则
import Nav from '../common/Nav';//导航
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from '../common/Global';
import Loading from '../common/Loading';
import px2dp from "../common/Tool";
import AliyunPush from 'react-native-aliyun-push';

export default class chat extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.ChatFlag = true;
        this.state = {
            isLoading: true,
            textareaHeight: 30,
            chatText: '',
            shrinkFlag: false,
            bigImgUrl: [],
            consultationReason: '',
            consultationId: '',// 订单id
            fee: '',
            age: '',
            sex: '',
            diseaseName: '',//
            name: '',// 患者姓名
            consultationDoctorId: '',// 会诊医生id
            chatRoomId: '',// 聊天室id 病历订单id
            linkedDoctor: '',// 当前医生id
            chatArr: [],// 聊天信息数组
            doctorDetailList: [],// 该聊天室医生信息数组
            statusId: '',
            statusName: '',
            isRefresh: false,
            pageSize: '20',
            pageNo: '0',
            dataFlag: false,
            rightMenuBottom: new Animated.Value(0),
            keyHeight: IPhoneX ? 34 : 0,
            // keyFlag: false,
        }
    }

    _keyboardDidShow(e) {
        this.setState({
            // keyHeight: e.endCoordinates.height,
        })
    }

    _keyboardDidHide() {
        this.setState({
            // keyHeight: 0,
        })
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
        NetWork ? null : Alert.alert('网络似乎断掉了'), this.setState({isLoading: false});
        RouteName.push(this.props.navigation.state);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }
        DeviceEventEmitter.addListener('Chat', (data) => {
            if (this.ChatFlag) {
                // 读取未读消息
                AsyncStorage.getItem(UserInfo.doctorId + 'NoCIArr').then((result) => {
                    console.log(result);
                    if (result) {
                        let CIArr = JSON.parse(result);
                        if (CIArr && CIArr[this.state.consultationId]) {
                            this.setState({
                                chatArr: this.state.chatArr.concat(CIArr[this.state.consultationId]),
                            });
                            CIArr.count -= CIArr[this.state.consultationId].length;
                            GroupNum -= CIArr[this.state.consultationId].length;
                            CIArr[this.state.consultationId].splice(0, CIArr[this.state.consultationId].length);
                            AsyncStorage.setItem(UserInfo.doctorId + 'NoCIArr', JSON.stringify(CIArr)).then(() => {
                                console.log('成功');
                            }).catch((error) => {
                                console.log('失败');
                            });
                        }
                    }
                });
            }
        });

        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params.data;
            this.setState({
                consultationId: data.consultationId,
            });
            AppState.addEventListener('change', this.AppStateChange);
            // 通过订单id 获取详情
            this.selectConsultationById(data.consultationId);
            // 读取历史消息
            AsyncStorage.getItem(UserInfo.doctorId + 'CIArr').then((result) => {
                if (result) {
                    let CIArr = JSON.parse(result);
                    if (CIArr && CIArr[data.consultationId]) {
                        this.setState({
                            chatArr: CIArr[data.consultationId]
                        });
                    }
                }
            });
            // 读取未读消息
            AsyncStorage.getItem(UserInfo.doctorId + 'NoCIArr').then((result) => {
                console.log(JSON.parse(result));
                if (result) {
                    let CIArr = JSON.parse(result);
                    if (CIArr && CIArr[data.consultationId]) {
                        this.setState({
                            chatArr: this.state.chatArr.concat(CIArr[data.consultationId]),
                        });
                        CIArr.count -= CIArr[data.consultationId].length;
                        GroupNum -= CIArr[data.consultationId].length;
                        CIArr[data.consultationId].splice(0, CIArr[data.consultationId].length);
                        AsyncStorage.setItem(UserInfo.doctorId + 'NoCIArr', JSON.stringify(CIArr)).then(() => {
                            console.log('成功');
                        }).catch((error) => {
                            console.log('失败');
                        });
                    }
                }
            });
            // 进入聊天页面时 接收 首页消息推送
            // DeviceEventEmitter.emit('receive', {type: 'CI', flag: true});
            // // 首页消息推送处理
            // DeviceEventEmitter.addListener('message', (mes) => {
            //     console.log(mes);
            //     switch (mes.type) {
            //         case 'CI':// 聊天消息
            //             let CIArr = {count: 0};
            //             AsyncStorage.getItem(UserInfo.doctorId + 'CIArr').then((result) => {
            //                 if (result) {
            //                     CIArr = JSON.parse(result);
            //                 } else {
            //                     CIArr = {count: 0};
            //                     GroupNum = 0;
            //                 }
            //                 if (mes.chatRoomId === data.consultationId) {
            //                     let temp = this.state.chatArr;
            //                     temp.push(mes);
            //                     this.setState({
            //                         chatArr: temp,
            //                     })
            //                 } else {
            //                     if (CIArr[mes.chatRoomId]) {
            //                         CIArr[mes.chatRoomId].push(mes);
            //                         CIArr.count += 1;
            //                         GroupNum += 1;
            //                     } else {
            //                         let temp = [];
            //                         let key = mes.chatRoomId;
            //                         temp.unshift(mes);
            //                         CIArr[key] = temp;
            //                         CIArr.count += 1;
            //                         GroupNum += 1;
            //                     }
            //                 }
            //                 AsyncStorage.setItem(UserInfo.doctorId + 'CIArr', JSON.stringify(CIArr)).then(() => {
            //                     console.log('成功');
            //                 }).catch((error) => {
            //                     console.log('失败');
            //                 });
            //             });
            //
            //             break;
            //         case 'OI':// 订单消息
            //             let OIArr = {"count": 0, "lists": []};
            //             AsyncStorage.getItem(UserInfo.doctorId + 'OIArr').then((result) => {
            //                 if (result) {
            //                     OIArr = JSON.parse(result);
            //                 } else {
            //                     OIArr = {"count": 0, "lists": []};
            //                     OrderNum = 0;
            //                 }
            //                 OIArr.lists.unshift(mes);
            //                 OIArr.count += 1;
            //                 OrderNum += 1;
            //                 AsyncStorage.setItem(UserInfo.doctorId + 'OIArr', JSON.stringify(OIArr)).then(() => {
            //                     console.log('成功');
            //                 }).catch((error) => {
            //                     console.log('失败');
            //                 });
            //             });
            //             DeviceEventEmitter.emit('OrderRefresh', {'orderType': '会诊订单', 'status': '正在会诊'});
            //             break;
            //         case 'SI':// 系统消息
            //             let SIArr = {"count": 0, "lists": []};
            //             AsyncStorage.getItem(UserInfo.doctorId + 'SIArr').then((result) => {
            //                 if (result) {
            //                     SIArr = JSON.parse(result);
            //                 } else {
            //                     SIArr = {"count": 0, "lists": []};
            //                     SystemNum = 0;
            //                 }
            //                 SIArr.lists.unshift(mes);
            //                 SIArr.count += 1;
            //                 SystemNum += 1;
            //                 AsyncStorage.setItem(UserInfo.doctorId + 'SIArr', JSON.stringify(SIArr)).then(() => {
            //                     console.log('成功');
            //                 }).catch((error) => {
            //                     console.log('失败');
            //                 });
            //             });
            //             break;
            //         case 'LG':// 异地登陆
            //             AsyncStorage.getItem(this.state.chatRoomId).then((result) => {
            //                 if (result) {
            //                     AsyncStorage.setItem(this.state.chatRoomId, JSON.stringify(this.state.chatArr)).then(() => {
            //                         console.log('成功');
            //
            //                     }).catch((error) => {
            //                         console.log('失败');
            //                     });
            //                 } else {
            //                     AsyncStorage.setItem(this.state.chatRoomId, JSON.stringify(this.state.chatArr)).then(() => {
            //                         console.log('成功');
            //                     }).catch((error) => {
            //                         console.log('失败');
            //                     })
            //                 }
            //             });
            //             Alert.alert('', '您的账号在其他设备登陆', [
            //                 {
            //                     text: '确认', onPress: () => {
            //                     Obj.this.props.navigation.navigate('Login');
            //                 }
            //                 },
            //             ]);
            //             break;
            //         case 'DOI':// 订单结束 删除聊天记录
            //             AsyncStorage.getItem(UserInfo.doctorId + 'CIArr').then((result) => {
            //                 if (result) {
            //                     let CIArr = JSON.parse(result);
            //                     if (CIArr && CIArr[data.messageContent]) {
            //                         CIArr.count -= CIArr[data.messageContent].length;
            //                         GroupNum -= CIArr[data.messageContent].length;
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
            //         default:
            //             break;
            //     }
            //
            //
            // });
        }


    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.ChatFlag = false;
        DeviceEventEmitter.removeAllListeners('Chat');
        DeviceEventEmitter.emit('Tidings', '聊天推送');
        DeviceEventEmitter.emit('Home', '聊天推送');
        // DeviceEventEmitter.emit('Tidings', '我是聊天发的刷新');
        // 保存数据到历史记录
        let CIArr = {count: 0};
        AsyncStorage.getItem(UserInfo.doctorId + 'CIArr').then((result) => {
            if (result) {
                CIArr = JSON.parse(result);
            } else {
                CIArr.count = 0;
            }
            if (CIArr && CIArr[this.state.chatRoomId]) {
                CIArr[this.state.chatRoomId] = this.state.chatArr;
            } else {
                let key = this.state.chatRoomId;
                CIArr[key] = this.state.chatArr;
            }
            GroupNum = CIArr.count;
            console.log(CIArr);
            AsyncStorage.setItem(UserInfo.doctorId + 'CIArr', JSON.stringify(CIArr)).then(() => {
                console.log('成功');
            }).catch((error) => {
                console.log('失败');
            });
        });
        // DeviceEventEmitter.emit('receive', {type: 'CI', flag: false});
        AppState.removeEventListener('change', this.AppStateChange);
        // DeviceEventEmitter.removeAllListeners('message');
    };

    AppStateChange = (nextAppState) => {
        if (nextAppState === 'inactive' || nextAppState === 'background') {

            let CIArr = {count: 0};
            AsyncStorage.getItem(UserInfo.doctorId + 'CIArr').then((result) => {
                if (result) {
                    CIArr = JSON.parse(result);
                } else {
                    CIArr.count = 0;
                }
                if (CIArr && CIArr[this.state.chatRoomId]) {
                    CIArr[this.state.chatRoomId] = this.state.chatArr;
                } else {
                    let key = this.state.chatRoomId;
                    CIArr[key] = this.state.chatArr;
                }
                GroupNum = CIArr.count;
                AsyncStorage.setItem(UserInfo.doctorId + 'CIArr', JSON.stringify(CIArr)).then(() => {
                    console.log('成功');
                }).catch((error) => {
                    console.log('失败');
                });
            });

            let pushNum = 0;
            AsyncStorage.getItem(UserInfo.doctorId + 'SIArr').then((result) => {
                if (result) {
                    pushNum += Number(JSON.parse(result).count);
                }
            });
            // 订单消息数
            AsyncStorage.getItem(UserInfo.doctorId + 'OIArr').then((result) => {
                if (result) {
                    pushNum += Number(JSON.parse(result).count);
                }
            });
            // 聊天数
            AsyncStorage.getItem(UserInfo.doctorId + 'NoCIArr').then((result) => {
                if (result) {
                    pushNum += Number(JSON.parse(result).count);
                }
            });
            AliyunPush.setApplicationIconBadgeNumber(pushNum);
        }
    };


    componentDidMount() {
        // 获取聊天室列表
        fetch(requestUrl.getChatRoom)
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status === '0') {
                    let chatRoomList = responseData.chatRoomList;
                    chatRoomList.map((item) => {
                        if (item.id === this.state.consultationId) {
                            this.setState({
                                chatRoomId: item.id,// 匹配聊天室id
                                doctorDetailList: item.doctorDetailList,// 该聊天室医生信息
                            })
                        }
                    });
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
    }

    render() {
        const {navigate, goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
                {this.state.isLoading ? <Loading/> : null}
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
                         DeviceEventEmitter.emit('receive', {type: 'TI', flag: true});
                         RouteName.pop();
                         goBack();
                     }}
                     data={{
                         'leftBtn': true,
                         'title': this.state.diseaseName,//
                         'rightBtn': UserInfo.doctorId !== this.state.consultationDoctorId ? {type: false} : {
                             type: 'img',
                             click: this.rightClick.bind(this),
                             url: require('../images/dropdown_menu.png')
                         }
                     }}/>
                {IOS ?
                    <KeyboardAvoidingView
                        behavior={'padding'}
                        style={{
                            width: SCREEN_WIDTH,
                            height: IPhoneX ? SCREEN_HEIGHT - 122 : SCREEN_HEIGHT - 64,
                            justifyContent: 'flex-end',
                        }}>
                        <View style={{flex: 1}}>
                            <ScrollView
                                style={{marginTop: px2dp(30)}}
                                // keyboardDismissMode={'on-drag'}
                                ref={(scrollView) => {
                                    _scrollView = scrollView;
                                }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefresh}
                                        onRefresh={() => {
                                            // this.RecordFetchData()
                                        }}
                                    />
                                }
                                onContentSizeChange={this._onContentSizeChange}
                            >
                                {this.renderChat()}
                            </ScrollView>
                        </View>
                        <View style={styles.chatContent}>
                            <TextInput
                                style={[styles.textareaStyle, {height: Math.min(80, this.state.textareaHeight)}]}
                                placeholder={""}
                                placeholderTextColor={'#c7c7cd'}
                                multiline={true}
                                onChangeText={(text) => {
                                    this.setState({chatText: text.replace(/(\s*$)/g, "")});
                                }}
                                onContentSizeChange={this.onContentSizeChange.bind(this)}
                                underlineColorAndroid={'transparent'}
                                defaultValue={this.state.chatText}
                                onFocus={() => {
                                    this.setState({
                                        shrinkFlag: false,
                                        rightMenuFlag: false,
                                    });
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.sendClick();
                                }}
                                activeOpacity={.8}
                            >
                                <View style={styles.sendBtn}>
                                    <Text style={styles.sendText}>发送</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                    :
                    <View style={{flex: 1}}>
                        <ScrollView
                            style={{flex: 1, marginTop: px2dp(30)}}
                            // keyboardDismissMode={'on-drag'}
                            ref={(scrollView) => {
                                _scrollView = scrollView;
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefresh}
                                    onRefresh={() => {
                                        // this.RecordFetchData()
                                    }}
                                />
                            }
                            onContentSizeChange={this._onContentSizeChange}
                        >
                            {this.renderChat()}

                        </ScrollView>
                        <View style={styles.chatContent}>
                            <TextInput
                                style={[styles.textareaStyle, {height: Math.min(80, this.state.textareaHeight)}]}
                                placeholder={""}
                                placeholderTextColor={'#c7c7cd'}
                                multiline={true}
                                onChangeText={(text) => {
                                    this.setState({chatText: text.replace(/(\s*$)/g, "")});
                                }}
                                onContentSizeChange={this.onContentSizeChange.bind(this)}
                                underlineColorAndroid={'transparent'}
                                defaultValue={this.state.chatText}
                                onFocus={() => {
                                    this.setState({
                                        shrinkFlag: false,
                                        rightMenuFlag: false,
                                    })
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.sendClick();
                                }}
                                activeOpacity={.8}
                            >
                                <View style={styles.sendBtn}>
                                    <Text style={styles.sendText}>发送</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>}
                {this.state.rightMenuFlag ?
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                rightMenuFlag: false,
                            })
                        }}
                        activeOpacity={.8}
                        style={styles.rightMenuClick}
                    >
                        <Animated.View style={[styles.rightMenuBox, {bottom: this.state.rightMenuBottom}]}>

                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert('确认申请完善病历？', '首诊医生将在24小时内完成病历完善', [
                                        {
                                            text: '取消', onPress: () => {
                                            }
                                        },
                                        {
                                            text: '确认', onPress: () => {
                                                this.apply();
                                            }
                                        },
                                    ])
                                }}
                                activeOpacity={.8}

                            >
                                <View style={[styles.rightOptionBox, {backgroundColor: '#eee'}]}>
                                    <Text style={[styles.rightOptionText, {color: '#424242'}]}>申请完善病历</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    navigate('EditResult', {data: this.state});
                                }}
                                activeOpacity={.8}
                            >
                                <View style={[styles.rightOptionBox, {backgroundColor: '#eee'}]}>

                                    <Text style={[styles.rightOptionText, {color: '#424242'}]}>编辑会诊结论</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        rightMenuFlag: false,
                                    })
                                }}
                                activeOpacity={.8}
                            >
                                <View style={styles.rightOptionBox}>
                                    <Text style={styles.rightOptionText}>取消</Text>
                                </View>
                            </TouchableOpacity>
                            {IPhoneX ? <View style={{height: 34,}}></View> : null}
                        </Animated.View>
                    </TouchableOpacity>
                    : null}


                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            shrinkFlag: false,
                        })
                    }}
                    activeOpacity={.8}
                    style={[styles.shrinkClick, {height: this.state.shrinkFlag ? SCREEN_HEIGHT : 'auto'}]}
                >
                    <View style={styles.shrinkContent}>
                        <TouchableOpacity
                            onPress={() => {
                            }}
                            activeOpacity={1}
                        >
                            {this.state.shrinkFlag ? <View>
                                <View style={styles.shrinkBox}>
                                    <Text
                                        style={styles.infoText}>{this.state.consultationDoctorId !== UserInfo.doctorId ? this.state.name + '-' : ''}{this.state.sex}-{this.state.age}岁</Text>
                                    <Text numberOfLines={6}
                                          style={styles.goalText}>会诊目的：{this.state.consultationReason}</Text>
                                    <Text style={styles.feeText}>¥ {this.state.fee}</Text>
                                </View>
                                <ScrollView style={{
                                    maxHeight: SCREEN_HEIGHT * .3,
                                    borderTopWidth: Pixel,
                                    borderColor: '#D4D4D7',
                                    borderBottomWidth: Pixel,
                                }}>
                                    <View style={styles.caseHistoryImg}>
                                        {this.renderCaseImg()}
                                    </View>
                                </ScrollView>
                            </View> : null}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Keyboard.dismiss();
                                this.setState({
                                    shrinkFlag: !this.state.shrinkFlag,
                                    rightMenuFlag: false,
                                })
                            }}
                            activeOpacity={.8}
                        >
                            <View style={styles.shrinkBtn}>
                                <Text style={styles.shrinkBtnText}>{this.state.shrinkFlag ? '收起' : '查看病历信息'}</Text>
                                <Image source={require('../images/dropdown_btn.png')}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <Toast
                    ref='toast'
                    style={{backgroundColor: '#333333', borderRadius: 10,}}
                    position={'top'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeInDuration={1000}
                    opacity={.8}
                />
            </View>
        );
    }

// 多行输入高度处理
    onContentSizeChange(event) {
        if (event.nativeEvent.contentSize.height >= 30) {
            this.setState({
                textareaHeight: event.nativeEvent.contentSize.height,
            })
        }

    }

    // 历史记录
    RecordFetchData() {
        this.setState({isRefresh: true});
        AsyncStorage.getItem(this.state.chatRoomId).then((result) => {
            console.log(JSON.parse(result));
            let temp = this.state.chatArr;
            temp = JSON.parse(result).concat(temp);
            this.setState({
                chatArr: temp,
                isRefresh: false,
            })
        });
    }

    _onContentSizeChange() {
        _scrollView.scrollToEnd({animated: true});
    }

    renderChat() {
        let chatArr = this.state.chatArr;
        let doctorDetailList = this.state.doctorDetailList;
        let temp = [];
        for (let i = 0; i < chatArr.length; i++) {
            for (let j = 0; j < doctorDetailList.length; j++) {
                if (chatArr[i].sendDoctorId === doctorDetailList[j].id) {
                    if (chatArr[i].sendDoctorId === UserInfo.doctorId) {
                        temp.push(
                            <View
                                key={i}
                                style={[styles.chatBox, {
                                    justifyContent: 'flex-end',
                                    marginTop: i === 0 ? px2dp(15) : null,
                                }]}
                            >
                                <Text style={[styles.chatText, {
                                    backgroundColor: '#cbd7ff',
                                    borderColor: '#9eb1f0',
                                }]}>{chatArr[i].messageContent}</Text>
                                <Image source={{uri: requestUrl.ImgIp + doctorDetailList[j].doctorPhotoPath}}
                                       style={styles.chatImg}/>
                            </View>
                        )
                    } else {
                        temp.push(
                            <View
                                key={i}
                                style={[styles.chatBox, {marginTop: i === 0 ? px2dp(15) : null}]}
                            >
                                <Image source={{uri: requestUrl.ImgIp + doctorDetailList[j].doctorPhotoPath}}
                                       style={styles.chatImg}/>
                                <Text style={styles.chatText}>{chatArr[i].messageContent}</Text>

                            </View>
                        )
                    }

                }

            }
        }
        return temp;
    }

    // 展示上传的图片
    renderCaseImg() {
        let imgArr = this.state.bigImgUrl;
        if (imgArr.length >= 0) {
            let Temp = [];
            for (let i = 0; i < imgArr.length; i++) {
                Temp.push(
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('ZoomImg', {data: this.state.bigImgUrl, 'index': i})
                        }}
                        activeOpacity={.8}
                        key={i}
                    >
                        <Image style={styles.caseItemImg} source={{uri: imgArr[i]}}/>
                    </TouchableOpacity>
                );
            }
            return Temp;
        } else {
            return null;
        }
    }

    sendClick() {
        if (this.state.chatText === '' || !RegExp.Reg_Text.test(this.state.chatText)) {
            this.refs.toast.show('请输入内容');
        } else {
            let requestMessage = `{"chatRoomId":"${this.state.chatRoomId}","messageContent":"${this.state.chatText}"}`;
            WS.ws.send(requestMessage);
            let temp = this.state.chatArr;
            temp.push({
                'sendDoctorId': UserInfo.doctorId,
                'chatRoomId': this.state.chatRoomId,
                'messageContent': this.state.chatText,
                'type': 'CI',
            });
            this.setState({
                chatText: '',
                chatArr: temp,
                textareaHeight: 30,
            });
        }
    }

    rightClick() {
        Keyboard.dismiss();
        this.setState({
            rightMenuFlag: !this.state.rightMenuFlag,
            shrinkFlag: false,
        });
        this.state.rightMenuBottom.setValue(-300);
        Animated.timing(this.state.rightMenuBottom, {
            toValue: 0,
            duration: 300,
            easing: Easing.linear,// 线性的渐变函数
        }).start();
    }

    // 申请完善病历
    apply() {
        this.setState({isLoading: true,});
        let formData = new FormData();
        formData.append("consultationId", this.state.consultationId);
        console.log(formData)
        fetch(requestUrl.applyPerfectCase, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '0') {
                    this.refs.toast.show('申请成功');
                    setTimeout(() => {
                        this.setState({isLoading: false,});
                        OrderType = '会诊订单';
                        Status = '正在会诊';
                        this.props.navigation.navigate('TabOrderPage');
                    }, 1000);
                } else if (responseData.status === '2') {
                    this.refs.toast.show('申请已成功，请勿重复申请');
                    setTimeout(() => {
                        this.setState({isLoading: false,});
                        OrderType = '会诊订单';
                        Status = '正在会诊';
                        this.props.navigation.navigate('TabOrderPage');
                    }, 1000);
                } else {
                    this.setState({isLoading: false,});
                    this.refs.toast.show('申请失败，请重试');
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                    console.log('error', error);
                });
    }


    // 通过订单id 获取订单详情
    selectConsultationById(id) {
        let formData = new FormData();
        formData.append("consultationId", id);
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
                // if (responseData.status === '0') {
                let urlArr = [];
                for (let i = 0; i < responseData.pictureList.length; i++) {
                    urlArr.push(
                        requestUrl.ImgIp + responseData.pictureList[i].pictureUrl
                    )
                }
                this.setState({
                    diseaseName: responseData.diseaseName,
                    consultationReason: responseData.consultationReason,
                    fee: responseData.fee,
                    age: responseData.age,
                    sex: responseData.sex,
                    name: responseData.name,
                    statusName: responseData.statusName,
                    statusId: responseData.statusId,
                    bigImgUrl: urlArr,
                    consultationDoctorId: responseData.consultationDoctorId,
                })
                // }
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
        backgroundColor: Colors.bgColor,
    },
    chatContent: {
        borderTopWidth: Pixel,
        borderTopColor: '#dbdbdb',
        padding: 5,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        backgroundColor: '#F4F4F6',
    },
    textareaStyle: {
        flex: 1,
        borderRadius: px2dp(3),
        borderWidth: Pixel,
        borderColor: '#DBDBDB',
        fontSize: FONT_SIZE(14),
        padding: px2dp(3),
        backgroundColor: '#fff',
    },
    sendBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        padding: px2dp(10),
        marginLeft: px2dp(10),
        borderRadius: px2dp(3),
        backgroundColor: '#566CB7',
    },
    sendText: {
        fontSize: FONT_SIZE(14),
        color: '#fff',
    },
    // 折叠部分
    shrinkClick: {
        position: 'absolute',
        top: IOS ? IPhoneX ? 88 : 64 : 45,
        left: 0,
        backgroundColor: 'rgba(0,0,0,.2)',
    },
    shrinkContent: {
        width: SCREEN_WIDTH,
        borderWidth: Pixel,
        borderColor: '#D4D4D7',
        backgroundColor: '#fff',
    },
    shrinkBox: {
        padding: px2dp(16),
    },
    infoText: {
        fontSize: FONT_SIZE(16),
        color: '#333',
    },
    goalText: {
        fontSize: FONT_SIZE(15),
        color: '#333333',
        lineHeight: 26,
    },
    feeText: {
        fontSize: FONT_SIZE(16),
        color: '#566CB7',
        textAlign: 'right',
    },
    caseHistoryImg: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: px2dp(12),
        paddingLeft: px2dp(16),
    },
    caseItemImg: {
        width: px2dp(60),
        height: px2dp(60),
        borderRadius: px2dp(4),
        marginRight: px2dp(15),
        marginBottom: px2dp(12),
    },
    shrinkBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: px2dp(30),

    },
    shrinkBtnText: {
        marginRight: px2dp(10),
        fontSize: FONT_SIZE(14),
        color: '#7388d0',
    },

    rightMenuClick: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 2,
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        backgroundColor: 'rgba(0,0,0,.2)',

    },
    rightMenuBox: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    rightOptionBox: {
        height: px2dp(55),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderTopWidth: Pixel,
        borderColor: '#dbdbdb'
    },
    rightOptionText: {
        fontSize: FONT_SIZE(16),
        color: '#333333',
    },

    // 聊天信息
    chatBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: px2dp(15),
    },
    chatImg: {
        width: px2dp(45),
        height: px2dp(45),
        borderRadius: px2dp(22.5),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
    },
    chatText: {
        fontSize: FONT_SIZE(16),
        color: '#212121',
        lineHeight: px2dp(22),
        borderWidth: Pixel,
        borderColor: '#DBDBDB',
        backgroundColor: '#fff',
        maxWidth: px2dp(203),
        paddingTop: px2dp(11),
        paddingBottom: px2dp(11),
        paddingRight: px2dp(13),
        paddingLeft: px2dp(13),
        borderRadius: px2dp(4),
        overflow: 'hidden',
    }
});
