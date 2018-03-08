import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Keyboard,
    BackHandler,
    ScrollView,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import px2dp from "../../common/Tool";

export default class Nominate extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            btnFlag: false,
            textareaHeight: 50,
            doctorHonour: '',
            isLoading: false,
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

        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params.data;
            this.setState({
                doctorHonour: data,
            })
        }
    }

    render() {
        const {goBack, state} = this.props.navigation;
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
                         'title': '擅长',
                         'rightBtn': {
                             type: 'btn',
                             'btnText': '保存',
                             click: this.submit.bind(this),
                             textStyle: {color: this.state.btnFlag ? '#fff' : '#7287cd',}
                         }
                     }}/>
                <ScrollView
                    style={{flex: 1,}}>
                    <TextInput
                        style={[styles.textareaStyle, {
                            minHeight: 300,
                        }]}
                        placeholder={'请输入...'}
                        placeholderTextColor={'#c7c7cd'}
                        multiline={true}
                        defaultValue={this.props.navigation.state.params.data}
                        onChangeText={(text) => {
                            if (text !== this.props.navigation.state.params.data) {
                                this.setState({
                                    doctorHonour: text,
                                    btnFlag: true,
                                })
                            } else {
                                this.setState({
                                    btnFlag: false,
                                })
                            }
                        }}
                        onContentSizeChange={this.onContentSizeChange.bind(this)}
                        underlineColorAndroid={'transparent'}
                        onBlur={this.blurReg.bind(this)}
                    />
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

    // 多行输入高度处理
    onContentSizeChange(event) {
        this.setState({
            textareaHeight: event.nativeEvent.contentSize.height,
        })
    }

    blurReg() {
        // 判断内容是否有变化
        if (this.state.doctorHonour !== this.props.navigation.state.params.data) {
            this.setState({
                btnFlag: true,
            })
        }
    }

    submit() {
        const {navigate, goBack, state} = this.props.navigation;
        if (this.state.doctorIntroduceOneself === '') {
            this.refs.toast.show('请输入内容');
        } else {
            if (this.state.btnFlag) {
                Keyboard.dismiss();
                this.setState({isLoading: true, loadingText: '上传中...'});
                let formData = new FormData();
                formData.append("doctorIntroduceOneself", this.state.doctorHonour);
                fetch(requestUrl.addDetail, {
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
                            this.setState({loadingText: '修改成功'});
                            setTimeout(() => {
                                this.setState({isLoading: false});
                                state.params.callback(this.state.doctorHonour);
                                RouteName.pop();
                                goBack();
                            }, 1000)
                        } else if (responseData.status === '1') {
                            this.setState({isLoading: false});
                            this.refs.toast.show('修改失败，请重试');
                        } else if (responseData.status === '2') {
                            this.setState({isLoading: false});
                            this.refs.toast.show('请输入内容');
                        } else if (responseData.status === '3') {
                            this.setState({isLoading: false});
                            this.refs.toast.show('输入内容过长，请精简后重新保存');
                        } else {
                            this.setState({isLoading: false});
                            this.refs.toast.show('修改失败，请重试');
                        }
                    })
                    .catch(
                        (error) => {
                            this.refs.toast.show('修改失败，请稍后重试');
                            this.setState({isLoading: false});
                            console.log(error)
                        });
            }

        }

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EFEFEF',
        flex: 1,
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
