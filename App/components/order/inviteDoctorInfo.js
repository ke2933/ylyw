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
import Button from '../../common/Button';//按钮
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';

export default class doctorInfo extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            departmentId: "",//科室id
            hospitalId: "",//医院id
            doctorId: "",//受邀医生ids

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
            hospitalType: '',
        }
    }

    componentWillMount() {
        RouteName.push(this.props.navigation.state);        if (Android) {            BackHandler.addEventListener('hardwareBackPress', () => {                backAndroid();                return true;            });        }

        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params.data;
            this.setState({
                doctorId: data.consultationDoctorId,
            })
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
                        thisCity: responseData.thisCity, // 登录医生省id
                        titleName: responseData.titleName, // 职称
                        hospitalType: responseData.hospitalType,
                    })
                } else {
                    this.refs.toast.show('查询失败');
                }
                console.log('个人信息', responseData);
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
                        {this.state.thisCity === this.state.cityLable ? <View style={styles.areaLableBox}>
                            <Text style={styles.areaLableText}>本省</Text>
                        </View> : null}
                    </View>
                    <View style={styles.userInfo}>
                        <View style={styles.basicInfo}>
                            <Text style={styles.doctorName}>{this.state.doctorName}</Text>
                            <Text style={styles.departmentName}>{this.state.deptName}</Text>
                            <Text style={styles.titleName}>{this.state.titleName}</Text>
                        </View>
                        <Text style={styles.hospitalName}>{this.state.hospitalName}</Text>
                        <View style={styles.hospitalLableContent}>
                            {this.state.hospitalType ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>{this.state.hospitalType}</Text>
                            </View> : null}
                            {this.state.deptLable > 0 ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>顶级科室</Text>
                            </View> : null}
                            {this.state.deptLable === '0' ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>知名科室</Text>
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

    submit() {
        this.props.navigation.navigate('ExpertLaunch', {data: this.state})
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
        paddingTop: IOS ? 73 : px2dp(73 - StatusBarHeight),
        height: IOS ? 226 : px2dp(226 - StatusBarHeight),
        paddingLeft: px2dp(19),
        backgroundColor: '#566CB7',
    },
    goBackClick: {
        position: 'absolute',
        top: IOS ? 23 : px2dp(0),
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
        marginRight: px2dp(21),
        fontSize: FONT_SIZE(18),
        color: '#fff',
    },
    hospitalName: {
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
        // width: px2dp(68),
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
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
