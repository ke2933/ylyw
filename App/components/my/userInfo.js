import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    TextInput,
    DeviceEventEmitter,
    BackHandler,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import px2dp from "../../common/Tool";

export default class userInfo extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            deptName: "",//中医男科
            doctorHonour: "",//个人简介
            doctorIntroduceOneself: "",//擅长
            doctorName: "",//姓名
            doctorPhotoPath: UserImg,//照片
            sex: "",//性别
            hospitalName: "",//医院
            titleName: "",//职称
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
    }

    //获取数据
    componentDidMount() {
        fetch(requestUrl.selectDetail)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    deptName: responseData.deptName,//中医男科
                    doctorHonour: responseData.doctorHonour,//个人简介
                    doctorIntroduceOneself: responseData.doctorIntroduceOneself,//擅长
                    doctorName: responseData.doctorName,//姓名
                    doctorPhotoPath: requestUrl.ImgIp + responseData.doctorPhotoPath,//照片
                    sex: responseData.sex,//性别
                    hospitalName: responseData.hospitalName,//医院
                    titleName: responseData.titleName,//职称

                });
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('myData');
    }

    render() {
        const {navigate, goBack, state} = this.props.navigation;
        return (
            <View style={styles.container}>
                {this.state.Loading ? <Loading/> : null}
                <StatusBar//状态栏
                    animated={true}//是否动画
                    hidden={false}//是否隐藏
                    backgroundColor={'#000'}//android 设置状态栏背景颜色
                    translucent={false}//android 设置状态栏是否为透明
                    showHideTransition="fade"//IOS状态栏改变时动画 fade:默认 slide
                    networkActivityIndicatorVisible={this.state.Loading}//IOS设定网络活动指示器(就是那个菊花)是否显示在状态栏。
                    statusBarStyle={"default"}//ios:白底黑字  android:黑底白字
                />
                <Nav
                    navigation={this.props.navigation}
                    leftClick={() => {
                        DeviceEventEmitter.emit('myData');
                        RouteName.pop();
                        goBack();
                    }}
                    data={{
                        'leftBtn': true,
                        'title': '个人信息',
                        'rightBtn': {type: 'false'}
                    }}/>
                <ScrollView>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>基本信息</Text>
                    </View>
                    <View style={styles.content}>
                        <TouchableOpacity
                            onPress={() => {
                                navigate('AmendUserImg', {
                                    userImgUrl: this.state.doctorPhotoPath,
                                    callback: (data => {
                                        this.setState({
                                            doctorPhotoPath: data,
                                        })
                                    })
                                });
                            }}
                            activeOpacity={.8}
                        >
                            <View style={[styles.selectBox, {borderBottomWidth: Pixel, height: 70,}]}>
                                <Text style={styles.selectTitle}>照片</Text>
                                <Image style={styles.selectImg}
                                       source={{uri: this.state.doctorPhotoPath}}/>
                                <Image source={require('../../images/arrow_gray_right.png')}
                                       style={[styles.arrowRight, {top: 28}]}/>
                            </View>

                        </TouchableOpacity>
                        <View style={[styles.exhibitionBox, {borderBottomWidth: Pixel,}]}>
                            <Text style={styles.exhibitionTitle}>姓名</Text>
                            <Text numberOfLines={1} style={styles.exhibitionText}>{this.state.doctorName}</Text>
                        </View>

                        <View style={[styles.exhibitionBox, {}]}>
                            <Text style={styles.exhibitionTitle}>性别</Text>
                            <Text numberOfLines={1} style={styles.exhibitionText}>{this.state.sex}</Text>
                        </View>

                    </View>

                    <View style={styles.titleBox}>
                        <Text style={styles.title}>医院信息</Text>
                    </View>
                    <View style={styles.content}>
                        <View style={[styles.exhibitionBox, {borderBottomWidth: Pixel,}]}>
                            <Text style={styles.exhibitionTitle}>职称</Text>
                            <Text numberOfLines={1} style={styles.exhibitionText}>{this.state.titleName}</Text>
                        </View>

                        <View style={[styles.exhibitionBox, {borderBottomWidth: Pixel,}]}>
                            <Text style={styles.exhibitionTitle}>所在医院</Text>
                            <Text numberOfLines={1} style={styles.exhibitionText}>{this.state.hospitalName}</Text>
                        </View>

                        <View style={[styles.exhibitionBox, {}]}>
                            <Text style={styles.exhibitionTitle}>科室</Text>
                            <Text numberOfLines={1} style={styles.exhibitionText}>{this.state.deptName}</Text>
                        </View>

                    </View>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>医生信息</Text>
                    </View>
                    <View style={styles.content}>
                        <TouchableOpacity
                            onPress={() => {
                                if (IOS) {
                                    navigate('AccomplishedIOS', {
                                        'data': this.state.doctorHonour,
                                        "callback": (data) => {
                                            this.setState({
                                                doctorHonour: data,
                                            })
                                        }
                                    })
                                } else {
                                    navigate('Accomplished', {
                                        'data': this.state.doctorHonour,
                                        "callback": (data) => {
                                            this.setState({
                                                doctorHonour: data,
                                            })
                                        }
                                    })
                                }

                            }}
                            activeOpacity={.8}
                        >
                            <View style={[styles.selectBox, {borderBottomWidth: Pixel,}]}>
                                <Text style={styles.exhibitionTitle}>个人简介</Text>
                                <Image source={require('../../images/arrow_gray_right.png')} style={styles.arrowRight}/>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                if (IOS) {
                                    navigate('NominateIOS', {
                                        data: this.state.doctorIntroduceOneself,
                                        "callback": (data) => {
                                            this.setState({
                                                doctorIntroduceOneself: data,
                                            })
                                        }
                                    })
                                } else {
                                    navigate('Nominate', {
                                        data: this.state.doctorIntroduceOneself,
                                        "callback": (data) => {
                                            this.setState({
                                                doctorIntroduceOneself: data,
                                            })
                                        }
                                    })
                                }

                            }}
                            activeOpacity={.8}
                        >
                            <View style={[styles.selectBox, ]}>
                                <Text style={styles.exhibitionTitle}>擅长</Text>
                                <Image source={require('../../images/arrow_gray_right.png')} style={styles.arrowRight}/>
                            </View>

                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#efefef',
        flex: 1,
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
    // 数据块item 数据展示
    exhibitionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        height: px2dp(50),
        borderBottomColor: '#d6e1e8',
    },
    exhibitionTitle: {
        paddingLeft: px2dp(5),
        fontSize: FONT_SIZE(16),
        color: '#333',
    },
    exhibitionText: {
        textAlign: 'right',
        width: px2dp(250),
        fontSize: FONT_SIZE(16),
        color: '#333',
        marginRight: px2dp(13),
    },

    selectBox: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: px2dp(50),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderBottomColor: '#D6E1E8',
    },
    selectImg: {
        width: px2dp(44),
        height: px2dp(44),
        borderRadius: px2dp(22),
        marginRight: px2dp(27),
    },
    selectTitle: {
        width: px2dp(78),
        paddingLeft: px2dp(3.5),
        fontSize: FONT_SIZE(16),
        color: '#333333',
    },
    selectClick: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,
        width: SCREEN_WIDTH * .7,
        height: px2dp(50),
    },
    selectInput: {
        flex: 1,
        height: px2dp(50),
        marginRight: px2dp(6),
        color: '#333333',
        fontSize: FONT_SIZE(16),
    },
    arrowRight: {
        position: 'absolute',
        top: px2dp(19),
        right: px2dp(13),
    },
});
