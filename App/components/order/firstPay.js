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
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import px2dp from "../../common/Tool";

export default class FirstReply extends Component {
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
            consultationHospitalId: '',
            consultationDeptId: '',
            consultationHospitalName: "",//北京医院
            consultationDoctorId: '',
            consultationId: "",//480b7edeb86c11e7b77800163e08d49b
            consultationReason: "",//我没病我没病我没病我没病我没病
            consultationTitleName: "",//专家
            diseaseName: "",//药物性聋
            consultationDeptInfo: '',// 科室描述
            fee: "",//234
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
            areaId: '',
            thisCity: '',
            deptLabel: "",//
            hospitalLable: "",
            photo: "",//
            orderStatus: '',
            cityName: '',// 投入病历池地区
            hospitalType: '',
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
                beginTime: data.beginTime,
                duration: data.duration,
            });
            let formData = new FormData();
            formData.append("consultationId", data.id);
            formData.append("type", "首诊");
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
                            consultationDoctorId: responseData.consultationDoctorId,
                            consultationDoctorName: responseData.consultationDoctorName,//薛薛
                            consultationFee: responseData.consultationFee,//800
                            consultationHospitalId: responseData.consultationHospitalId,
                            consultationHospitalName: responseData.consultationHospitalName,//北京医院
                            consultationId: responseData.consultationId,//订单id
                            consultationReason: responseData.consultationReason,//会诊目的
                            consultationTitleName: responseData.consultationTitleName,//专家
                            diseaseName: responseData.diseaseName,//药物性聋
                            consultationDeptId: responseData.consultationDeptId,
                            fee: responseData.fee,//234
                            firstDepartmentName: responseData.firstDepartmentName,//中医男科
                            firstDoctorName: responseData.firstDoctorName,//薛薛
                            firstHospitalName: responseData.firstHospitalName,//北京大学人民医院
                            firstTitleName: responseData.firstTitleName,//专家
                            consultationDeptInfo: responseData.consultationDeptInfo,// 科室描述
                            lookNo: responseData.lookNo,// 查看数
                            name: responseData.name,//高科举
                            phone: responseData.phone,//18801370533
                            pictureList: responseData.pictureList,// 病历图片
                            statusId: responseData.statusId,//dd768336b24911e7b77800163e08d49b
                            statusName: responseData.statusName,//会诊中
                            age: responseData.age,
                            sex: responseData.sex,
                            bigImgUrl: urlArr,
                            areaId: responseData.areaId,
                            thisCity: responseData.thisCity,
                            deptLabel: responseData.deptLabel,
                            hospitalLable: responseData.hospitalLable,
                            photo: requestUrl.ImgIp + responseData.photo,
                            orderStatus: responseData.orderStatus,// 状态
                            cityName: responseData.cityName,
                            hospitalType: responseData.hospitalType,
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
                <StatusBar//状态栏
                    animated={true}//是否动画
                    hidden={false}//是否隐藏
                    backgroundColor={'#000'}//android 设置状态栏背景颜色
                    translucent={false}//android 设置状态栏是否为透明
                    showHideTransition="fade"//IOS状态栏改变时动画 fade:默认 slide
                    // networkActivityIndicatorVisible={ this.state.isLoading }//
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
                             type: false,
                             'assemblyName': CountDown,
                             "beginTime": this.state.beginTime,
                             "duration": this.state.duration
                         }
                     }}/>
                <View style={styles.noticeBox}>
                    <Text style={styles.noticeText}>该订单尚未支付</Text>
                </View>
                <ScrollView
                    style={{flex: 1, backgroundColor: '#efefef'}}
                >

                    <View style={styles.statusBox}>
                        <Text style={styles.statusTitle}>基本信息</Text>
                        <Text style={styles.statusText}>{this.state.statusName}</Text>
                    </View>
                    <View style={styles.caseHistoryBox}>
                        <Text
                            style={styles.caseHistoryText}>患者信息：{this.state.name}</Text>
                        <Text style={styles.caseHistoryText}>患者手机：{this.state.phone}</Text>
                        <Text style={styles.caseHistoryText}>所在科室：{this.state.firstDepartmentName}</Text>
                        <Text
                            style={styles.caseHistoryText}>首诊医生：{this.state.firstDoctorName}－{this.state.firstTitleName}</Text>
                        <Text style={styles.caseHistoryText}>所属医院：{this.state.firstHospitalName}</Text>
                        {/*<Text style={styles.caseHistoryText}>会诊费用：¥{this.state.fee}</Text>*/}
                    </View>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>会诊病历及附件拍照</Text>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.imgBox}>

                            {this.renderCaseImg()}
                        </View>

                    </View>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>会诊目的及备注</Text>
                    </View>
                    <View style={styles.textBox}>
                        <Text style={styles.text}>{this.state.consultationReason}</Text>
                    </View>
                    {this.invitedDoctor()}
                    {IPhoneX ? <View style={{height: 34,}}></View> : null}
                </ScrollView>
            </View>
        );
    }

    // 展示上传的图片
    renderCaseImg() {
        let imgArr = this.state.pictureList;
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
                        <View style={styles.caseItemBox}>
                            <Image style={styles.caseItemImg} source={{uri: requestUrl.ImgIp + imgArr[i].pictureUrl}}/>
                        </View>
                    </TouchableOpacity>
                );
            }
            return Temp;
        } else {
            return null;
        }


    }

    invitedDoctor() {
        const {navigate} = this.props.navigation;
        if (this.state.orderStatus === '显示医院') {
            return (
                <View style={styles.poolBox}>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>已选择邀请</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            navigate('DoctorList', {data: this.state})
                        }}
                        activeOpacity={.8}
                    >
                        <View style={styles.hospitalContent}>
                            <View style={styles.topBox}>
                                <View style={styles.consultationHospitalNameBox}>
                                    <Text numberOfLines={2}
                                          style={styles.consultationHospitalNameText}>{this.state.consultationHospitalName}</Text>
                                </View>
                                <View style={styles.hospitalDetailBox}>
                                    <Text numberOfLines={1}
                                          style={styles.hospitalDetailText}>{this.state.consultationDeptInfo}</Text>
                                </View>
                            </View>
                            <View style={styles.bottomBox}>
                                <View style={styles.hospitalLableContent}>
                                    {this.state.areaId === this.state.thisCity ?
                                        <View style={styles.areaLableBox}>
                                            <Text style={styles.areaLableText}>本省</Text>
                                        </View> : null}
                                    {this.state.hospitalLable > 0 ? <View style={styles.hospitalLabelBox}>
                                        <Text style={styles.hospitalLabelText}>顶级医院</Text>
                                    </View> : null}
                                    {this.state.hospitalLable === 0 ? <View style={styles.hospitalLabelBox}>
                                        <Text style={styles.hospitalLabelText}>知名医院</Text>
                                    </View> : null}
                                    {this.state.hospitalType ? <View style={styles.hospitalLabelBox}>
                                        <Text style={styles.hospitalLabelText}>{this.state.hospitalType}</Text>
                                    </View> : null}
                                    {this.state.deptLabel > 0 ? <View style={styles.hospitalLabelBox}>
                                        <Text style={styles.hospitalLabelText}>顶级科室</Text>
                                    </View> : null}
                                    {this.state.deptLabel === 0 ? <View style={styles.hospitalLabelBox}>
                                        <Text style={styles.hospitalLabelText}>知名科室</Text>
                                    </View> : null}
                                </View>
                                <Image source={require('../../images/arrow_gray_right.png')}/>
                            </View>
                        </View>
                    </TouchableOpacity>

                </View>
            );
        } else if (this.state.orderStatus === '病历池') {
            return (
                <View>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>已选择邀请</Text>
                    </View>
                    <View style={styles.poolContent}>
                        <Text style={styles.poolTitle}>投入病历池</Text>
                        <Text
                            style={styles.poolText}>{this.state.cityName === '中国' ? '全国' : this.state.cityName}-{this.state.consultationHospitalName ? this.state.consultationHospitalName : '全部医院'}-{this.state.consultationDepartmentName}(病历池为一个范围，范围内的医生将为您提供最负责任的会诊意见书。)</Text>
                        <View style={styles.poolBottomBox}>
                            <Text style={styles.feeText}>¥{this.state.fee}</Text>
                        </View>
                    </View>
                </View>
            )
        } else if (this.state.orderStatus === '显示医生') {
            return (
                <View>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>已选择邀请</Text>
                    </View>
                    <View style={styles.textBox}>
                        <TouchableOpacity
                            onPress={() => {
                                navigate('InviteDoctorInfo', {data: this.state})
                            }}
                            activeOpacity={.8}
                        >
                            <View style={styles.doctorItem}>
                                <View style={styles.doctorItemTop}>
                                    <View style={styles.portraitBox}>
                                        <Image style={styles.portraitImg} source={{uri: this.state.photo}}/>
                                        {this.state.thisCity === this.state.areaId ?
                                            <View style={styles.docareaLableBox}>
                                                <Text style={styles.docareaLableText}>本省</Text>
                                            </View> : null}
                                    </View>
                                    <View style={styles.userInfo}>
                                        <View style={styles.basicInfo}>
                                            <Text style={styles.doctorName}>{this.state.consultationDoctorName}</Text>
                                            <Text
                                                style={styles.departmentName}>{this.state.consultationDepartmentName}</Text>
                                            <Text style={styles.titleName}>{this.state.consultationTitleName}</Text>
                                        </View>
                                        <Text style={styles.hospitalName}>{this.state.consultationHospitalName}</Text>
                                        <Text numberOfLines={2} style={styles.beGood}>{this.state.beGood}</Text>
                                    </View>
                                </View>
                                <View style={styles.doctorItemBottom}>
                                    <View style={styles.hospitalLableContent}>
                                        {this.state.hospitalType ? <View style={styles.hospitalLabelBox}>
                                            <Text style={styles.hospitalLabelText}>{this.state.hospitalType}</Text>
                                        </View> : null}
                                        {this.state.deptLabel > 0 ? <View style={styles.hospitalLabelBox}>
                                            <Text style={styles.hospitalLabelText}>顶级科室</Text>
                                        </View> : null}
                                        {this.state.deptLabel === '0' ? <View style={styles.hospitalLabelBox}>
                                            <Text style={styles.hospitalLabelText}>知名科室</Text>
                                        </View> : null}
                                    </View>
                                    <Text style={styles.fee}>¥{this.state.fee}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return null;
        }

    }

    submit() {
        this.props.navigation.navigate('FirstChat', {data: this.state});
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
    imgBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: px2dp(15),
        paddingLeft: px2dp(19),
        paddingRight: px2dp(19),
    },
    // 病理图片
    caseItemBox: {
        position: 'relative',
        marginRight: px2dp(11),
        width: px2dp(60),
        height: px2dp(60),
        marginBottom: px2dp(15),
    },
    caseItemImg: {
        width: px2dp(60),
        height: px2dp(60),
        borderRadius: px2dp(4),
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
    },
    // 医生模块
    doctorItem: {
        marginBottom: px2dp(6),
        backgroundColor: '#fff',
    },
    doctorItemTop: {
        flexDirection: 'row',
        paddingTop: px2dp(8),
        paddingLeft: px2dp(12),
        paddingRight: px2dp(20),
        borderBottomColor: '#d6e1e8',
        borderBottomWidth: Pixel,
    },
    // 头像
    portraitBox: {
        marginRight: px2dp(12),
        marginBottom: px2dp(12),
        width: px2dp(50),
        alignItems: 'center',
    },
    portraitImg: {
        marginBottom: px2dp(9),
        width: px2dp(50),
        height: px2dp(50),
        borderRadius: px2dp(25),
    },
    docareaLableBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(38),
        height: px2dp(18),
        backgroundColor: '#f08058',
        borderRadius: px2dp(9),
    },
    docareaLableText: {
        fontSize: FONT_SIZE(11),
        color: '#fff',
    },
    // 信息
    userInfo: {
        flex: 1,
    },
    basicInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(18),
    },
    doctorName: {
        marginRight: px2dp(8),
        fontSize: FONT_SIZE(19),
        color: '#333333',
    },
    departmentName: {
        marginRight: px2dp(10),
        fontSize: FONT_SIZE(14),
        color: '#333',
    },
    titleName: {
        fontSize: FONT_SIZE(14),
        color: '#333',
    },
    hospitalName: {
        fontSize: FONT_SIZE(14),
        lineHeight: px2dp(25),
        color: '#333',
    },
    beGood: {
        fontSize: FONT_SIZE(14),
        color: '#898989',
        lineHeight: px2dp(20),
    },

    doctorItemBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: px2dp(50),
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
    },
    // hospitalLableContent: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    // },
    // hospitalLabelBox: {
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginRight: px2dp(5),
    //     width: px2dp(68),
    //     height: px2dp(25),
    //     borderRadius: px2dp(5),
    //     borderWidth: Pixel,
    //     borderColor: '#566cb7',
    // },
    // hospitalLabelText: {
    //     fontSize: FONT_SIZE(13),
    //     color: '#566CB7',
    // },
    fee: {
        fontSize: FONT_SIZE(14),
        color: '#333',
    },
    // 条幅
    noticeBox: {
        justifyContent: 'center',
        alignItems: 'center',
        height: px2dp(30),
        backgroundColor: '#F08058',
    },
    noticeText: {
        fontSize: FONT_SIZE(12),
        color: '#FFFEFE'
    },

    // 投入病历池
    poolContent: {
        paddingTop: px2dp(20),
        paddingBottom: px2dp(10),
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        backgroundColor: '#fff',
    },
    poolTitle: {
        fontSize: FONT_SIZE(18),
        color: '#212121',
    },
    poolText: {
        marginTop: px2dp(10),
        marginBottom: px2dp(15),
        fontSize: FONT_SIZE(15),
        color: '#757575',
        lineHeight: px2dp(24),
    },
    poolBottomBox: {
        borderTopWidth: Pixel,
        borderTopColor: '#e9e9e9',
        alignItems: 'flex-end',
        height: px2dp(45),
        justifyContent: 'center',
    },
    feeText: {
        fontSize: FONT_SIZE(14),
        color: '#333333',
    },
    // 医院item
    hospitalContent: {
        marginBottom: px2dp(6),
        backgroundColor: '#fff',
    },
    topBox: {
        paddingTop: px2dp(15),
        paddingRight: px2dp(15),
        paddingLeft: px2dp(15),
        paddingBottom: px2dp(9),
        borderBottomWidth: Pixel,
        borderBottomColor: '#efefef',
    },
    consultationHospitalNameBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    consultationHospitalNameText: {
        fontSize: FONT_SIZE(17),
        lineHeight: px2dp(24),
        fontWeight: '500',
        color: '#333333',
    },
    areaLableBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(68),
        height: px2dp(25),
        marginRight: px2dp(5),
        // backgroundColor: '#f08058',
        borderRadius: px2dp(5),
        borderWidth: Pixel,
        borderColor: '#f08058',
    },
    areaLableText: {
        fontSize: FONT_SIZE(13),
        color: '#f08058',
    },
    hospitalDetailBox: {
        justifyContent: 'center',
        height: px2dp(33),
        marginBottom: px2dp(5),

    },
    hospitalDetailText: {
        fontSize: FONT_SIZE(14),
        color: '#757575',
    },
    bottomBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: px2dp(44),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
    },
    hospitalLableContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hospitalLabelBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: px2dp(5),
        // width: px2dp(68),
        height: px2dp(25),
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        borderRadius: px2dp(5),
        borderWidth: Pixel,
        borderColor: '#566cb7',
    },
    hospitalLabelText: {
        fontSize: FONT_SIZE(13),
        color: '#566CB7',
    },
    lowestText: {
        fontSize: FONT_SIZE(16),
        color: '#333',
    },

});
