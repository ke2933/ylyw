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
import {Global} from '../../common/Global';
import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航

export default class approve extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectOauth: {},
            idCard: '',
            // status: "状态码",
            // message: "提示信息!",
            // idCard: "身份证号",
            // qualificationBackPathA: "医师执业证A url",
            // qualificationBackPathB: "医师执业证B url",
            // certifiedPhotoPath: "手持工牌照 url",
            // doctorAuthenticationStatus: "认证状态"

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

    }

    //获取数据
    componentDidMount() {
        fetch(requestUrl.selectOauth)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData)
                this.setState({
                    selectOauth: responseData,
                    idCard: responseData.idCard.substr(0, 3) + '**********' + responseData.idCard.substr(-3, 3),
                })
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
                    //networkActivityIndicatorVisible={ true }//IOS设定网络活动指示器(就是那个菊花)是否显示在状态栏。
                    statusBarStyle={"default"}//ios:白底黑字  android:黑底白字
                />
                <Nav navigation={this.props.navigation}
                     leftClick={() => {
                         RouteName.pop();
                         goBack();
                     }}
                     data={{
                         'leftBtn': true,
                         'title': '认证信息',
                         'rightBtn': {
                             type: 'text',
                             text: this.state.selectOauth.doctorAuthenticationStatus === '1' ? '已认证' : '认证中',
                         }
                     }}/>
                <ScrollView>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>身份证号</Text>
                    </View>
                    <View style={[styles.content, {}]}>
                        <Text style={styles.contentText}>身份证</Text>
                        <Text style={styles.contentInfo}>{this.state.idCard}</Text>
                    </View>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>资质证明</Text>
                    </View>
                    <View style={[styles.content, {}]}>
                        <Text style={styles.contentText}>医师执业证</Text>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigate('ZoomImg', {
                                        data: [requestUrl.ImgIp + this.state.selectOauth.qualificationBackPathA, requestUrl.ImgIp + this.state.selectOauth.qualificationBackPathB],
                                        index: 0,
                                    })
                                }}
                                activeOpacity={.8}
                            >
                                <Image style={styles.contentImg}
                                       source={{uri: requestUrl.ImgIp + this.state.selectOauth.qualificationBackPathA}}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    navigate('ZoomImg', {
                                        data: [requestUrl.ImgIp + this.state.selectOauth.qualificationBackPathA, requestUrl.ImgIp + this.state.selectOauth.qualificationBackPathB],
                                        index: 1,
                                    })
                                }}
                                activeOpacity={.8}
                            >
                                <Image style={styles.contentImg}
                                       source={{uri: requestUrl.ImgIp + this.state.selectOauth.qualificationBackPathB}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.content, {marginTop: 9,}]}>
                        <Text style={styles.contentText}>手持工牌照</Text>
                        <TouchableOpacity
                            onPress={() => {
                                navigate('ZoomImg', {data: [requestUrl.ImgIp + this.state.selectOauth.certifiedPhotoPath]})
                            }}
                            activeOpacity={.8}
                        >
                            <Image style={styles.contentImg}
                                   source={{uri: requestUrl.ImgIp + this.state.selectOauth.certifiedPhotoPath}}/>
                        </TouchableOpacity>
                    </View>
                    {/*<View style={[styles.content, {marginTop: 9,}]}>*/}
                    {/*<Text style={styles.contentText}>电子签名</Text>*/}
                    {/*<TouchableOpacity*/}
                    {/*onPress={() => {*/}
                    {/*navigate('ViewPicture',{data:[requestUrl.ImgIp + this.state.selectOauth.electronicSignature],style:{backgroundColor: '#fff'}})*/}
                    {/*}}*/}
                    {/*activeOpacity={.8}*/}
                    {/*>*/}
                    {/*<Image style={styles.contentImg} resizeMode={'cover'} source={{uri: requestUrl.ImgIp + this.state.selectOauth.electronicSignature}}/>*/}
                    {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => {
                            navigate('Protocol');
                        }}
                    >
                        <View style={[styles.content, {marginTop: 9,}]}>
                            <Text style={styles.contentText}>平台合同协议</Text>
                            <Image source={require('../../images/arrow_gray_right.png')}/>
                        </View>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
        flex: 1,
    },
    //title
    titleBox: {
        height: 35,
        justifyContent: 'center',
        paddingLeft: 19,
    },
    title: {
        fontSize: 14,
        color: '#898989',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 70,
        paddingLeft: 20,
        paddingRight: 26,
        backgroundColor: '#fff',
    },
    contentInfo: {
        fontSize: 16,
        color: '#333',
    },
    contentText: {
        fontSize: 16,
        color: '#333',
    },
    contentImg: {
        width: 60,
        height: 56,
        borderRadius: 3,
        marginLeft: 10,
    }
});
