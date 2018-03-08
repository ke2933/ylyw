import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    BackHandler,
    WebView,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Button from '../../common/Button';//按钮
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import PlayAudio from '../../common/playAudio';
import px2dp from "../../common/Tool";

export default class libraryInfo extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            startFlag: false,
            startText: '未收藏',
            beGood: "",//擅长
            collectionNo: 0,//收藏数
            collectionType: "1",// 是否收藏
            consultationDepartmentName: "",//
            consultationDoctorName: "",
            consultationHospitalName: "",
            consultationReason: "",
            consultationTitleName: "",
            diseaseName: "",
            firstDepartmentName: "",
            firstDoctorName: "",
            firstHospitalName: "",
            firstTitleName: "",
            lookNo: 0,//查看量
            medicalRecordBaseId: "",
            bigImgArr: [],
            sex: '',
            age: '',
            conclusionContext: '',
            conclusionVideo: '',
            isLoading: true,
            consultationId: '',
        }
    }

    componentWillMount() {
        RouteName.push(this.props.navigation.state);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }

        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params.data;
            let formData = new FormData();
            formData.append("medicalRecordId", data.id);
            fetch(requestUrl.queryMedicalRecordInfo, {
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
                        let pictureList = responseData.pictureList;
                        let bigImgArr = [];
                        for (let i = 0; i < pictureList.length; i++) {
                            bigImgArr.push(
                                requestUrl.ImgIp + pictureList[i].pictureUrl
                            )
                        }
                        if (responseData.conclusionVideo) {
                            this.setState({
                                conclusionVideo: requestUrl.ImgIp + responseData.conclusionVideo,
                            })
                        } else {
                            this.setState({
                                isLoading: false,
                                conclusionVideo: '',
                            });
                        }
                        this.setState({
                            beGood: responseData.beGood,
                            collectionNo: responseData.collectionNo,
                            collectionType: responseData.collectionType,
                            consultationDepartmentName: responseData.consultationDepartmentName,
                            consultationDoctorName: responseData.consultationDoctorName,
                            consultationHospitalName: responseData.consultationHospitalName,
                            consultationReason: responseData.consultationReason,
                            consultationTitleName: responseData.consultationTitleName,
                            diseaseName: responseData.diseaseName,
                            firstDepartmentName: responseData.firstDepartmentName,
                            firstDoctorName: responseData.firstDoctorName,
                            firstHospitalName: responseData.firstHospitalName,
                            firstTitleName: responseData.firstTitleName,
                            lookNo: responseData.lookNo,
                            medicalRecordBaseId: responseData.medicalRecordBaseId,
                            bigImgArr: bigImgArr,
                            sex: responseData.sex,
                            age: responseData.age,
                            conclusionContext: responseData.conclusionContext,
                            consultationId: responseData.consultationId,

                        })
                    } else {
                        this.setState({isLoading: false});
                    }
                })
                .catch(
                    (error) => {
                        this.setState({isLoaded: false,});
                        console.log('error', error);
                    });
        }
    }

    componentWillUnmount() {
        if (this.state.conclusionVideo !== '') {
            this.refs.playAudio._pause();
        }
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
                    networkActivityIndicatorVisible={this.state.isLoading}
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
                         'rightBtn': {
                             type: 'btn',
                             'btnText': this.state.collectionType === '1' ? '已收藏' : '收藏',
                             click: this.start.bind(this),
                             textStyle: {color: '#fff'}
                         }
                     }}/>
                <ScrollView
                    style={{
                        flex: 1,
                        backgroundColor: '#efefef'
                    }}
                >
                    <View style={styles.titleBox}>
                        <Text style={styles.titleText}>基本信息</Text>
                        <View style={styles.starContent}>
                            <View style={styles.browseBox}>
                                <Image source={require('../../images/browse_false.png')}/>
                                <Text style={styles.browseText}>{this.state.lookNo}</Text>
                            </View>
                            <View style={styles.starBox}>
                                <Image
                                    source={this.state.collectionType === '1' ? require('../../images/collection_true.png') : require('../../images/collection_false.png')}/>
                                <Text style={styles.starText}>{this.state.collectionNo}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.libraryInfo}>
                        <Text style={styles.libraryInfoText}>患者信息：{this.state.sex}－{this.state.age}岁</Text>
                        <Text style={styles.libraryInfoText}>所在科室：{this.state.firstDepartmentName}</Text>
                        <Text
                            style={styles.libraryInfoText}>首诊医生：{this.state.firstDoctorName}－{this.state.firstTitleName}</Text>
                        <Text style={styles.libraryInfoText}>所属医院：{this.state.firstHospitalName}</Text>
                        <Text style={styles.libraryInfoText}>会诊科室：{this.state.consultationTitleName}</Text>
                        <Text
                            style={styles.libraryInfoText}>会诊医生：{this.state.consultationDoctorName}－{this.state.consultationTitleName}</Text>
                        <Text style={styles.libraryInfoText}>所属医院：{this.state.consultationHospitalName}</Text>

                    </View>

                    <View style={styles.titleBox}>
                        <Text style={styles.titleText}>会诊病历及附件拍照</Text>
                    </View>
                    <View style={styles.content}>

                        <View style={styles.imgBox}>
                            {this.renderCaseImg()}
                        </View>
                    </View>
                    <View style={styles.titleBox}>
                        <Text style={styles.titleText}>会诊目的及备注</Text>
                    </View>
                    <View style={styles.textBox}>
                        <Text style={styles.text}>{this.state.consultationReason}</Text>

                    </View>
                    <View style={styles.titleBox}>
                        <Text style={styles.titleText}>会诊意见书</Text>
                    </View>
                    <View style={styles.conclusionBox}>
                        {this.state.conclusionVideo !== '' ? <View style={styles.playAudioContent}>
                                <PlayAudio
                                    ref='playAudio'
                                    isLoad={(data) => {
                                        this.setState({
                                            isLoading: data,
                                        })
                                    }}
                                    data={this.state.conclusionVideo}/>
                            </View>
                            : null
                        }
                        <Text style={styles.conclusionText}>{this.state.conclusionContext}</Text>
                    </View>
                    {/*<Button text={'会诊记录'} click={this.submit.bind(this)}/>*/}
                </ScrollView>
                <Toast
                    ref='toast'
                    style={{backgroundColor: '#333333', borderRadius: 10,}}
                    position={'center'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeInDuration={3000}
                    opacity={.8}
                />
            </View>
        );
    }


    // 展示上传的图片
    renderCaseImg() {
        let imgArr = this.state.bigImgArr;
        if (imgArr.length >= 0) {
            let Temp = [];
            for (let i = 0; i < imgArr.length; i++) {
                Temp.push(
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => {
                            this.props.navigation.navigate('ZoomImg', {data: this.state.bigImgArr, index: i})
                        }}
                        key={i}
                    >
                        <View style={styles.caseItemBox}>
                            <Image style={styles.caseItemImg} source={{uri: imgArr[i]}}/>
                        </View>
                    </TouchableOpacity>
                )
            }
            return Temp;
        } else {
            return null;
        }


    }


    start() {
        if (this.state.collectionType === '1') {
            this.collectionFecth('1');
        } else {
            this.collectionFecth('0');
        }

    }

    collectionFecth(collectionType) {
        this.setState({isLoading: true});
        let formData = new FormData();
        formData.append("medicalRecordBaseId", this.state.medicalRecordBaseId);
        formData.append("collectionType", collectionType);
        fetch(requestUrl.collection, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status === '0') {
                    this.setState({isLoading: false});
                    if (responseData.oauthStatus === '1') {
                        this.refs.toast.show('收藏成功');
                        this.setState({
                            collectionType: responseData.oauthStatus,
                            collectionNo: this.state.collectionNo * 1 + 1,
                        })
                    } else {
                        this.refs.toast.show('已取消收藏');
                        this.setState({
                            collectionType: responseData.oauthStatus,
                            collectionNo: this.state.collectionNo * 1 - 1,
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

    submit() {
        this.props.navigation.navigate('ChatHistory', {data: {"consultationId": this.state.consultationId}});
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
    },
    titleBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: px2dp(34),
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
    },
    titleText: {
        fontSize: FONT_SIZE(14),
        color: '#898989',
    },
    starContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    browseBox: {
        marginLeft: px2dp(10),
        flexDirection: 'row',
        alignItems: 'center',
    },
    browseText: {
        marginLeft: px2dp(5),
        fontSize: FONT_SIZE(12),
        color: '#898989',
    },

    starBox: {
        marginLeft: px2dp(10),
        flexDirection: 'row',
        alignItems: 'center',
    },
    starText: {
        marginLeft: px2dp(5),
        fontSize: FONT_SIZE(12),
        color: '#898989',
    },
    libraryInfo: {
        flex: 1,
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        paddingTop: px2dp(7),
        paddingBottom: px2dp(7),
        backgroundColor: '#fff',
    },

    infoBox: {
        flexDirection: 'row',
        flex: 1,
    },
    libraryInfoText: {
        fontSize: FONT_SIZE(14),
        color: '#333',
        lineHeight: px2dp(28),
    },
    content: {
        backgroundColor: "#fff",
    },
    // 图片数据块
    imgBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: px2dp(15),
        paddingLeft: px2dp(19),
        paddingRight: px2dp(19),
    },
    // 病理图片
    caseItemImg: {
        width: px2dp(60),
        height: px2dp(60),
        borderRadius: px2dp(4),
        marginBottom: px2dp(12),
        marginRight: px2dp(15),
    },
    textBox: {
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        paddingTop: px2dp(15),
        paddingBottom: px2dp(15),
        backgroundColor: '#fff',
    },
    text: {
        fontSize: FONT_SIZE(14),
        color: '#333',
        lineHeight: px2dp(23),
    },
    conclusionBox: {
        backgroundColor: '#fff',
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        paddingTop: px2dp(10),
        paddingBottom: px2dp(10),
    },
    conclusionText: {
        fontSize: FONT_SIZE(14),
        color: '#333',
        lineHeight: px2dp(23),
    },
    playAudioContent: {
        flex: 1,
        borderBottomWidth: Pixel,
        borderBottomColor: '#e2e9ff',
        paddingBottom: px2dp(10),
    },
});
