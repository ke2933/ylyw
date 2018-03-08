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
import UploadPhoto from '../../common/UploadPhoto';//相机拍照
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';

export default class OrderPerfect extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            loadingText: '',
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
            newPictureList: [],
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
                    this.setState({isLoading: false});
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
                            firstDepartmentName: responseData.firstDepartmentName,//中医男科
                            firstDoctorName: responseData.firstDoctorName,//薛薛
                            firstHospitalName: responseData.firstHospitalName,//北京大学人民医院
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
                        this.setState({isLoading: false});

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

                         goBack()
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
                <View style={styles.noticeBox}>
                    <Text style={styles.noticeText}>会诊医生申请完善病历，请进快上传</Text>
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
                            style={styles.caseHistoryText}>患者信息：{this.state.name}－{this.state.sex}－{this.state.age}岁</Text>
                        <Text style={styles.caseHistoryText}>患者手机：{this.state.phone}</Text>
                        <Text style={styles.caseHistoryText}>所在科室：{this.state.firstDepartmentName}</Text>
                        <Text
                            style={styles.caseHistoryText}>首诊医生：{this.state.firstDoctorName}－{this.state.firstTitleName}</Text>
                        <Text style={styles.caseHistoryText}>所属医院：{this.state.firstHospitalName}</Text>
                        <Text style={styles.caseHistoryText}>会诊科室：{this.state.consultationDepartmentName}</Text>
                        <Text
                            style={styles.caseHistoryText}>会诊医生：{this.state.consultationDoctorName}－{this.state.consultationTitleName}</Text>
                        <Text style={styles.caseHistoryText}>所属医院：{this.state.consultationHospitalName}</Text>
                        <Text style={styles.caseHistoryText}>会诊费用：¥{this.state.fee}</Text>
                    </View>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>会诊病历及附件拍照</Text>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.imgBox}>

                            {this.renderCaseImg()}
                            {this.renderNewImg()}
                            <UploadPhoto
                                type={'big'}
                                changeImg={(data) => {
                                    this.caseImgUrl(data)
                                }}
                            />
                        </View>

                    </View>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>会诊目的及备注</Text>
                    </View>
                    <View style={styles.textBox}>
                        <Text style={styles.text}>{this.state.consultationReason}</Text>
                    </View>
                    <View style={styles.btns}>
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={() => {
                                Alert.alert('', '确认上传病历吗？', [
                                    {
                                        text: '取消', onPress: () => {
                                        }
                                    },
                                    {
                                        text: '确认', onPress: () => {
                                            this.perfectCase();
                                        }
                                    },
                                ]);
                            }}
                        >
                            <View style={styles.btnBox}>
                                <Text style={styles.btnText}>上传病历</Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={() => {
                                navigate('Chat', {data: this.state});
                            }}
                        >
                            <View style={styles.btnBox}>
                                <Text style={styles.btnText}>会诊沟通</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
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
        let imgArr = this.state.pictureList;
        if (imgArr.length >= 0) {
            let Temp = [];
            for (let i = 0; i < imgArr.length; i++) {
                Temp.push(
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => {
                            let temp = this.state.bigImgUrl;
                            let tempNew = this.state.newPictureList;
                            temp = temp.concat(tempNew);
                            this.props.navigation.navigate('ZoomImg', {data: temp, index: i});
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

    // 处理新上传图片路径
    caseImgUrl(data) {
        let temp = this.state.newPictureList;
        temp.push(data);
        this.setState({
            newPictureList: temp,
        });
    }

    // 展示上传的图片
    renderNewImg() {
        let imgArr = this.state.newPictureList;
        if (imgArr.length >= 0) {
            let Temp = [];
            for (let i = 0; i < imgArr.length; i++) {
                Temp.push(
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => {
                            let temp = this.state.bigImgUrl;
                            let tempNew = this.state.newPictureList;
                            temp = temp.concat(tempNew);
                            this.props.navigation.navigate('ZoomImg', {data: temp, index: i + temp.length - 1});
                        }}
                        key={i}
                        style={{paddingTop: px2dp(8), marginTop: -px2dp(8)}}
                    >
                        <View key={i} style={styles.caseItemBox}>
                            <Image style={styles.caseItemImg} source={{uri: imgArr[i]}}/>
                            <TouchableOpacity
                                onPress={this.deleteCaseImg.bind(this, i)}
                                activeOpacity={.8}
                                style={styles.deleteClick}
                            >
                                <Image style={styles.deleteImg} source={require('../../images/delete_img.png')}/>
                            </TouchableOpacity>

                        </View>
                    </TouchableOpacity>
                )
            }
            return Temp;
        } else {
            return null;
        }
    }

    //删除图片
    deleteCaseImg(index) {
        let temp = this.state.newPictureList;
        temp.splice(index, 1);
        this.setState({
            newPictureList: temp,
        })
    }

    // 完善电子病历
    perfectCase() {
        if (this.state.newPictureList.length > 0) {
            this.setState({isLoading: true, loadingText: '上传中...'});
            let formData = new FormData();
            formData.append("consultationId", this.state.consultationId);
            formData.append("statusId", this.state.statusId);
            let temp = this.state.newPictureList;
            for (let i = 0; i < temp.length; i++) {
                let caseImg = {
                    uri: temp[i],
                    type: "image/jpeg",
                    name: temp[i].substring(temp[i].lastIndexOf('.'), temp[i].length),
                };
                formData.append("file", caseImg);//费用
            }
            fetch(requestUrl.perfectCase, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((responseData) => {

                    if (responseData.status === '0') {
                        this.setState({loadingText: '上传成功'});
                        setTimeout(() => {
                            this.setState({isLoading: false});
                            OrderType = '首诊订单';
                            Status = '正在会诊';
                            this.props.navigation.navigate('TabOrderPage');
                        }, 1000)
                    } else {
                        this.setState({isLoading: false});
                        this.refs.toast.show('上传失败');
                    }
                })
                .catch(
                    (error) => {
                        this.setState({isLoading: false});
                        console.log('error', error);
                    });
        } else {
            this.refs.toast.show('请完善信息');
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
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
        width: px2dp(64),
        height: px2dp(61),
        marginBottom: px2dp(15),
    },
    caseItemImg: {
        width: px2dp(60),
        height: px2dp(60),
        borderRadius: px2dp(4),
    },
    deleteClick: {
        position: 'absolute',
        top: -px2dp(8),
        right: -px2dp(8),
        zIndex: 1,
        backgroundColor: '#fff',
        borderRadius: px2dp(10),
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
        fontSize: FONT_SIZE(18),
        color: '#fffefe',
    }

});
