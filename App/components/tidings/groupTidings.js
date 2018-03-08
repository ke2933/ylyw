import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
    AsyncStorage,
    DeviceEventEmitter,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Button from '../../common/Button';//按钮
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import px2dp from "../../common/Tool";

export default class groupTidings extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isRefresh: false,
            isLoading: false,
            chatRoomList: [],
            doctorDetailId: '',// 当前医生id
        }
    }

    componentDidMount() {
        DeviceEventEmitter.addListener('Tidings', (data) => {
            // 获取聊天室列表
            this.ChatRefresh();
        });
        fetch(requestUrl.selectDoctorDetailIdByDoctorId)
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status === '0') {
                    this.setState({
                        doctorDetailId: responseData.doctorDetailId,
                    })
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
        // 获取聊天室列表
        this.ChatRefresh();
    }
    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('Tidings');
    }
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.FlatListStyle}
                    data={this.state.chatRoomList}
                    ItemSeparatorComponent={() => {
                        return (<View style={styles.FlatListLine}></View>)
                    }}// 分割线
                    initialNumToRender={20}//首批渲染数量
                    keyExtractor={item => item.id}
                    renderItem={({item}) => this.renderItem(item)}
                    onRefresh={() => {
                        this.setState({
                            isRefresh: true,
                        });
                        this.ChatRefresh();
                    }}
                    refreshing={this.state.isRefresh}//加载图案
                    ListEmptyComponent={() => {
                        return (
                            <View style={styles.noDataBox}>
                                <Image source={require('../../images/no_data.png')}/>
                                <Text style={styles.noDataText}>暂无信息</Text>
                            </View>
                        )
                    }}
                />

            </View>
        );
    }

    ChatRefresh() {
        fetch(requestUrl.getChatRoom)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({
                    isRefresh: false,
                });
                if (responseData.status === '0') {
                    let chatRoomList = responseData.chatRoomList;
                    chatRoomList.map((item, index) => {
                        AsyncStorage.getItem(UserInfo.doctorId+'CIArr').then((result) => {
                            if (result) {
                                let temp = JSON.parse(result)[item.id];
                                if (temp && temp.length > 0) {
                                    item.unreadNum = temp.length;
                                    item.text = temp[temp.length - 1].messageContent;
                                } else {
                                    AsyncStorage.getItem(item.id).then((result) => {
                                        if (result) {
                                            let temp = JSON.parse(result);
                                            if (temp && temp.length > 0) {
                                                item.unreadNum = 0;
                                                item.text = temp[temp.length - 1].messageContent;
                                            } else {
                                                item.unreadNum = 0;
                                                item.text = '';
                                            }
                                        } else {
                                            item.unreadNum = 0;
                                            item.text = '';
                                        }
                                    })
                                }
                            } else {
                                AsyncStorage.getItem(item.id).then((result) => {
                                    if (result) {
                                        let temp = JSON.parse(result);
                                        console.log(temp);

                                        if (temp && temp.length > 0) {
                                            item.unreadNum = 0;
                                            item.text = temp[temp.length - 1].messageContent;
                                        } else {
                                            item.unreadNum = 0;
                                            item.text = '';
                                        }
                                    } else {
                                        item.unreadNum = 0;
                                        item.text = '';
                                    }
                                })
                            }
                        });
                    });
                    setTimeout(() => {
                        this.setState({
                            chatRoomList: chatRoomList,
                        })
                    }, 500)

                }
            })
            .catch(
                (error) => {
                    this.setState({isRefresh: false,});
                    console.log('error', error);
                });
    }

    renderItem = (item) => {
        const {navigate, goBack} = Obj.this.props.navigation;
        let doctorDetailList = item.doctorDetailList;
        let userImgArr = [];
        let smallStyle = {width: px2dp(48), height: px2dp(48)};
        for (let i = 0; i < doctorDetailList.length; i++) {
            userImgArr.push(
                <Image key={i} source={{uri: requestUrl.ImgIp + doctorDetailList[i].doctorPhotoPath}}
                       style={[styles.userImg, doctorDetailList.length <= 1 ? smallStyle : null]}/>
            )
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    navigate('Chat', {data: {"consultationId": item.id}});
                }}
                activeOpacity={.8}
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                }}
            >
                <View style={styles.groupTidingsItem}>
                    <View style={styles.userImgBox}>
                        {userImgArr}
                    </View>
                    <View style={styles.rightBox}>
                        <View style={styles.userNameBox}>
                            <Text style={styles.userName}>{item.roomName}</Text>
                        </View>
                        <Text numberOfLines={1} style={styles.tidingsText}>{item.text}</Text>
                        {item.unreadNum > 0 ? <View style={styles.unreadNumBox}>
                            <Text style={styles.unreadNum}>{item.unreadNum > 99 ? '...' : item.unreadNum}</Text>
                        </View> : null}
                    </View>
                </View>
            </TouchableOpacity>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel,
        backgroundColor: '#EFEFEF',
    },
    // 会诊互动FlatList
    FlatListStyle: {
        flex: 1,
    },
    FlatListLine: {
        height: Pixel,
        backgroundColor: '#d6e1e8',
    },
    // 会诊互动item
    groupTidingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(50),
        marginLeft: px2dp(20),
        marginRight: px2dp(20),
        marginTop: px2dp(15),
        marginBottom: px2dp(15),
    },
    userImgBox: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: px2dp(50),
        height: px2dp(50),
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        borderRadius: px2dp(5),
        padding: px2dp(1),
    },
    userImg: {
        width: px2dp(23),
        height: px2dp(23),
        marginBottom: px2dp(1),
        borderRadius: px2dp(5),
    },
    rightBox: {
        flex: 1,
        marginLeft: px2dp(12),
        height: px2dp(50),
        justifyContent: 'space-between',
    },
    userNameBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userName: {
        lineHeight: px2dp(23),
        fontSize: FONT_SIZE(18),
        color: '#333',
    },
    time: {
        lineHeight: px2dp(23),
        fontSize: FONT_SIZE(14),
        color: '#898989',
    },
    tidingsText: {
        width: px2dp(260),
        fontSize: FONT_SIZE(14),
        color: '#898989',
        lineHeight: px2dp(23),
    },
    unreadNumBox: {
        position: 'absolute',
        top: px2dp(5),
        right: px2dp(8),
        alignItems: 'center',
        justifyContent: 'center',
        width: px2dp(20),
        height: px2dp(20),
        borderRadius: px2dp(10),
        overflow: 'hidden',
        backgroundColor: 'red',
    },
    unreadNum: {
        fontSize: FONT_SIZE(12),
        color: '#fff',
        fontWeight: 'bold',
    },
    // 无数据模块
    noDataBox: {
        flex: 1,
        marginTop: px2dp(150),
        alignItems: 'center',
    },
    noDataText: {
        marginTop: px2dp(20),
        fontSize: FONT_SIZE(16),
        color: '#757575',
    },
});
