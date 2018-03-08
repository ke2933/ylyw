import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ScrollView
} from 'react-native';

import {requestUrl} from '../Network/url';//接口url
import {RegExp} from '../Network/RegExp';//正则
import Nav from '../common/Nav';//导航
import Button from '../common/Button';//按钮
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
            chatText: '',// 输入的内容
            shrinkFlag: false,
            bigImgUrl: '',
            consultationReason: '',
            fee: '',
            age: '',
            sex: '',
            name: '',
            diseaseName: '',
            consultationDoctorId:'',// 会诊医生id
            isLoading: false,
            chatRoomId: '',// 聊天室id
            consultationId: '',// 病历订单id
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
                // bigImgUrl: data.bigImgUrl,
                // consultationReason: data.consultationReason,
                // fee: data.fee,
                // age: data.age,
                // sex: data.sex,
                // name: data.name,
                // diseaseName: data.diseaseName,
                // shrinkFlag: false,
                // isLoading: false,
                consultationId: data.consultationId

            });
            // 通过订单id 获取详情
            this.selectConsultationById(data.consultationId);
        }
    }

    componentDidMount() {
        // 获取聊天室列表
        fetch(requestUrl.getChatRoom)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData)
                if (responseData.status === '0') {
                    let chatRoomList = responseData.chatRoomList;
                    chatRoomList.map((item)=>{
                        if(item.id === this.state.consultationId){
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
        // 获取当前医生id
        fetch(requestUrl.selectDoctorDetailIdByDoctorId)
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status === '0') {
                    this.setState({
                        linkedDoctor: responseData.doctorDetailId,
                    });
                    WS.fn('ws://192.168.0.222/websocket/chat?doctorDetailId=' + responseData.doctorDetailId);
                    WS.ws.onopen = () => {

                    }
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
                         'rightBtn': this.state.linkedDoctor !== this.state.consultationDoctorId?{type:false}:{
                         type: 'img',
                         click: this.rightClick.bind(this),
                         url: require('../images/dropdown_menu.png')
                     }
                     }}/>
                <View style={styles.shrinkContent}>
                    {this.state.shrinkFlag ? <View>
                        <View style={styles.shrinkBox}>
                            <Text style={styles.infoText}>{this.state.consultationDoctorId !== this.state.linkedDoctor ? this.state.name+'-':''}{this.state.sex}-{this.state.age}岁</Text>
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
                    style={styles.chatRecord}
                >

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
                        onBlur={this.onContentSizeChangeReg.bind(this)}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            // WS.ws.onopen = () => {
                            //     WS.ws.send("{'chatRoomId':'"+chatRoomId+"','messageContent':'"+message+"'}")
                            // }
                        }}
                        activeOpacity={.8}
                    >
                        <View style={styles.sendBtn}>
                            <Text style={styles.sendText}>发送</Text>
                        </View>
                    </TouchableOpacity>
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

// 多行输入高度处理
    onContentSizeChange(event) {
        if (event.nativeEvent.contentSize.height >= 30) {
            this.setState({
                textareaHeight: event.nativeEvent.contentSize.height,
            })
        }

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

    onContentSizeChangeReg() {
        if (this.state.chatText === '') {
            this.refs.toast.show('请输入内容');
        }
    }

    submit() {

    }

    rightClick() {
        this.setState({
            rightMenuFlag: !this.state.rightMenuFlag,
        })
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
                console.log(responseData)
                if (responseData.status === '0') {
                    let urlArr = [];
                    for(let i = 0; i < responseData.pictureList.length;i++){
                        urlArr.push(
                            requestUrl.ImgIp+responseData.pictureList[i].pictureUrl
                        )
                    }
                    this.setState({
                        diseaseName: responseData.diseaseName,
                        consultationReason: responseData.consultationReason,
                        fee: responseData.fee,
                        age: responseData.age,
                        sex: responseData.sex,
                        name: responseData.name,
                        bigImgUrl: urlArr,
                        consultationDoctorId: responseData.consultationDoctorId,
                    })
                }
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
        fontSize: FONT_SIZE(14),
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
        padding: px2dp(16),
    },
    infoText: {
        fontSize: FONT_SIZE(16),
        color: '#333',
    },
    goalText: {
        fontSize: FONT_SIZE(15),
        color: '#333333',
        lineHeight: px2dp(26),
    },
    feeText: {
        fontSize: px2dp(16),
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
        width: px2dp(64),
        height: px2dp(61),
        borderRadius: px2dp(4),
        marginRight: px2dp(15),
        marginBottom: px2dp(12),
    },
    shrinkBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: px2dp(30),

    }
});
