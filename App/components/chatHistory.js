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
    BackHandler,
} from 'react-native';

import {requestUrl} from '../Network/url';//接口url
import {RegExp} from '../Network/RegExp';//正则
import Nav from '../common/Nav';//导航
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from '../common/Global';
import Loading from '../common/Loading';

export default class chatHistory extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
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

        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params.data;
            this.setState({
                consultationId: data.consultationId,
            });
            // 通过订单id 获取详情
            this.selectConsultationById(data.consultationId);
        }


    }

    componentWillUnmount() {

    };

    componentDidMount() {
        // 获取聊天室 医生信息
        fetch(requestUrl.getChatRoomById + '?roomId=' + this.state.consultationId)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '0') {
                    this.setState({
                        chatRoomId: responseData.chatRoom.id,
                        doctorDetailList: responseData.chatRoom.doctorDetailList,// 该聊天室医生信息
                    });
                    fetch(requestUrl.getAllChatRecord + responseData.chatRoom.id)
                        .then((response) => response.json())
                        .then((responseData) => {
                            if (responseData.status === '0') {
                                this.setState({
                                    chatArr: responseData.chatRecordBeanList[0].chatRecordBeanList,
                                });

                            }

                        })
                        .catch(
                            (error) => {
                                console.log('error', error);
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
                         RouteName.pop();
                         goBack();
                     }}
                     data={{
                         'leftBtn': true,
                         'title': this.state.diseaseName,
                         'rightBtn': false,
                     }}/>
                <ScrollView
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
                    style={styles.chatRecord}
                >
                    {this.renderChat()}

                </ScrollView>

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
                                    this.apply();
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
                                this.setState({
                                    shrinkFlag: !this.state.shrinkFlag,
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
            </View>
        );
    }


    renderChat() {
        let chatArr = this.state.chatArr;
        let doctorDetailList = this.state.doctorDetailList;
        let temp = [];
        for (let i = 0; i < chatArr.length; i++) {
            for (let j = 0; j < doctorDetailList.length; j++) {
                if (chatArr[i].sendDoctorId === doctorDetailList[j].id) {
                    if (chatArr[i].sendDoctorId === chatArr[0].sendDoctorId) {
                        temp.push(
                            <View
                                key={i}
                                style={[styles.chatBox, {justifyContent: 'flex-end',}]}
                            >
                                <Text style={styles.chatText}>{chatArr[i].messageContent}</Text>
                                <Image source={{uri: requestUrl.ImgIp + doctorDetailList[j].doctorPhotoPath}}
                                       style={styles.chatImg}/>
                            </View>
                        )
                    } else {
                        temp.push(
                            <View
                                key={i}
                                style={[styles.chatBox,]}
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

    rightClick() {
        this.setState({
            rightMenuFlag: !this.state.rightMenuFlag,
        });
        this.state.rightMenuBottom.setValue(-300);
        Animated.timing(this.state.rightMenuBottom, {
            toValue: 0,
            duration: 300,
            easing: Easing.linear,// 线性的渐变函数
        }).start();
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
                    console.log('error', error);
                });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    chatRecord: {
        marginTop: px2dp(30),
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    chatContent: {
        borderTopWidth: Pixel,
        borderTopColor: '#dbdbdb',
        marginTop: px2dp(15),
        padding: px2dp(5),
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
        fontSize: px2dp(14),
        padding: px2dp(3),
        backgroundColor: '#fff',
    },
    sendBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: px2dp(30),
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
        top: IOS ? px2dp(65) : px2dp(45),
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
        borderTopWidth: Pixel,
        borderColor: '#D4D4D7',
        borderBottomWidth: Pixel,
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
        marginTop: px2dp(15),
    },
    chatImg: {
        width: px2dp(43),
        height: px2dp(43),
        borderRadius: px2dp(22),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
    },
    chatText: {
        fontSize: FONT_SIZE(16),
        color: '#333',
        lineHeight: px2dp(21),
        borderWidth: Pixel,
        borderColor: '#c8c8c8',
        backgroundColor: '#fff',
        maxWidth: px2dp(203),
        paddingTop: px2dp(8),
        paddingBottom: px2dp(8),
        paddingRight: px2dp(13),
        paddingLeft: px2dp(13),
        borderRadius: px2dp(4),
        overflow: 'hidden',
    }
});
