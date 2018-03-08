import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    TextInput,
    BackHandler,
} from 'react-native';

import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import px2dp from "../../common/Tool";
//按钮

export default class demo extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            purseDetail: {},
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
            let id = this.props.navigation.state.params.id;
            fetch(requestUrl.getDetail + `?id=${id}`)
                .then((response) => response.json())
                .then((responseData) => {
                    console.log(responseData);
                    if (responseData.status === '10') {
                        this.props.navigation.navigate('Login');
                    } else if (responseData.status === '0') {
                        // createTime:"2017-12-19 20:02:15"
                        // id:"742758b0e4b411e7967f00163e08d49b"
                        // illnessName:"提现"
                        // price:"-0.1"
                        // remark:"支付宝提现"
                        // type:"0"
                        this.setState({
                            purseDetail: responseData.purseDetail,
                        })
                    }
                })
                .catch(
                    (error) => {
                        this.setState({isLoading: false,});
                        console.log('error', error);
                    });
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
                         'title': '收益明细',
                         'rightBtn': {type: 'false'}
                     }}
                />

                <View style={styles.content}>
                    <View style={[styles.incomeItem, {
                        borderBottomColor: '#dbdbdb',
                        borderBottomWidth: Pixel,
                        height: px2dp(75),
                        marginBottom: px2dp(10),
                    }]}>
                        <Text style={styles.incomeItemTitle}>金额</Text>
                        <Text
                            style={[styles.moneyNum, {color: this.state.purseDetail.price > 0 ? '#2ecd32' : '#212121',}]}>{this.state.purseDetail.price}</Text>
                    </View>
                    <View style={styles.incomeItem}>
                        <Text style={styles.incomeItemTitle}>类型</Text>
                        <Text style={styles.incomeItemText}>{this.state.purseDetail.price > 0 ? '收入' : '提现'}</Text>
                    </View>
                    <View style={styles.incomeItem}>
                        <Text style={styles.incomeItemTitle}>时间</Text>
                        <Text
                            style={styles.incomeItemText}>{this.state.purseDetail.createTime ? this.state.purseDetail.createTime : '-'}</Text>
                    </View>
                    <View style={styles.incomeItem}>
                        <Text style={styles.incomeItemTitle}>会诊疾病</Text>
                        <Text
                            style={styles.incomeItemText}>{this.state.purseDetail.illnessName ? this.state.purseDetail.illnessName : '-'}</Text>
                    </View>
                    <View style={styles.incomeItem}>
                        <Text style={styles.incomeItemTitle}>参与会诊</Text>
                        <Text
                            style={styles.incomeItemText}>{this.state.purseDetail.consultationDoctor ? this.state.purseDetail.consultationDoctor : '-'}</Text>
                    </View>
                    <View style={styles.incomeItem}>
                        <Text style={styles.incomeItemTitle}>所属科室</Text>
                        <Text
                            style={styles.incomeItemText}>{this.state.purseDetail.consultationDept ? this.state.purseDetail.consultationDept : '-'}</Text>
                    </View>
                    <View style={styles.incomeItem}>
                        <Text style={styles.incomeItemTitle}>所属医院</Text>
                        <Text
                            style={styles.incomeItemText}>{this.state.purseDetail.consultationHospital ? this.state.purseDetail.consultationHospital : '-'}</Text>
                    </View>
                    <View style={styles.incomeItem}>
                        <Text style={styles.incomeItemTitle}>备注</Text>
                        <Text
                            style={styles.incomeItemText}>{this.state.purseDetail.remark ? this.state.purseDetail.remark : '-'}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    content: {
        marginTop: px2dp(10),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        paddingBottom: px2dp(10),
        backgroundColor: '#fff',
    },
    incomeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    moneyNum: {
        fontSize: FONT_SIZE(20),
        fontWeight: '500',
    },
    incomeItemTitle: {
        lineHeight: px2dp(33),
        fontSize: FONT_SIZE(14),
        color: '#9e9e9e',
    },
    incomeItemText: {
        marginLeft: px2dp(20),
        flex: 1,
        textAlign: 'right',
        fontSize: FONT_SIZE(14),
        lineHeight: px2dp(20),
        color: '#212121',
    }
});
