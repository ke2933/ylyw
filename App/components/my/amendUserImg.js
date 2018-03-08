import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Alert,
    Image,
    Dimensions,
    Platform,
    PixelRatio,
    StatusBar,
    TouchableOpacity,
    TextInput,
    BackHandler,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Button from '../../common/Button';//按钮
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import UploadPhoto from '../../common/UploadPhoto';//相机拍照
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';

export default class amendUserImg extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            loadingText: '',
            userImgUrl: '',
            oldUserImgUrl: '',
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
                userImgUrl: this.props.navigation.state.params.userImgUrl,
                oldUserImgUrl: this.props.navigation.state.params.userImgUrl,
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
                         state.params.callback(this.state.userImgUrl);
                         RouteName.pop();
                         goBack();
                     }}
                     data={{
                         'leftBtn': true,
                         'title': '真实照片',
                         'rightBtn': {
                             type: 'upLoadImg', 'assemblyName': UploadPhoto, 'changeImg': (data) => {
                                 this.caseImgUrl(data)
                             }
                         }
                     }}/>
                <Image
                    style={styles.userImg}
                    source={{uri: this.state.userImgUrl}}
                />
                <Button text={'保存'} click={this.submit.bind(this)}/>
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

    caseImgUrl(data) {
        console.log(data);
        this.setState({
            userImgUrl: data,
        })
    }

    submit() {
        if (this.state.userImgUrl === '' || this.state.userImgUrl === this.state.oldUserImgUrl) {
            this.refs.toast.show('您未作出修改');
        } else {

            this.setState({isLoading: true, loadingText: '上传中...'});
            let formData = new FormData();
            let userImgUrl = {
                uri: this.state.userImgUrl,
                type: 'multipart/form-data',
                name: 'userImg'
            };
            formData.append("file", userImgUrl);//医生照片
            fetch(requestUrl.updateHead, {
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
                            this.props.navigation.state.params.callback(this.state.userImgUrl);
                            this.props.navigation.goBack(this.props.navigation.state.key);
                        }, 1000);
                    } else {
                        this.setState({isLoading: false});
                        this.refs.toast.show('修改失败，请重试');
                    }
                })
                .catch(
                    (error) => {
                        this.setState({isLoading: false});
                        this.refs.toast.show('修改失败,请稍后重试');
                        console.log('error', error);
                    });
        }

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EFEFEF',
        flex: 1,
    },
    userImg: {
        marginTop: 5,
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH,
    }
});
