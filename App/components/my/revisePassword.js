import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TextInput,
    TouchableOpacity,
    BackHandler,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Button from '../../common/Button';//按钮
import BackgroundTimer from 'react-native-background-timer';
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';

export default class revisePassword extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            doctorPhone: '',//手机号
            doctorPassword: '',//旧密码
            password: '',
            newPassword: '',//验证2次密码是否一致
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
            this.setState({
                doctorPhone: this.props.navigation.state.params.data.userName,
            })
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
                    networkActivityIndicatorVisible={this.state.isLoading}
                    statusBarStyle={"default"}//ios:白底黑字  android:黑底白字
                />
                <Nav navigation={this.props.navigation}
                     leftClick={() => {
                         RouteName.pop();

                         goBack();
                     }}
                     data={{
                         'leftBtn': true,
                         'title': '修改密码',
                         'rightBtn': {type: 'false'}
                     }}/>
                <View style={styles.content}>
                    <View style={styles.textInputBox}>
                        <Text style={styles.textInputTitle}>旧密码</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'请输入旧密码'}
                            placeholderTextColor={'#c7c7cd'}
                            onChangeText={(text) => this.setState({doctorPassword: text})}
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={true}
                            onBlur={this.oldPassword.bind(this)}
                        />
                    </View>
                    <View style={styles.textInputBox}>
                        <Text style={styles.textInputTitle}>新密码</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'请输入新密码'}
                            placeholderTextColor={'#c7c7cd'}
                            onChangeText={(text) => this.setState({password: text})}
                            secureTextEntry={true}
                            underlineColorAndroid={'transparent'}
                            onBlur={this.passwordReg.bind(this)}
                        />
                    </View>
                    <View style={styles.textInputBox}>
                        <Text style={styles.textInputTitle}>确认密码</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'请再次输入密码'}
                            secureTextEntry={true}
                            placeholderTextColor={'#c7c7cd'}
                            onChangeText={(text) => this.setState({newPassword: text})}
                            underlineColorAndroid={'transparent'}
                            onBlur={this.newPassword.bind(this)}
                        />
                    </View>
                    <Text style={styles.promptText}>{this.state.prompt}</Text>
                    <Button text={'确定'} click={this.submit.bind(this)}/>
                    <Toast
                        ref='toast'
                        style={{backgroundColor: '#333333', borderRadius: 10,}}
                        position={'top'}
                        textStyle={{color: '#ffffff', fontSize: 16,}}
                        fadeInDuration={3000}
                        opacity={.8}
                    />
                </View>
            </View>
        );
    }

    oldPassword() {
        if (this.state.doctorPassword === '') {
            this.refs.toast.show('请输入旧密码');
        }
        if (!RegExp.Reg_PassWord.test(this.state.doctorPassword)) {
            this.refs.toast.show('请输入8~16个字母、数字或下划线，区分大小写');
            return;
        }
    }

    //新密码
    passwordReg() {
        if (this.state.password === '') {
            this.refs.toast.show('请输入新密码');
            return;
        }
        if (!RegExp.Reg_PassWord.test(this.state.password)) {
            this.refs.toast.show('请输入8~16个字母、数字或下划线，区分大小写');
            return;
        }
    }

    // 确认新密码
    newPassword() {
        if (this.state.newPassword === '') {
            this.refs.toast.show('请输入密码');
            return;
        }
        if (!RegExp.Reg_PassWord.test(this.state.newPassword)) {
            this.refs.toast.show('请输入8~16个字母、数字或下划线，区分大小写');
            return;
        }
        if (this.state.password !== this.state.newPassword) {
            this.refs.toast.show('两次密码不一致');
            return;
        }
    }

    // 提交事件
    submit() {

        if (this.state.doctorPassword === '') {
            this.refs.toast.show('请输入旧密码');
        }
        if (!RegExp.Reg_PassWord.test(this.state.doctorPassword)) {
            this.refs.toast.show('请核对旧密码');
            return;
        }
        if (this.state.password === '') {
            this.refs.toast.show('请输入新密码');
            return;
        }
        if (!RegExp.Reg_PassWord.test(this.state.password)) {
            this.refs.toast.show('请输入8~16个字母、数字或下划线，区分大小写');
            return;
        }
        if (this.state.newPassword === '') {
            this.refs.toast.show('请输入密码');
            return;
        }

        if (!RegExp.Reg_PassWord.test(this.state.newPassword)) {
            this.refs.toast.show('确认密码格式不正确');
            return;
        }
        if (this.state.password !== this.state.newPassword) {
            this.refs.toast.show('两次密码不一致');
            return;
        } else {
            this.setState({isLoading: true,});
            let formData = new FormData();
            formData.append("doctorPhone", this.state.doctorPhone);
            formData.append("doctorPassword", this.state.doctorPassword);
            formData.append("newPassword", this.state.newPassword);
            fetch(requestUrl.updatePassword, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((responseData) => {

                    if (responseData.status === '0') {
                        WS.ws.close();
                        this.setState({loadingText: '修改成功'});
                        setTimeout(() => {
                            this.setState({isLoading: false,});
                            this.props.navigation.navigate('Login');
                        }, 1000)
                    } else if (responseData.status === '3') {
                        this.setState({isLoading: false,});
                        this.refs.toast.show('旧密码输入有误，请重新填写');
                    } else {
                        this.setState({isLoading: false,});
                        this.refs.toast.show('请核对信息后，重试');
                    }

                })
                .catch(
                    (error) => {
                        console.log(error);
                        this.refs.toast.show('修改失败，请稍后重试');
                        this.setState({isLoading: false,});
                    });
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    content: {
        flex: 1,
        marginTop: px2dp(7),
        backgroundColor: '#fff',
    },
    textInputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(52),
        marginLeft: px2dp(16),
        marginRight: px2dp(16),
        borderBottomWidth: Pixel,
        borderBottomColor: '#d6e1e8',
    },
    textInput: {
        height: px2dp(52),
        flex: 1,
        paddingLeft: px2dp(20),
        fontSize: FONT_SIZE(17),
        margin: 0,
    },
    promptText: {
        marginTop: px2dp(10),
        marginLeft: px2dp(36),
        color: '#ff4c4c',
        fontSize: FONT_SIZE(14),
    },
    textInputTitle: {
        fontSize: FONT_SIZE(16),
        color: '#333',
    }

});
