import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    FlatList,
    ScrollView,
    DeviceEventEmitter,
    BackHandler,
    RefreshControl,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import Communications from 'react-native-communications';
import px2dp from "../../common/Tool";

export default class My extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            department: "",
            doctorPhotoPath: UserImg,
            hospital: "",
            name: "",
            title: "",
            userName: "",// 手机号
            status: '',// 认证状态
            statusText: '',
        }
    }

    componentWillMount() {
        // RouteName.push(this.props.navigation.state);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }
    }

    componentDidMount() {
        DeviceEventEmitter.addListener('myData', (data) => {
            this.myData();
        });
        //获取数据－我的首页信息
        this.myData();
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('myData');
    }

    _onRefresh(){
        this.myData();
    }
    render() {
        const {navigate, goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
                {this.state.isLoading ? <Loading text={'加载中...'}/> : null}
                <ScrollView
                    style={{flex: 1}}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >

                    <TouchableOpacity
                        onPress={() => {
                            // if (this.state.status === '0') {
                            //     navigate('UserInfo', {
                            //         'callback': (data) => {
                            //             this.setState({
                            //                 doctorPhotoPath: data,
                            //             });
                            //         }
                            //     })
                            // } else {
                            //     this.refs.toast.show(this.state.statusText)
                            // }
                            if (this.state.status === '0') {
                                navigate('UserInfo', {
                                    'callback': (data) => {
                                        this.setState({
                                            doctorPhotoPath: data,
                                        });
                                    }
                                })
                            } else if (this.state.status === '3') {
                                this.refs.toast.show(this.state.statusText)
                            } else {
                                Alert.alert('', '您还未认证，去认证?', [
                                    {
                                        text: '取消', onPress: () => {
                                        }
                                    },
                                    {
                                        text: '确认', onPress: () => {
                                            navigate('AttestationOne');
                                        }
                                    },
                                ])
                            }
                        }}
                        activeOpacity={1}
                    >
                        <View style={styles.userContent}>
                            <View style={styles.userBox}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // if (this.state.status === '0') {
                                        //     navigate('AmendUserImg', {
                                        //         userImgUrl: this.state.doctorPhotoPath,
                                        //         callback: (data) => {
                                        //             this.setState({
                                        //                 doctorPhotoPath: data,
                                        //             })
                                        //         }
                                        //     })
                                        // } else {
                                        //     this.refs.toast.show(this.state.statusText)
                                        // }

                                        if (this.state.status === '0') {
                                            navigate('AmendUserImg', {
                                                userImgUrl: this.state.doctorPhotoPath,
                                                callback: (data) => {
                                                    this.setState({
                                                        doctorPhotoPath: data,
                                                    })
                                                }
                                            })
                                        } else if (this.state.status === '3') {
                                            this.refs.toast.show(this.state.statusText)
                                        } else {
                                            Alert.alert('', '您还未认证，去认证?', [
                                                {
                                                    text: '取消', onPress: () => {
                                                    }
                                                },
                                                {
                                                    text: '确认', onPress: () => {
                                                        navigate('AttestationOne');
                                                    }
                                                },
                                            ])
                                        }
                                    }}
                                    activeOpacity={.8}
                                >


                                    <Image style={styles.userImg} source={{uri: this.state.doctorPhotoPath}}/>
                                </TouchableOpacity>
                                <View style={styles.userTextBox}>
                                    <Text
                                        style={styles.userName}>{this.state.status === '0' ? this.state.name + '－' + this.state.title : this.state.userName}</Text>
                                    <Text
                                        style={styles.userHospital}>{this.state.status === '0' ? this.state.department + ' ' + this.state.hospital : this.state.statusText}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => {
                            navigate('Collection');
                        }}
                        activeOpacity={.8}
                    >
                        <View style={[styles.content, {marginTop: 9,}]}>
                            <Image source={require('../../images/collection.png')} style={styles.contentIcon}/>
                            <Text style={styles.contentText}>收藏的病历</Text>
                            <Image source={require('../../images/arrow_gray_right.png')} style={styles.contentImg}/>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigate('Tidings');
                        }}
                        activeOpacity={.8}
                    >
                        <View style={[styles.content, {marginTop: 1,}]}>
                            <Image source={require('../../images/tidings.png')} style={styles.contentIcon}/>
                            <Text style={styles.contentText}>消息</Text>
                            <Image source={require('../../images/arrow_gray_right.png')} style={styles.contentImg}/>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigate('Earnings', {'data': this.state});
                        }}
                        activeOpacity={.8}
                    >
                        <View style={[styles.content, {marginTop: 9,}]}>
                            <Image source={require('../../images/profit.png')} style={styles.contentIcon}/>
                            <Text style={styles.contentText}>收益</Text>
                            <Image source={require('../../images/arrow_gray_right.png')} style={styles.contentImg}/>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.state.status === '0') {
                                navigate('UserInfo', {
                                    'callback': (data) => {
                                        this.setState({
                                            doctorPhotoPath: data,
                                        });
                                    }
                                })
                            } else if (this.state.status === '3') {
                                this.refs.toast.show(this.state.statusText)
                            } else {
                                Alert.alert('', '您还未认证，去认证?', [
                                    {
                                        text: '取消', onPress: () => {
                                        }
                                    },
                                    {
                                        text: '确认', onPress: () => {
                                            navigate('AttestationOne');
                                        }
                                    },
                                ])
                            }
                        }}
                        activeOpacity={.8}
                    >
                        <View style={[styles.content, {marginTop: 9,}]}>
                            <Image source={require('../../images/user_info.png')} style={styles.contentIcon}/>
                            <Text style={styles.contentText}>个人信息</Text>
                            <Image source={require('../../images/arrow_gray_right.png')} style={styles.contentImg}/>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.state.status === '0') {
                                navigate('Approve');
                            } else if (this.state.status === '3') {
                                this.refs.toast.show(this.state.statusText)
                            } else {
                                Alert.alert('', '您还未认证，去认证?', [
                                    {
                                        text: '取消', onPress: () => {
                                        }
                                    },
                                    {
                                        text: '确认', onPress: () => {
                                            navigate('AttestationOne');
                                        }
                                    },
                                ])
                            }
                        }}
                        activeOpacity={.8}
                    >
                        <View style={[styles.content, {marginTop: 1,}]}>
                            <Image source={require('../../images/ident_info.png')} style={styles.contentIcon}/>
                            <Text style={styles.contentText}>认证信息</Text>
                            <Image source={require('../../images/arrow_gray_right.png')} style={styles.contentImg}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigate('SetUp', {userName: this.state.userName})
                        }}
                        activeOpacity={.8}
                    >
                        <View style={[styles.content, {marginTop: 9,}]}>
                            <Image source={require('../../images/setup.png')} style={styles.contentIcon}/>
                            <Text style={styles.contentText}>设置</Text>
                            <Image source={require('../../images/arrow_gray_right.png')} style={styles.contentImg}/>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert('拨打电话', '010-6378 6220', [
                                {
                                    text: '取消', onPress: () => {
                                    }
                                },
                                {
                                    text: '确认', onPress: () => {
                                        Communications.phonecall('010 6378 6220', true);
                                    }
                                },
                            ])
                        }}
                        style={{marginBottom: 20,}}
                        activeOpacity={.8}
                    >
                        <View style={[styles.content, {marginTop: 1,}]}>
                            <Image source={require('../../images/customer_service.png')}
                                   style={styles.contentIcon}/>
                            <Text style={styles.contentText}>客服</Text>
                            <Image source={require('../../images/arrow_gray_right.png')} style={styles.contentImg}/>
                        </View>
                    </TouchableOpacity>
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

