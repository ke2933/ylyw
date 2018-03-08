import React, {Component} from 'react';
import {
    AppRegistry,
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
import Button from '../../common/Button';//按钮
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from '../../common/Global';
import Loading from "../../common/Loading";
import px2dp from "../../common/Tool";

export default class doctorInfo extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            loadingText: '',
            file: "",//电子病历图片
            patientName: "",//患者姓名
            phone: "",//患者电话
            diseaseId: "",//疾病id
            departmentId: "",//科室id
            consultationReason: "",//会诊目的
            caseImgUrlArr: [],//病历图片数组,
            hospitalId: "",//医院id(如果医院不限,发送id为0)
            doctorId: "",//受邀医生ids
            areaId: '',

            cityLable: "",// 当前医生省id
            deptLable: "",// 科室标签
            deptName: "",// 科室名字
            doctorHonour: "", //推荐
            doctorIntroduceOneself: "", // 擅长
            doctorName: "",// 医生名字
            doctorPhotoPath: UserImg, // 头像url
            fee: "",// 费用
            hospitalLable: "",// 医院标签
            hospitalName: "", // 医院名字
            thisCity: "", // 登录医生省id
            titleName: "", // 职称

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
            let doctorData = this.props.navigation.state.params.doctorData;
            this.setState({
                patientName: data.patientName,
                phone: data.phone,
                diseaseId: data.diseaseId,
                departmentId: data.departmentId,
                consultationReason: data.consultationReason,
                caseImgUrlArr: data.caseImgUrlArr,
                doctorId: doctorData.id,
            });
        }

    }

    componentDidMount() {
        let formData = new FormData();
        formData.append("id", this.state.doctorId);
        console.log(formData);
        fetch(requestUrl.selectInvitedDoctor, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({isLoading: false});
                console.log(responseData);
                if (responseData.status === '0') {
                    this.setState({
                        cityLable: responseData.cityLable,// 当前医生省id
                        deptLable: responseData.deptLable,// 科室标签
                        deptName: responseData.deptName,// 科室名字
                        doctorHonour: responseData.doctorHonour, //推荐
                        doctorIntroduceOneself: responseData.doctorIntroduceOneself, // 擅长
                        doctorName: responseData.doctorName,// 医生名字
                        doctorPhotoPath: requestUrl.ImgIp + responseData.doctorPhotoPath, // 头像url
                        fee: responseData.fee,// 费用
                        hospitalLable: responseData.hospitalLable,// 医院标签
                        hospitalName: responseData.hospitalName, // 医院名字
                        hospitalId: responseData.hospitalId,// 医院ID
                        thisCity: responseData.thisCity, // 登录医生省id
                        titleName: responseData.titleName, // 职称
                    })
                } else {
                    this.refs.toast.show('查询医生失败');
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false});
                    this.refs.toast.show('查询医生失败');
                });
    }

    render() {
        const {navigate, goBack} = this.props.navigation;
        let areaLable = [];
        if (this.state.cityLable === this.state.thisCity) {
            areaLable.push(
                <View key={1} style={styles.areaLableBox}>
                    <Text style={styles.areaLableText}>本省</Text>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                {this.state.isLoading ? <Loading text={this.state.loadingText}/> : null}
                <View style={styles.doctorInfo}>
                    <TouchableOpacity
                        onPress={() => {
                            RouteName.pop();
                            goBack();
                        }}
                        style={styles.goBackClick}
                    >
                        <Image source={require('../../images/back.png')} style={styles.goBackImg}/>
                    </TouchableOpacity>

                    <View style={styles.portraitBox}>
                        <Image source={{uri: this.state.doctorPhotoPath}}
                               style={styles.pictureUrlImg}/>
                        {areaLable}
                    </View>
                    <View style={styles.userInfo}>
                        <View style={styles.basicInfo}>
                            <Text style={styles.doctorName}>{this.state.doctorName}</Text>
                            <Text style={styles.departmentName}>{this.state.deptName}</Text>
                            <Text style={styles.titleName}>{this.state.titleName}</Text>
                        </View>
                        <Text numberOfLines={1} style={styles.hospitalName}>{this.state.hospitalName}</Text>
                        <View style={styles.hospitalLableContent}>
                            {this.state.hospitalLable > 0 ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>顶级医院</Text>
                            </View> : null}
                            {this.state.deptLable > 0 ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>顶级科室</Text>
                            </View> : null}
                        </View>
                        <Text style={styles.fee}>¥{this.state.fee}</Text>
                    </View>
                </View>
                <ScrollView
                    style={{flex: 1, backgroundColor: '#efefef'}}
                >
                    <View style={styles.descBox}>
                        <Text style={styles.descTitle}>擅长：</Text>
                        <Text style={styles.descText}>{this.state.doctorIntroduceOneself}</Text>
                    </View>
                    <View style={styles.descBox}>
                        <Text style={styles.descTitle}>个人简介：</Text>
                        <Text style={styles.descText}>{this.state.doctorHonour}</Text>
                    </View>
                    <Button text={'邀请会诊'} click={() => {
                        Alert.alert('', '确认邀请该医生会诊吗？', [
                            {
                                text: '我再想想', onPress: () => {
                            }
                            },
                            {
                                text: '确认', onPress: () => {
                                this.submit()
                            }
                            },
                        ])
                    }}/>
                </ScrollView>
                <Toast
                    ref='toast'
                    style={{backgroundColor: '#333333', borderRadius: 10,}}
                    position={'center'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeInDuration={2000}
                    opacity={.8}
                />
            </View>
        );
    }

    submit() {
        this.setState({isLoading: true, loadingText: '创建中...'});
        let formData = new FormData();
        formData.append("patientName", this.state.patientName);//患者姓名
        formData.append("phone", this.state.phone);//患者电话
        formData.append("diseaseId", this.state.diseaseId);//疾病id
        formData.append("departmentId", this.state.departmentId);//科室id
        formData.append("consultationReason", this.state.consultationReason);//会诊目的
        formData.append("hospitalId", this.state.hospitalId);//医院id
        formData.append("doctorId", this.state.doctorId);//受邀医生id
        formData.append("fee", this.state.fee);//费用
        formData.append("areaId", this.state.cityLable);
        let temp = this.state.caseImgUrlArr;
        for (let i = 0; i < temp.length; i++) {
            let caseImg = {
                uri: temp[i],
                type: "image/jpeg",
                name: temp[i].substring(temp[i].lastIndexOf('.'), temp[i].length),
            };
            formData.append("file", caseImg);//费用
        }
        console.log(formData);
        fetch(requestUrl.addConsultation, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {

                if (responseData.status === '0') {
                    this.setState({loadingText: '创建成功'});
                    setTimeout(() => {
                        this.setState({isLoading: false});
                        this.props.navigation.navigate('FoundSuccess');
                    }, 1000)
                } else {
                    this.setState({isLoading: false});
                    this.refs.toast.show('添加失败');
                }
                console.log('responseData', responseData);
            })
            .catch(
                (error) => {
                    console.log(error);
                    this.setState({isLoading: false});
                    this.refs.toast.show('添加失败，请稍后重试');
                    setTimeout(() => {
                        this.props.navigation.navigate('TabHomePage');
                    }, 1000)
                });
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EFEFEF',
        flex: 1,
    },
    // 医生信息
    doctorInfo: {
        flexDirection: 'row',
        position: 'relative',
        paddingTop: IOS ? 73 : px2dp(53),
        height: IOS ? 226 : px2dp(226) - StatusBar.currentHeight,
        paddingLeft: px2dp(19),
        backgroundColor: '#566CB7',
    },
    goBackClick: {
        position: 'absolute',
        top: IOS ? px2dp(20) : 0,
        left: px2dp(10),
        padding: px2dp(10),
    },
    portraitBox: {
        marginRight: px2dp(23),
        width: px2dp(81),
        alignItems: 'center',
    },
    pictureUrlImg: {
        width: px2dp(81),
        height: px2dp(81),
        borderRadius: px2dp(40.5),
        marginBottom: px2dp(9),
    },
    userInfo: {
        flex: 1,
    },
    basicInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(18),
    },
    doctorName: {
        marginRight: px2dp(15),
        fontSize: FONT_SIZE(18),
        color: '#fff',
    },
    hospitalName: {
        width: px2dp(240),
        fontSize: FONT_SIZE(15),
        color: '#fff',
        lineHeight: px2dp(35),
    },
    hospitalLableContent: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: Pixel,
        borderTopColor: '#8595cd',
    },
    hospitalLabelBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: px2dp(10),
        marginRight: px2dp(5),
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        // width: px2dp(68),
        height: px2dp(25),
        borderRadius: px2dp(5),
        borderWidth: Pixel,
        borderColor: '#fff',
    },
    hospitalLabelText: {
        fontSize: FONT_SIZE(13),
        color: '#fff',
    },
    fee: {
        marginTop: px2dp(27),
        fontSize: FONT_SIZE(15),
        color: '#fff',
    },
    departmentName: {
        marginRight: px2dp(10),
        fontSize: FONT_SIZE(15),
        color: '#fff',
    },
    titleName: {
        fontSize: FONT_SIZE(15),
        color: '#fff',
    },
    areaLableBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(38),
        height: px2dp(18),
        backgroundColor: '#f08058',
        borderRadius: px2dp(9),
    },
    areaLableText: {
        fontSize: FONT_SIZE(11),
        color: '#fff',
    },
    // 擅长 推荐
    descBox: {
        marginTop: px2dp(8),
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        paddingTop: px2dp(13),
        paddingBottom: px2dp(13),
        backgroundColor: '#fff',
    },
    descTitle: {
        marginBottom: px2dp(5),
        fontSize: FONT_SIZE(14),
        color: '#333333',
    },
    descText: {
        fontSize: FONT_SIZE(14),
        color: '#333333',
        lineHeight: px2dp(23),
    },
});
