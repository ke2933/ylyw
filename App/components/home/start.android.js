import React, {Component} from 'react';
import {
    BackHandler,
    AppState,
    DeviceEventEmitter,
    AsyncStorage,
    View,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    NetInfo,
} from 'react-native';
import {requestUrl} from "../../Network/url";
import {Global} from '../../common/Global';
import Swiper from 'react-native-swiper';

export default class App extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            flag: true,
            isConnected: false,
            guideImg: [
                {img: require('../../guide/one.png')},
                {img: require('../../guide/two.png')}
            ],
        }
    }

    componentWillMount() {
        // AsyncStorage.clear();
        Obj.fn(this);
        // 绑定对应用前-后台状态的监听
        AppState.addEventListener('change', this.AppStateChange);
        // 绑定对网络状况的监听
        NetInfo.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );

        // 读取 AsyncStorage - KeyId 是否是第一次打开
        AsyncStorage.getItem('KeyId').then((result) => {
            console.log(JSON.parse(result))
            if (JSON.parse(result)) {
                this.setState({
                    flag: true,
                })
            } else {
                this.setState({
                    flag: false,
                })
            }
        });
        fetch(requestUrl.getId)
            .then((response) => response.json())
            .then((responseData) => {
                // 判断是否有登录状态
                if (responseData.status === '10') {
                    AsyncStorage.getItem('UserPhone').then((result) => {
                        // 判断是否退出登录
                        if (JSON.parse(result)) {
                            // 未退出登录，需重新登录
                            // 根据手机号获取登录验证码
                            let phone = JSON.parse(result);
                            let formData = new FormData();
                            formData.append("phone", phone);
                            fetch(requestUrl.againSend, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                                body: formData,
                            })
                                .then((response) => response.json())
                                .then((responseData) => {
                                    console.log(responseData);
                                    // 0:请求成功 2:手机号不能为空 3:手机号格式不正确 4:帐号不存在
                                    if (responseData.status === '0') {
                                        //请求成功，通过短信验证码登录
                                        let formData = new FormData();
                                        formData.append("doctorPhone", phone);
                                        formData.append("verificationCode", responseData.oauthStatus);
                                        console.log(formData)
                                        fetch(requestUrl.smsLogin, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'multipart/form-data',
                                            },
                                            body: formData,
                                        })
                                            .then((response) => response.json())
                                            .then((responseData) => {
                                                setTimeout(() => {
                                                    this.props.navigation.navigate('Home');
                                                }, 1000)
                                            })
                                            .catch(
                                                (error) => {
                                                    this.setState({isLoading: false,});
                                                    console.log('error', error);
                                                });
                                    } else {
                                        RouteName.splice(0, RouteName.length);
                                        this.props.navigation.navigate('Login');
                                    }
                                })
                                .catch(
                                    (error) => {
                                        console.log('error', error);
                                    });
                        } else {
                            // 没有登录状态 && 不需要重新登录
                            if (this.state.flag) {
                                this.props.navigation.navigate('Login');
                            }
                        }
                    });
                } else {
                    // 有登录状态
                    this.props.navigation.navigate('Home');
                    DeviceEventEmitter.emit("Index", "hehe");
                }
            })
            .catch((error) => {
                RouteName.splice(0, RouteName.length);
                this.props.navigation.navigate('Login');
                console.log('error', error);
            });
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.AppStateChange);
        NetInfo.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
    }
    _handleConnectivityChange = (isConnected) => {
        if(isConnected.type === "none"){
            this.setState({
                isConnected: false,
            })
        } else {
            this.setState({
                isConnected: true,
            })
        }

    };

    AppStateChange = (nextAppState) => {
        // 登陆状态锁屏
        if (nextAppState === 'active') {
            fetch(requestUrl.getId)
                .then((response) => response.json())
                .then((responseData) => {
                    // 判断是否有登录状态
                    if (responseData.status === '10') {
                        AsyncStorage.getItem('UserPhone').then((result) => {
                            // 判断是否退出登录
                            if (JSON.parse(result)) {
                                // 未退出登录，需重新登录
                                // 根据手机号获取登录验证码
                                let phone = JSON.parse(result);
                                let formData = new FormData();
                                formData.append("phone", phone);
                                fetch(requestUrl.againSend, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                    body: formData,
                                })
                                    .then((response) => response.json())
                                    .then((responseData) => {
                                        console.log(responseData);
                                        // 0:请求成功 2:手机号不能为空 3:手机号格式不正确 4:帐号不存在
                                        if (responseData.status === '0') {
                                            //请求成功，通过短信验证码登录
                                            let formData = new FormData();
                                            formData.append("doctorPhone", phone);
                                            formData.append("verificationCode", responseData.oauthStatus);
                                            console.log(formData)
                                            fetch(requestUrl.smsLogin, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'multipart/form-data',
                                                },
                                                body: formData,
                                            })
                                                .then((response) => response.json())
                                                .then((responseData) => {
                                                    setTimeout(() => {
                                                        this.props.navigation.navigate('Home');
                                                    }, 1000)
                                                })
                                                .catch(
                                                    (error) => {
                                                        this.setState({isLoading: false,});
                                                        console.log('error', error);
                                                    });
                                        } else {
                                            RouteName.splice(0, RouteName.length);
                                            this.props.navigation.navigate('Login');
                                        }
                                    })
                                    .catch(
                                        (error) => {
                                            console.log('error', error);
                                        });
                            } else {
                                // 没有登录状态 && 不需要重新登录
                                if (this.state.flag) {
                                    // this.props.navigation.navigate('Login');
                                }
                            }
                        });
                    } else {
                        // 有登录状态
                        DeviceEventEmitter.emit("Index", "hehe");
                    }
                })
                .catch((error) => {
                    RouteName.splice(0, RouteName.length);
                    this.props.navigation.navigate('Login');
                    console.log('error', error);
                });
        }
    };

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                {/*启动页/引导页 显示一个*/}
                {this.state.flag ?
                    // 启动页图片
                    <Image
                        source={require('../../images/splash.png')}
                        style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}/>
                    :
                    <View style={{flex: 1}}>
                        <Swiper
                            showsPagination={false}
                            loop={false}
                            dotColor={'#fff'}
                            activeDotColor={'#7082be'}
                            autoplay={false}
                        >
                            {this.slideItem()}
                        </Swiper>
                    </View>
                }
            </View>
        )
    }


    slideItem() {
        let temp = [];
        let l = this.state.guideImg.length;
        let guideImgArr = this.state.guideImg;
        for (let i = 0; i < l; i++) {
            if (i === l - 1) {
                temp.push(
                    <TouchableOpacity
                        key={i}
                        style={{flex: 1}}
                        activeOpacity={1}
                        onPress={() => {
                            AsyncStorage.setItem('KeyId', '1').then(() => {
                                console.log('成功');
                                this.props.navigation.navigate('Login');
                            }).catch((error) => {
                                console.log('失败');
                            });
                        }}
                    >
                        <View style={{flex: 1, justifyContent: 'flex-end'}}>
                            <Image resizeMode={'stretch'} source={guideImgArr[i].img} style={styles.img}/>
                        </View>
                    </TouchableOpacity>
                )
            } else {
                temp.push(
                    <View key={i} style={{flex: 1, justifyContent: 'flex-end'}}>
                        <Image resizeMode={'stretch'} source={guideImgArr[i].img} style={styles.img}/>
                    </View>
                )
            }
        }
        return temp;
    }
}

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    img: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    }

});

