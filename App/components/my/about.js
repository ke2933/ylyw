import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    TextInput,
    BackHandler,
    Linking,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import {Global} from '../../common/Global';
import px2dp from "../../common/Tool";
import Communications from 'react-native-communications';

export default class about extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {}
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

    render() {
        const {goBack} = this.props.navigation;
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
                         'title': '关于',
                         rightBtn: {type: 'false',}
                     }}/>
                <View style={styles.aboutBox}>
                    <Image style={styles.logoImg} source={require('../../images/logo.png')}/>
                    <Text style={styles.editionText}>医来医往 1.0.0</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        IOS ?
                            Communications.web('itms-apps://itunes.apple.com/cn/app/%E5%8C%BB%E6%9D%A5%E5%8C%BB%E5%BE%80/id1267680807?mt=8')
                            :
                            Communications.web('http://m.app.so.com/detail/index?from=qing&id=3960394#nogo')

                    }}
                    activeOpacity={.8}
                >
                    <View style={styles.evaluateBox}>
                        <Text style={styles.evaluateText}>评价</Text>
                        <Image source={require('../../images/arrow_gray_right.png')}/>
                    </View>

                </TouchableOpacity>
                <View style={styles.copyrightBox}>
                    <Text style={styles.copyrightText}>Copyright &copy; 2018</Text>
                    <Text style={styles.copyrightText}>医来医往(北京)科技有限公司</Text>
                </View>
            </View>
        );
    }

    submit() {

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EFEFEF',
        flex: 1,
    },
    aboutBox: {
        alignItems: 'center',
    },
    logoImg: {
        marginTop: px2dp(36),
    },
    editionText: {
        marginTop: px2dp(18),
        fontSize: FONT_SIZE(18),
        color: '#676767',
    },
    evaluateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: px2dp(15),
        height: px2dp(50),
        paddingLeft: px2dp(20),
        paddingRight: px2dp(25),
        backgroundColor: '#fff',
    },
    evaluateText: {
        fontSize: FONT_SIZE(16),
        color: '#333333',
    },
    copyrightBox: {
        position: 'absolute',
        bottom: px2dp(50),
        left: 0,
        width: SCREEN_WIDTH,
        alignItems: 'center',
    },
    copyrightText: {
        marginTop: px2dp(7),
        fontSize: FONT_SIZE(14),
        color: '#bdbdbd'
    },
});
