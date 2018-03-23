import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
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
import px2dp from "../../common/Tool";

export default class expertsInfo extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            departmentId: "",//科室id
            hospitalId: "",//医院id
            doctorId: "",//受邀医生ids

            cityLable: "",// 当前医生省id
            deptLable: "",// 科室标签
            deptName: "",// 登陆医生
            doctorHonour: "", //推荐
            doctorIntroduceOneself: "", // 擅长
            doctorName: "",// 医生名字
            doctorPhotoPath: UserImg, // 头像url
            fee: "",// 费用
            departmentName: '',
            hospitalLable: "",// 医院标签
            hospitalName: "", // 医院名字
            myAreaID: "", // 登录医生省id
            titleName: "", // 职称
            doctorType: '',// 是否提供服务 0NO 1YES
            liabilityArea: '',// 服务区域
            // serviceId: '',
            launch: '',
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
            let doctorData = this.props.navigation.state.params.doctorData;
            console.log(doctorData);
            this.setState({
                departmentId: data.departmentId,
                doctorId: doctorData.id,
                launch: data.launch,
            });
        }

    }

    componentDidMount() {
        // fetch(requestUrl.responsibleArea)
        //     .then((response) => response.json())
        //     .then((responseData) => {
        //         if (responseData.status === '0') {
        //             this.setState({
        //                 serviceId: responseData.areaId,
        //             })
        //         }
        //     })
        //     .catch(
        //         (error) => {
        //             console.log('error', error);
        //         });
        // 登录医生信息
        fetch(requestUrl.baseInfo)
            .then((response) => response.json())
            .then((responseData) => {
                UserInfo.countryId = 'cc9e0348b3c311e7b77800163e08d49b';
                this.setState({
                    myAreaID: responseData.cityId,
                    myAreaName: responseData.cityName,
                    deptId: responseData.deptId,
                    departmentId: responseData.deptId,
                    deptName: responseData.deptName,
                    areaActiveId: responseData.cityId,
                    areaActiveName: responseData.cityName,
                    deptActiveId: responseData.deptId,
                    deptActiveName: responseData.deptName,
                });

            })
            .catch((error) => {
                console.log('error', error);
            });

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
                this.setState({isLoading: false});
                if (responseData.status === '0') {
                    this.setState({
                        cityLable: responseData.cityLable,// 当前医生省id
                        deptLable: responseData.deptLable,// 科室标签
                        departmentName: responseData.deptName,// 科室名字
                        doctorHonour: responseData.doctorHonour, //推荐
                        doctorIntroduceOneself: responseData.doctorIntroduceOneself, // 擅长
                        doctorName: responseData.doctorName,// 医生名字
                        doctorPhotoPath: requestUrl.ImgIp + responseData.doctorPhotoPath, // 头像url
                        fee: responseData.fee,// 费用
                        hospitalLable: responseData.hospitalLable,// 医院标签
                        hospitalName: responseData.hospitalName, // 医院名字
                        hospitalId: responseData.hospitalId,// 医院id
                        thisCity: responseData.thisCity, // 登录医生省id
                        titleName: responseData.titleName, // 职称
                        doctorType: responseData.doctorType,//医生类型(0/1 首诊/会诊)
                        liabilityArea: responseData.liabilityArea,//责任区域
                        hospitalType: responseData.hospitalType,// 医院类型
                    })
                } else {
                    this.refs.toast.show('查询失败');
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
    }

    render() {
        const {navigate, goBack} = this.props.navigation;
        let areaLable = [];
        if (this.state.thisCity === this.state.cityLable) {
            areaLable.push(
                <View key={1} style={styles.areaLableBox}>
                    <Text style={styles.areaLableText}>本省</Text>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                {this.state.isLoading ? <Loading text={'加载中...'}/> : null}
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
                            <Text style={styles.departmentName}>{this.state.departmentName}</Text>
                            <Text style={styles.titleName}>{this.state.titleName}</Text>
                        </View>
                        <Text numberOfLines={1} style={styles.hospitalName}>{this.state.hospitalName}</Text>
                        <View style={styles.hospitalLableContent}>
                            {this.state.hospitalType ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>{this.state.hospitalType}</Text>
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
                    {this.state.launch === 0 ? null : <Button text={'邀请会诊'} click={this.submit.bind(this)}/>}
                    {IPhoneX ? <View style={{height: 34,}}></View> : null}
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
        // this.props.navigation.navigate('ExpertLaunch', {data: this.state})
        if (this.state.doctorType === '1') {
            if (this.state.liabilityArea === UserInfo.countryId) {
                this.props.navigation.navigate('ExpertLaunch', {data: this.state})
            } else if (this.state.liabilityArea === this.state.thisCity) {
                this.props.navigation.navigate('ExpertLaunch', {data: this.state})
            } else {
                Alert.alert('该医生只为本省提供会诊服务');
            }
        } else {
            Alert.alert('该医生不提供会诊服务')
        }
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
        paddingTop: IOS ? IPhoneX ? 97 : 73 : px2dp(53),
        height: IOS ? IPhoneX ? 250 : 226 : px2dp(226) - StatusBar.currentHeight,
        paddingLeft: px2dp(19),
        backgroundColor: '#566CB7',
    },
    goBackClick: {
        position: 'absolute',
        top: IOS ? IPhoneX ? 44 : 20 : 0,
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
        fontSize: px2dp(18),
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
