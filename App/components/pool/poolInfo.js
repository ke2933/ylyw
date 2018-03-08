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
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Button from '../../common/Button';//按钮
import CountDown from '../../common/CountDown';// 倒计时
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import px2dp from "../../common/Tool";

export default class CaseHistoryInfo extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            beGood: "",// 擅长
            collectionNo: 0,// 收藏数
            consultationConclusionList: [],//
            consultationDepartmentName: "",//中医男科
            consultationDoctorName: "",//薛薛
            consultationFee: "",//800
            consultationHospitalName: "",//北京医院
            consultationId: "",//480b7edeb86c11e7b77800163e08d49b
            consultationReason: "",//我没病我没病我没病我没病我没病
            consultationTitleName: "",//专家
            diseaseName: "",//药物性聋
            fee: "",//234
            firstDoctorId: '',// 首诊id
            firstDepartmentName: "",//中医男科
            firstDoctorName: "",//薛薛
            firstHospitalName: "",//北京大学人民医院
            firstTitleName: "",//专家
            lookNo: 0,// 查看数
            name: "",//高科举
            phone: "",//18801370533
            pictureList: [],// 病历图片
            statusId: "",//dd768336b24911e7b77800163e08d49b
            statusName: "",//会诊中
            age: '',
            sex: '',
            bigImgUrl: [],
            beginTime: '',// 倒计时开始时间
            duration: 0,// 持续时间
            isLoading: false,
            loadingText: '',
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
            this.setState({
                beginTime: data.startTime,
                duration: data.duration,
            });
            let formData = new FormData();
            formData.append("consultationId", data.id);
            formData.append("type", "会诊");
            fetch(requestUrl.queryCase, {
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
                        for (let i = 0; i < responseData.pictureList.length; i++) {
                            urlArr.push(
                                requestUrl.ImgIp + responseData.pictureList[i].pictureUrl
                            )
                        }
                        this.setState({
                            beGood: responseData.beGood,// 擅长
                            collectionNo: responseData.collectionNo,// 收藏数
                            consultationConclusionList: responseData.consultationConclusionList,//
                            consultationDepartmentName: responseData.consultationDepartmentName,//中医男科
                            consultationDoctorName: responseData.consultationDoctorName,//薛薛
                            consultationFee: responseData.consultationFee,//800
                            consultationHospitalName: responseData.consultationHospitalName,//北京医院
                            consultationId: responseData.consultationId,//订单id
                            consultationReason: responseData.consultationReason,//会诊目的
                            consultationTitleName: responseData.consultationTitleName,//专家
                            diseaseName: responseData.diseaseName,//药物性聋
                            fee: responseData.fee,//234
                            firstDoctorId: responseData.firstDoctorId,// 首诊医生id
                            firstDepartmentName: responseData.firstDepartmentName,//中医男科
                            firstDoctorName: responseData.firstDoctorName,//首诊名字
                            firstHospitalName: responseData.firstHospitalName,//首诊医院
                            firstTitleName: responseData.firstTitleName,//专家
                            lookNo: responseData.lookNo,// 查看数
                            name: responseData.name,//高科举
                            phone: responseData.phone,//18801370533
                            pictureList: responseData.pictureList,// 病历图片
                            statusId: responseData.statusId,//dd768336b24911e7b77800163e08d49b
                            statusName: responseData.statusName,//会诊中
                            age: responseData.age,
                            sex: responseData.sex,
                            bigImgUrl: urlArr,
                        })
                    }
                })
                .catch(
                    (error) => {
                        console.log('error', error);
                    });
        }
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
                         goBack();
                     }}
                     data={{
                         'leftBtn': true,
                         'title': this.state.diseaseName,
                         'rightBtn': {
                             type: 'CountDown',
                             'assemblyName': CountDown,
                             "beginTime": this.state.beginTime,
                             "duration": this.state.duration
                         }
                     }}/>
                <ScrollView style={{flex: 1}}>
                    <View style={styles.statusBox}>
                        <Text style={styles.statusTitle}>基本信息</Text>
                        <Text style={styles.statusText}>{this.state.statusName}</Text>
                    </View>
                    <View style={styles.caseHistoryBox}>
                        <Text
                            style={styles.caseHistoryText}>患者信息：{this.state.sex}－{this.state.age}岁</Text>
                        {/*<Text style={styles.caseHistoryText}>患者手机号：{this.state.phone}</Text>*/}
                        <Text style={styles.caseHistoryText}>所在科室：{this.state.firstDepartmentName}</Text>
                        <Text
                            style={styles.caseHistoryText}>首诊医生：{this.state.firstDoctorName}－{this.state.firstTitleName}</Text>
                        <Text style={styles.caseHistoryText}>所属医院：{this.state.firstHospitalName}</Text>
                        <Text style={styles.caseHistoryText}>会诊科室：{this.state.consultationDepartmentName}</Text>
                        <Text style={styles.caseHistoryText}>会诊费用：¥{this.state.fee}</Text>
                    </View>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>会诊病历及附件拍照</Text>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.imgBox}>

                            <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}>
                                {this.renderCaseImg()}
                            </View>
                        </View>

                    </View>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>会诊目的及备注</Text>
                    </View>
                    <View style={styles.textBox}>
                        <Text style={styles.text}>{this.state.consultationReason}</Text>
                    </View>
                    {/*判断是不是自己的病例*/}
                    {this.state.firstDoctorId === UserInfo.doctorId ?
                        <Button text={'接收会诊'} style={{backgroundColor: '#DBDBDB'}} click={() => {
                        }}/>
                        :
                        <Button text={'接收会诊'} click={() => {
                            Alert.alert('', '确认接收会诊？', [
                                {
                                    text: '取消', onPress: () => {
                                    }
                                },
                                {
                                    text: '确认', onPress: () => {
                                        this.submit()
                                    }
                                },
                            ])
                        }}/>}

                </ScrollView>
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
                            this.props.navigation.navigate('ZoomImg', {data: this.state.bigImgUrl, index: i});
                        }}
                        key={i}
                    >
                        <Image style={styles.caseItemImg} source={{uri: imgArr[i]}}/>
                    </TouchableOpacity>
                )
            }
            return Temp;
        } else {
            return null;
        }


    }

    submit() {
        this.setState({
            isLoading: true,
            loadingText: '订单处理中...'
        });
        let formData = new FormData();
        formData.append("statusId", this.state.statusId);
        formData.append("consultationId", this.state.consultationId);
        console.log(formData);
        fetch(requestUrl.receiveCase, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status === '0') {
                    this.setState({
                        isLoading: false,
                        loadingText: '病历接收成功'
                    });
                    setTimeout(() => {
                        this.setState({isLoading: false});
                        OrderType = '会诊订单';
                        Status = '正在会诊';
                        RouteName.splice(0, RouteName.length);
                        // RouteName.push(this.props.navigation.state);
                        this.props.navigation.navigate('TabOrderPage')
                    }, 1000)
                } else if (responseData.status === '2') {
                    this.setState({isLoading: false});
                    this.refs.toast.show('接收失败请重试');
                } else if (responseData.status === '3') {
                    this.setState({
                        isLoading: false,
                        loadingText: '订单状态已发生改变'
                    });
                    setTimeout(() => {
                        this.setState({isLoading: false});
                        OrderType = '会诊订单';
                        Status = '正在会诊';
                        RouteName.splice(0, RouteName.length);
                        // RouteName.push(this.props.navigation.state);
                        this.props.navigation.navigate('TabOrderPage')
                    }, 1000)
                } else if (responseData.status === '4') {
                    this.setState({isLoading: false});
                    this.refs.toast.show('不在医生责任区域');
                } else if (responseData.status === '5') {
                    this.setState({isLoading: false});
                    this.refs.toast.show('订单价格高于医生价格');
                } else {
                    this.setState({isLoading: false});
                    this.refs.toast.show('接收失败，请重试');
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                    this.setState({isLoading: false});
                });

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
    },
    // 病历状态
    statusBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: px2dp(34),
        paddingLeft: px2dp(20),
        paddingRight: px2dp(22),
    },
    statusTitle: {
        fontSize: FONT_SIZE(14),
        color: '#898989',
    },
    statusText: {
        fontSize: FONT_SIZE(14),
        color: '#898989',
    },
    // 病历内容
    caseHistoryBox: {
        padding: px2dp(20),
        backgroundColor: '#fff',
    },
    caseHistoryText: {
        fontSize: FONT_SIZE(14),
        color: '#333333',
        lineHeight: px2dp(25),
    },
    //title
    titleBox: {
        height: px2dp(35),
        justifyContent: 'center',
        paddingLeft: px2dp(19),
    },
    title: {
        fontSize: FONT_SIZE(14),
        color: '#898989',
    },
    // 数据块
    content: {
        backgroundColor: "#fff",
    },
    // 图片数据块
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
    deleteClick: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    textBox: {
        paddingTop: px2dp(10),
        paddingBottom: px2dp(10),
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        backgroundColor: '#fff',
    },
    text: {
        fontSize: FONT_SIZE(14),
        color: '#333333',
        lineHeight: px2dp(25),
    }
});
