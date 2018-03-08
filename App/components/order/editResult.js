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
    BackHandler,
    AsyncStorage,
    Keyboard,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import px2dp from "../../common/Tool";
import Audio from '../../common/Audio';

export default class EditResult extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            tab1: true,
            bigImgUrl: [],
            consultationReason: '',
            consultationId: "",//订单id
            statusId: "",//会诊状态id
            result: "",//会诊结论
            saveType: "",//保存类型(0/1/2,0草稿,1提交结论不提供学习,2提交结论并提供学习)
            videoUrl: '',
            statusName: '',
            isLoading: true,
            loadingText: '',
            conclusionContext: '',// 草稿文字
            historyFlag: false,
            conclusionVideo: '',// 草稿视频
            whenLongs: 0,// 音频时长
            keyHeight: 0,
            scrollY: 0,
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
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params.data;
            this.setState({
                bigImgUrl: data.bigImgUrl,
                consultationReason: data.consultationReason,
                consultationId: data.consultationId,
                statusId: data.statusId,
                statusName: data.statusName,
            })
        }
    }

    _keyboardDidShow(e) {
        this.setState({
            keyHeight: e.endCoordinates.height,
        })
    }

    _keyboardDidHide() {
        this.setState({
            keyHeight: 0,
        })
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.refs.audio._stop();
        this.refs.audio._pause();
    }

    componentDidMount() {
        //草稿信息查询
        let formData = new FormData();
        formData.append("consultationId", this.state.consultationId);//
        fetch(requestUrl.viewResults, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                // this.setState({isLoading: false,});
                console.log(responseData);
                if (responseData.status === '0') {
                    this.setState({
                        result: responseData.conclusionContext,
                        conclusionContext: responseData.conclusionContext,
                        historyFlag: true,
                        videoUrl: requestUrl.ImgIp + responseData.conclusionVideo,
                        conclusionVideo: requestUrl.ImgIp + responseData.conclusionVideo,
                        delFile: responseData.conclusionVideo,
                    })
                } else {
                    this.setState({
                        historyFlag: true,
                        isLoading: false,
                    })
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false, historyFlag: true});
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

                         goBack()
                     }}
                     data={{
                         'leftBtn': true,
                         'title': '会诊意见书',
                         rightBtn: {type: 'false'}
                     }}/>
                <View style={styles.navBtn}>
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => {
                            this.tabClick('1');
                        }}
                    >
                        <View style={[styles.tabBox, {backgroundColor: this.state.tab1 ? "#566CB7" : "#fff"}]}>
                            <Text
                                style={[styles.tabText, {color: this.state.tab1 ? '#fff' : '#333'}]}>病历附件</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => {
                            this.tabClick('2')
                        }}
                    >
                        <View style={[styles.tabBox, {backgroundColor: this.state.tab1 ? "#fff" : "#566CB7"}]}>
                            <Text style={[styles.tabText, {color: this.state.tab1 ? '#333' : '#fff'}]}>会诊备注</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{
                    height: SCREEN_HEIGHT - 65 - px2dp(50) - this.state.keyHeight,
                }}>
                    <ScrollView
                        ref="_scroll"
                        style={{flex: 1}}>
                        {this.state.tab1 ?
                            <View style={styles.exhibitionBox}>
                                <ScrollView
                                    style={{
                                        flex: 1,
                                    }}
                                >
                                    <View style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }}>
                                        {this.renderCaseImg()}
                                    </View>

                                </ScrollView>
                            </View>
                            :
                            <View style={styles.exhibitionBox}>
                                <ScrollView
                                    style={{
                                        flex: 1,
                                    }}
                                >
                                    <Text style={styles.diagnosisText}>{this.state.consultationReason}</Text>
                                </ScrollView>
                            </View>
                        }
                        <View
                            style={styles.editResultBox}
                            onLayout={(e) => {
                                this.setState({
                                    scrollY: e.nativeEvent.layout.y,
                                })
                            }}
                        >
                            <TextInput
                                style={styles.textareaStyle}
                                placeholder={'请在这里填写会诊意见'}
                                placeholderTextColor={'#c7c7cd'}
                                multiline={true}
                                onChangeText={(text) => this.setState({result: text})}
                                onContentSizeChange={this.onContentSizeChange.bind(this)}
                                underlineColorAndroid={'transparent'}
                                // onBlur={this.onContentSizeChangeReg.bind(this)}
                                defaultValue={this.state.conclusionContext}
                                onFocus={() => {
                                    this.refs._scroll.scrollTo({
                                        x: 0,
                                        y: this.state.scrollY,
                                        animated: true
                                    })
                                }}
                            />
                            <View style={styles.audioContent}>
                                <Audio
                                    ref="audio"
                                    data={this.state}
                                    isLoad={(data) => {
                                        this.setState({
                                            isLoading: data,
                                        })
                                    }}
                                    callbackTime={(data) => {
                                        this.setState({
                                            whenLongs: data,
                                        })
                                    }}
                                    callback={(data) => {
                                        this.setState({
                                            videoUrl: data,
                                        })
                                    }}/>
                            </View>
                            {/*<View style={styles.videoBox}>*/}
                            {/*<TouchableOpacity*/}
                            {/*onPress={() => {*/}
                            {/*// this.state.videoUrl === '' ? this.refs.toast.show('请录制或选择视频资源') : navigate('VideoPlay', {data: this.state});*/}
                            {/*}}*/}
                            {/*activeOpacity={.8}*/}
                            {/*>*/}
                            {/*<View style={styles.playBox}>*/}
                            {/*<Text style={styles.playText}>播放视频</Text>*/}
                            {/*</View>*/}
                            {/*</TouchableOpacity>*/}
                            {/*<TouchableOpacity*/}
                            {/*onPress={() => {*/}
                            {/*this.openMycamera();*/}
                            {/*}}*/}
                            {/*activeOpacity={.8}*/}
                            {/*>*/}
                            {/*<View style={styles.RecordingBox}>*/}
                            {/*<Image source={require('../../images/videotape.png')}/>*/}
                            {/*<Text style={styles.RecordingText}>录制视频</Text>*/}
                            {/*</View>*/}
                            {/*</TouchableOpacity>*/}
                            {/*</View>*/}
                        </View>
                        <View style={styles.btns}>
                            <TouchableOpacity
                                activeOpacity={.8}
                                onPress={() => {
                                    this.submit('0');
                                }}
                            >
                                <View style={styles.btnBox}>
                                    <Text style={styles.btnText}>暂存</Text>
                                </View>

                            </TouchableOpacity>
                            {this.state.statusName === '会诊中' ?

                                <TouchableOpacity
                                    activeOpacity={.8}
                                    onPress={() => {
                                        this.submit('1');
                                    }}
                                >
                                    <View style={styles.btnBox}>
                                        <Text style={styles.btnText}>提交</Text>
                                    </View>
                                </TouchableOpacity>
                                : null}
                        </View>
                    </ScrollView>
                </View>
                <Toast
                    ref='toast'
                    style={{backgroundColor: '#333333', borderRadius: 10,}}
                    position={'center'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeInDuration={800}
                    fadeOutDuration={800}
                    opacity={.8}
                />
            </View>
        );
    }

    tabClick(index) {
        if (index === '1') {
            this.setState({
                tab1: true,
            })
        } else {
            this.setState({
                tab1: false,
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
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => {
                            this.props.navigation.navigate('ZoomImg', {data: this.state.bigImgUrl, 'index': i});
                        }}
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

    // 多行输入高度处理
    onContentSizeChange(event) {
        this.setState({
            textareaHeight: event.nativeEvent.contentSize.height,
        })
    }

    // onContentSizeChangeReg() {
    //     if (this.state.result === '') {
    //         this.refs.toast.show('请输入您的会诊意见');
    //         return;
    //     }
    // }

    confirm() {
        Alert.alert('', '您是否希望将病历存放至病例库，供其他医生学习分享', [
            {text: '我不愿意', onPress: () => this.editResult('1')},
            {text: '可以', onPress: () => this.editResult('2')},
        ])
    }


    // 提交结果
    editResult(saveType) {
        saveType === '0' ? this.setState({isLoading: true, loadingText: '保存中...'}) : this.setState({
            isLoading: true,
            loadingText: '正在提交...'
        });

        let formData = new FormData();
        formData.append("consultationId", this.state.consultationId);//

        formData.append("statusId", this.state.statusId);//
        formData.append("result", this.state.result);//
        formData.append("saveType", saveType);//
        if (this.state.videoUrl && this.state.conclusionVideo !== this.state.videoUrl) {
            let videoFile = {
                uri: IOS ? this.state.videoUrl : 'file://' + this.state.videoUrl,
                type: 'multipart/form-data',
                name: 'audio'
            };
            formData.append("file", videoFile);

        }
        formData.append("whenLong", this.state.whenLongs);

        console.log(formData);
        fetch(requestUrl.editResult, {
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
                    this.setState({loadingText: '提交成功'});
                    AsyncStorage.getItem(UserInfo.doctorId + 'CIArr').then((result) => {
                        if (result) {
                            let CIArr = JSON.parse(result);
                            if (CIArr && CIArr[this.state.consultationId]) {
                                CIArr.count -= CIArr[this.state.consultationId].length;
                                GroupNum -= CIArr[this.state.consultationId].length;
                                CIArr[this.state.consultationId].splice(0, CIArr[data.consultationId].length);
                                AsyncStorage.setItem(UserInfo.doctorId + 'CIArr', JSON.stringify(CIArr)).then(() => {
                                    console.log('成功');
                                }).catch((error) => {
                                    console.log('失败');
                                });
                            }
                        }
                    });
                    setTimeout(() => {
                        this.setState({isLoading: false,});
                        this.props.navigation.navigate('EditSuccess');
                    }, 1000);
                } else if (responseData.status === '1') {
                    this.setState({isLoading: false,});
                    this.refs.toast.show('提交失败,请重试');
                } else if (responseData.status === '2') {
                    this.setState({isLoading: false,});
                    this.refs.toast.show('提交失败,请完善信息');
                } else if (responseData.status === '3') {
                    this.setState({loadingText: '订单状态已发生改变'});
                    setTimeout(() => {
                        this.setState({isLoading: false,});
                        this.props.navigation.navigate('TabOrderPage');
                    }, 1000)
                } else if (responseData.status === '4') {
                    this.refs.toast.show('订单已结束');
                    setTimeout(() => {
                        this.setState({isLoading: false,});
                        this.props.navigation.navigate('TabOrderPage');
                    }, 1000)
                } else if (responseData.status === '5') {
                    this.setState({loadingText: '保存成功'});
                    setTimeout(() => {
                        this.setState({isLoading: false,});
                        RouteName.pop();
                        this.props.navigation.goBack();
                    }, 1000)
                } else {
                    this.setState({isLoading: false,});
                    this.refs.toast.show('提交失败,请重试');
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                    console.log('error', error);
                });
    }

    submit(saveType) {
        if (saveType === '0') {
            // 存草稿
            if (this.state.result !== '' || this.state.videoUrl !== '' && this.state.videoUrl !== requestUrl.ImgIp) {
                if (this.state.conclusionContext === this.state.result && this.state.videoUrl === this.state.conclusionVideo) {
                    this.refs.toast.show('您的会诊意见未做出修改');
                    return;
                } else {
                    this.editResult(saveType);
                }
            } else {
                this.refs.toast.show('请编辑会诊意见或语音');
            }
        } else {
            // 提交
            if (this.state.result === '') {
                this.refs.toast.show('请编辑会诊意见');
            } else if (this.state.videoUrl === '' || this.state.videoUrl === requestUrl.ImgIp) {
                this.refs.toast.show('请编辑语音');
            } else {
                Alert.alert('', '是否确认提交', [
                    {
                        text: '取消', onPress: () => {
                        }
                    },
                    {text: '确认', onPress: this.confirm.bind(this)},
                ])
            }
        }


    }
}

const
    styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#EFEFEF',
        },
        navBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            height: px2dp(50),
            backgroundColor: '#fff',
        },
        tabBox: {
            justifyContent: 'center',
            alignItems: 'center',
            width: px2dp(150),
            height: px2dp(30),
            borderRadius: px2dp(10),
            backgroundColor: '#fff',
        },

        tabText: {
            fontSize: FONT_SIZE(17),
        },
        // 附件box
        exhibitionBox: {
            padding: px2dp(10),
            marginTop: px2dp(5),
            marginLeft: px2dp(7.5),
            marginRight: px2dp(7.5),
            width: px2dp(360),
            minHeight: px2dp(200),
            borderRadius: px2dp(10),
            backgroundColor: '#fff',
            borderWidth: Pixel,
            borderColor: '#898989',
        },
        caseItemImg: {
            width: px2dp(64),
            height: px2dp(61),
            borderRadius: px2dp(4),
            marginRight: px2dp(15),
            marginBottom: px2dp(15),
        },
        diagnosisText: {
            fontSize: FONT_SIZE(16),
            color: '#333',
            lineHeight: px2dp(25),
        },
        editResultBox: {
            padding: px2dp(10),
            marginTop: px2dp(8),
            marginLeft: px2dp(7.5),
            marginRight: px2dp(7.5),
            width: px2dp(360),
            height: px2dp(245),
            borderRadius: px2dp(10),
            backgroundColor: '#fff',
            borderWidth: Pixel,
            borderColor: '#898989',
        },
        textareaStyle: {
            flex: 1,
            fontSize: FONT_SIZE(16),
            color: '#333',
            textAlignVertical: 'top',
        },
        audioContent: {
            height: px2dp(35),
        },
        videoBox: {
            paddingTop: px2dp(8),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        playText: {
            fontSize: FONT_SIZE(14),
            color: '#333',
        },
        RecordingBox: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        RecordingText: {
            marginLeft: px2dp(8),
            fontSize: FONT_SIZE(14),
            color: '#333',
        },
        btns: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: px2dp(38),
            marginBottom: px2dp(67),
        },
        btnBox: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#566cb7',
            width: px2dp(150),
            height: px2dp(46),
            borderRadius: px2dp(10),
        },
        btnText: {
            fontSize: px2dp(18),
            color: '#fffefe',
        },
        backgroundVideo: {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        }

    });