// 获取个人信息
    myData() {
        fetch(requestUrl.myCenter)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({isLoading: false});
                if (responseData.status === '10') {
                    this.props.navigation.navigate('Login');
                } else if (responseData.status === '0') {
                    this.setState({
                        status: responseData.status,
                        department: responseData.department,
                        doctorPhotoPath: requestUrl.ImgIp + responseData.doctorPhotoPath,
                        hospital: responseData.hospital,
                        name: responseData.name,
                        title: responseData.title,
                        userName: responseData.userName,
                    })
                } else if (responseData.status === '1') {
                    this.setState({
                        userName: responseData.userName,
                        status: responseData.status,
                        statusText: '您还未认证',
                    })
                } else if (responseData.status === '2') {
                    this.setState({
                        status: '2',
                        statusText: '您还未认证',
                        userName: responseData.userName,
                    })
                } else if (responseData.status === '3') {
                    this.setState({
                        status: '3',
                        statusText: '您的认证信息正在审核中',
                        userName: responseData.userName,
                    })
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false})
                });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    // 医生信息
    userContent: {
        justifyContent: 'center',
        height: IOS ? px2dp(212) : px2dp(212) - StatusBarHeight,
        paddingTop: IOS ? 20 : 0,
        backgroundColor: '#5168b7',
    },
    userBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(80),
        paddingLeft: px2dp(27),
    },
    userImg: {
        width: px2dp(80),
        height: px2dp(80),
        borderRadius: px2dp(40),
    },
    userTextBox: {
        justifyContent: 'space-between',
        marginLeft: px2dp(14),
    },
    userName: {
        fontSize: FONT_SIZE(20),
        color: '#FFFFFF',
    },
    userHospital: {
        fontSize: FONT_SIZE(14),
        color: '#FFFFFF',
        width: px2dp(230),
    },
    // 功能列表
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(42),
        backgroundColor: '#fff',
        paddingLeft: px2dp(26),
    },
    contentText: {
        paddingLeft: px2dp(22),
        fontSize: FONT_SIZE(16),
        color: '#333',
    },
    contentImg: {
        position: 'absolute',
        right: px2dp(14),
        top: px2dp(13),
    },

});
