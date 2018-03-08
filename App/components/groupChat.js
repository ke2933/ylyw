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
    RefreshControl
} from 'react-native';

import {requestUrl} from '../Network/url';//接口url
// import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../common/Nav';//导航
// import Button from '../common/Button';//按钮
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from '../common/Global';

export default class chat extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            textareaHeight: 30,
            chatText: '',
            shrinkFlag: false,
            bigImgUrl: [],
            consultationReason: '',
            consultationId: '',
            fee: '',
            age: '',
            sex: '',
            diseaseName: '',
            isLoading: false,
            chatRoomId: '',// 聊天室id 病历订单id
            linkedDoctor: '',// 当前医生id
            chatArr: [],// 聊天信息数组
            doctorDetailList: [],// 该聊天室医生信息数组
            isRefresh: false,
            pageSize: '20',
            pageNo: '1',
            dataFlag: true,
        }
    }

    componentWillMount() {
        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params.data;
            this.setState({
                doctorDetailList: data.doctorDetailList,
                chatRoomId: data.id,
            });

            fetch(requestUrl.selectDoctorDetailIdByDoctorId)
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.status === '0') {
                        this.setState({
                            linkedDoctor: responseData.doctorDetailId,
                        });
                        WS.fn(requestUrl.WS + '/websocket/chat?doctorDetailId=' + responseData.doctorDetailId);
                    }
                })
                .catch(
                    (error) => {
                        console.log('error', error);
                    });

            // let formData = new FormData();
            // formData.append("consultationId", data.id);
            // fetch(requestUrl.selectConsultationById, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            //     body: formData,
            // })
            //     .then((response) => response.json())
            //     .then((responseData) => {
            //         console.log(responseData)
            //         // if (responseData.status === '0') {
            //         //     let urlArr = [];
            //         //     for(let i = 0; i < responseData.pictureList.length;i++){
            //         //         urlArr.push(
            //         //             requestUrl.ImgIp+responseData.pictureList[i].pictureUrl
            //         //         )
            //         //     }
            //         //     this.setState({
            //         //         diseaseName: responseData.diseaseName,
            //         //         consultationReason: responseData.consultationReason,
            //         //         fee: responseData.fee,
            //         //         age: responseData.age,
            //         //         sex: responseData.sex,
            //         //         bigImgUrl: urlArr,
            //         //     })
            //         // }
            //     })
            //     .catch(
            //         (error) => {
            //             console.log('error', error);
            //         });
        }
    }

    componentDidMount() {
        fetch(requestUrl.getChatRecord + this.state.chatRoomId)
            .then((response) => response.json())
            .then((responseData) => {

                if (responseData.status === '0') {
                    console.log(responseData)
                    this.setState({
                        chatArr: responseData.chatRecordBeanList.reverse(),
                    })

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
                         goBack()
                     }}
                     data={{
                         'leftBtn': true,
                         'title': this.state.diseaseName,
                         'rightBtn': {
                             type: 'img',
                             click: this.rightClick.bind(this),
                             url: require('../images/dropdown_menu.png')
                         }
                     }}/>
                <View style={styles.shrinkContent}>
                    {this.state.shrinkFlag ? <View>
                        <View style={styles.shrinkBox}>
                            <Text style={styles.infoText}>{this.state.name}-{this.state.sex}-{this.state.age}岁</Text>
                            <Text style={styles.goalText}>会诊目的：{this.state.consultationReason}</Text>
                            <Text style={styles.feeText}>¥ {this.state.fee}</Text>
                        </View>
                        <View style={styles.caseHistoryImg}>
                            {this.renderCaseImg()}
                        </View>
                    </View> : null}
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                shrinkFlag: !this.state.shrinkFlag,
                            })
                        }}
                        activeOpacity={.8}
                    >
                        <View style={styles.shrinkBtn}>
                            <Image source={require('../images/dropdown_btn.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    ref={(scrollView) => {
                        _scrollView = scrollView;
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefresh}
                            onRefresh={()=>{this.RecordFetchData()}}
                            // tintColor="#ff0000"
                            // title="Loading..."
                            // titleColor="#00ff00"
                            // colors={['#ff0000', '#00ff00', '#0000ff']}
                            // progressBackgroundColor="#ffff00"
                        />
                    }
                    style={styles.chatRecord}
                    >
                    {this.renderChat()}

            </ScrollView>

        <View style={styles.chatContent}>
            <TextInput
                style={[styles.textareaStyle, {height: Math.min(80, this.state.textareaHeight)}]}
                placeholder={""}
                placeholderTextColor={'#c7c7cd'}
                multiline={true}
                onChangeText={(text) => this.setState({chatText: text})}
                onContentSizeChange={this.onContentSizeChange.bind(this)}
                underlineColorAndroid={'transparent'}
                defaultValue={this.state.chatText}
            />
            <TouchableOpacity
                onPress={() => {
                    this.sendClick()
                }}
                activeOpacity={.8}
            >
                <View style={styles.sendBtn}>
                    <Text style={styles.sendText}>发送</Text>
                </View>
            </TouchableOpacity>
        </View>
    {this.state.rightMenuFlag ?
        <View style={styles.rightMenuBox}>
            {/*<TouchableOpacity*/}
            {/*onPress={() => {*/}
            {/*}}*/}
            {/*activeOpacity={.8}*/}
            {/*>*/}
            {/*<Text style={styles.rightOptionText}>邀请协同会诊</Text>*/}
            {/*</TouchableOpacity>*/}
            <TouchableOpacity
                onPress={() => {
                    this.apply();
                }}
                activeOpacity={.8}
            >
                <Text style={styles.rightOptionText}>申请完善病例</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    navigate('EditResult');
                }}
                activeOpacity={.8}
            >
                <Text style={styles.rightOptionText}>编辑会诊结论</Text>
            </TouchableOpacity>
        </View> : null}
        <Toast
            ref='toast'
            style={{backgroundColor: '#333333', borderRadius: 10,}}
            position={'center'}
            textStyle={{color: '#ffffff', fontSize: 16,}}
            fadeInDuration={1000}
            opacity={.8}
        />
    </View>
    )
        ;
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
        if (this.state.dataFlag) {
            let pageNo = this.state.pageNo * 1 + 1 + '';
            this.setState({isRefresh: true,pageNo: pageNo});
            fetch(requestUrl.getChatRecordHistory + `?chatRoomId=${this.state.chatRoomId}&pageNo=${pageNo}&pageSize=${this.state.pageSize}&pointDate=${this.state.chatArr[0].createTime}`)
                .then((response) => response.json())
                .then((responseData) => {
                    console.log(responseData)
                    if (responseData.status === '0') {
                        if (responseData.chatRecordBeanList.length >= this.state.pageSize) {
                            let temp = this.state.chatArr;
                            temp = responseData.chatRecordBeanList.reverse().concat(temp);
                            this.setState({
                                dataFlag: true,
                                isRefresh: false,
                                chatArr: temp,
                            })
                        } else {
                            let temp = this.state.chatArr;
                            temp = responseData.chatRecordBeanList.reverse().concat(temp);
                            this.setState({
                                dataFlag: false,
                                isRefresh: false,
                                chatArr: temp,
                            })
                        }

                    }
                })
                .catch(
                    (error) => {
                        console.log('error', error);
                    });
        }

    }

    renderChat() {
        let chatArr = this.state.chatArr;
        let doctorDetailList = this.state.doctorDetailList;
        let temp = [];
        for (let i = 0; i < chatArr.length; i++) {
            for (let j = 0; j < doctorDetailList.length; j++) {
                if (chatArr[i].sendDoctorId === doctorDetailList[j].id) {
                    if (chatArr[i].sendDoctorId === this.state.linkedDoctor) {
                        temp.push(
                            <View
                                key={i}
                                style={[styles.chatBox, {justifyContent: 'flex-end'}]}
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
                    <Image key={i} style={styles.caseItemImg} source={{uri: imgArr[i]}}/>
                );
            }
            return Temp;
        } else {
            return null;
        }
    }

    sendClick() {
        if (this.state.chatText === '') {
            this.refs.toast.show('请输入内容');
        } else {
            WS.fn(requestUrl.WS + '/websocket/chat?doctorDetailId=' + this.state.linkedDoctor);
            let requestMessage = `{"chatRoomId":"${this.state.chatRoomId}","messageContent":"${this.state.chatText}"}`;
            WS.ws.onopen = () => {
                WS.ws.send(requestMessage);
            };
            let temp = this.state.chatArr;
            temp.push({'sendDoctorId': this.state.linkedDoctor, 'messageContent': this.state.chatText});
            console.log(temp);
            this.setState({
                chatText: '',
                chatArr: temp,
            });
            WS.ws.onmessage = (e) => {
                // 接收到了一个消息
                console.log(e.data);
                let temp = this.state.chatArr;
                temp.push(JSON.parse(e.data));
                this.setState({
                    chatArr: temp,
                });
                setTimeout(() => {
                    _scrollView.scrollToEnd({animated: true});
                })
            };
            setTimeout(() => {
                _scrollView.scrollToEnd({animated: true});
            })
        }
    }

    rightClick() {
        this.setState({
            rightMenuFlag: !this.state.rightMenuFlag,
        })
    }

    // 申请完善病历
    apply() {
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
                console.log(responseData)
                if (responseData.status === '0') {
                    this.refs.toast.show('申请成功');
                    setTimeout(() => {
                        this.setState({
                            rightMenuFlag: false,
                        });
                        this.props.navigation.navigate('Home');
                    }, 1000)
                } else if (responseData.status === '2') {
                    this.refs.toast.show('申请已成功，请勿重复申请');
                    setTimeout(() => {
                        this.setState({
                            rightMenuFlag: false,
                        });
                        this.props.navigation.navigate('Home');
                    }, 1000)
                } else {
                    this.refs.toast.show('申请失败，请重试');
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
    }

    submit() {

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
    },
    chatRecord: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    chatContent: {
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
        borderColor: '#D4D4D7',
        fontSize: px2dp(14),
        padding: px2dp(3),
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
    shrinkContent: {
        marginTop: px2dp(6),
        marginLeft: SCREEN_WIDTH * .02,
        width: SCREEN_WIDTH * .96,
        borderWidth: Pixel,
        borderColor: '#D4D4D7',
        backgroundColor: '#fff',
        borderRadius: px2dp(3),
    },
    shrinkBox: {
        padding: 16,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
    },
    goalText: {
        fontSize: 15,
        color: '#333333',
        lineHeight: 26,
    },
    feeText: {
        fontSize: 16,
        color: '#566CB7',
        textAlign: 'right',
    },
    caseHistoryImg: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderTopWidth: 1,
        borderColor: '#D4D4D7',
        borderBottomWidth: 1,
        paddingTop: 12,
        paddingLeft: 16,
    },
    caseItemImg: {
        width: 64,
        height: 61,
        borderRadius: 4,
        marginRight: 15,
        marginBottom: 12,
    },
    shrinkBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,

    },
    rightMenuBox: {
        position: 'absolute',
        top: 65,
        right: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D4D4D7',
        width: 140,
    },
    rightOptionText: {
        flex: 1,
        textAlign: 'center',
        lineHeight: 50,
        fontSize: 16,
        color: '#333333',
    },

    // 聊天信息
    chatBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: px2dp(12),
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
