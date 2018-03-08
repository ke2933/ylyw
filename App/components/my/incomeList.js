import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    TextInput,
    BackHandler,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import Nav from '../../common/Nav';//导航
import {Global} from '../../common/Global';
import IncomeTab from './incomeTab';

export default class IncomeList extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        NetWork ? null : Alert.alert('网络似乎断掉了'), this.setState({isLoading: false});
        RouteName.push(this.props.navigation.state);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }
    }

    render() {
        const {goBack, navigate} = this.props.navigation;
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
                         'title': '收益明细',
                         rightBtn: {type: 'false'}
                     }}/>
                <IncomeTab/>
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

});
