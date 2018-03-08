import React, {Component} from 'react';
import {
    BackHandler,
    AppState,
    DeviceEventEmitter,
    AsyncStorage,
    View,
    NetInfo,
} from 'react-native';
import Index from './Index';
import {requestUrl} from "./Network/url";
import {Global} from './common/Global';


// if (!__DEV__) {
//     global.console = {
//         info: () => {
//         },
//         log: () => {
//         },
//         warn: () => {
//         },
//         error: () => {
//         }
//     }
// }

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        AppState.addEventListener('change', this.AppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.AppStateChange);
    }

    AppStateChange = (nextAppState) => {
        console.log(nextAppState)
        // 登陆状态锁屏
        if (nextAppState === 'active') {
            fetch(requestUrl.getId)
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.status === '10') {
                        AsyncStorage.getItem('UserPhone').then((result) => {
                            if (result) {
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
                                            //请求成功
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
                                                    console.log(responseData);
                                                })
                                                .catch(
                                                    (error) => {
                                                        this.setState({isLoading: false,});
                                                        console.log('error', error);
                                                    });
                                        } else {
                                            console.log('shibai');
                                        }
                                    })
                                    .catch(
                                        (error) => {
                                            console.log('error', error);
                                        });
                            }
                        });
                    } else {
                        // Obj.this.props.navigation.navigate("Home");
                        // UserInfo.doctorId = responseData.doctorId;
                        DeviceEventEmitter.emit("Index", "heheh");
                    }
                })
                .catch((error) => {
                    RouteName.splice(0, RouteName.length);
                    Obj.this.props.navigation.navigate('Login');
                    console.log('error', error);
                });
        } else {
            if (IOS && WS.flag) {
                WS.flag = false;
                WS.ws.close();
            }
        }
    };

    render() {
        return (
            <Index/>
        )
    }
}

