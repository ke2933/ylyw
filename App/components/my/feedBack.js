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
    Keyboard,
    BackHandler,
    ScrollView,
} from 'react-native';
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Button from '../../common/Button';//按钮
import Nav from '../../common/Nav';//导航
import Toast, {DURATION} from 'react-native-easy-toast';
import px2dp from "../../common/Tool";
//弱提示

export default class FeedBack extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            btnFlag: false,
            textareaHeight: 300,
            text: '',
            loadingText: '',
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

    render() {
        const {goBack} = this.props.navigation;
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
                         goBack();
                     }}
                     data={{
                         'leftBtn': true,
                         'title': '意见反馈',
                         rightBtn: false,
                     }}/>
                <ScrollView style={{flex: 1}}>
                    <TextInput
                        style={[styles.textareaStyle, {
                            minHeight: 300,
                        }]}
                        placeholder={'请输入您的意见建议…'}
                        placeholderTextColor={'#c7c7cd'}
                        multiline={true}
                        onChangeText={(text) => {
                            if (text !== this.state.text) {
                                this.setState({
                                    text: text,
                                    btnFlag: true,
                                })
                            }
                        }}
                        defaultValue={this.state.text}
                        onContentSizeChange={this.onContentSizeChange.bind(this)}
                        underlineColorAndroid={'transparent'}
                        onBlur={this.blurReg.bind(this)}
                        keyboardType={'default'}
                    />
                    <Button text={'提交'} click={this.submit.bind(this)}/>
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

// {
//     type: 'btn',
//     'btnText': '保存',
//     click: this.submit.bind(this),
//     textStyle: {color: this.state.btnFlag ? '#fff' : '#7287cd',}
// }

    // 多行输入高度处理
    onContentSizeChange(event) {
        this.setState({
            textareaHeight: event.nativeEvent.contentSize.height,
        })
    }

    blurReg() {
        if (this.state.text !== '') {
            this.setState({
                btnFlag: true,
            })
        }
    }

    submit() {
        if (this.state.btnFlag) {
            this.setState({
                isLoading: true,
                loadingText: '正在提交',
            });
            Keyboard.dismiss();
            let formData = new FormData();
            formData.append("aaa", this.state.text);
            fetch(requestUrl.feedback, {
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
                        this.setState({
                            loadingText: '提交成功',
                        })
                        setTimeout(() => {
                            this.setState({
                                isLoading: false,
                            });
                            RouteName.pop();
                            this.props.navigation.goBack();
                        }, 1000)
                    } else if (responseData.status === '2') {
                        this.setState({
                            loadingText: '输入内容过长，限200字以内',
                        })
                        setTimeout(() => {
                            this.setState({
                                isLoading: false,
                            });
                        }, 1000)
                    } else {
                        this.setState({
                            isLoading: false,
                            text: '',
                        })
                    }
                })
                .catch(
                    (error) => {
                        this.setState({isLoading: false, text: ''});
                        console.log(error)
                    });

            // this.refs.toast.show('发送成功');
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EFEFEF',
        flex: 1,
        // height: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        // borderWidth: 1 / PixelRatio.get(),
    },
    textareaStyle: {
        marginTop: px2dp(6),
        backgroundColor: '#fff',
        paddingTop: px2dp(17),
        paddingLeft: px2dp(19),
        paddingRight: px2dp(19),
        paddingBottom: px2dp(17),
        marginBottom: px2dp(6),
        fontSize: FONT_SIZE(15),
        lineHeight: px2dp(35),
        color: '#333',
        textAlignVertical: 'top',
    },

});
