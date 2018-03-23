import React, {Component} from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    BackHandler,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import {Global} from '../../common/Global';
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import Loading from '../../common/Loading';
import Nav from '../../common/Nav';
//导航


export default class Library extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            departmentName: '',
            departmentId: '',
            pageSize: '5',
            pageNo: '1',
            dataFlag: false,
            isRefresh: false,
            libraryArr: [],
            departmentFlag: false,
            firstArr: [],
            secondArr: [],
            isLoading: true,
            firstId: "",// 焦点
            secondId: '',
            oauthStatus: '',
        }
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

    componentDidMount() {
        fetch(requestUrl.oauthStatus)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '10') {
                    RouteName.splice(0, RouteName.length);
                    this.props.navigation.navigate('Login');
                } else {
                    this.setState({
                        oauthStatus: responseData.status,
                    })
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                    this.refs.toast.show('网络似乎断掉了');
                    console.log('error', error);
                });
        if (UserInfo.oauthStatus === '3') {
            // 已认证

            // 获取当前医生科室
            fetch(requestUrl.selectDepartment)
                .then((response) => response.json())
                .then((responseData) => {
                    // 获取病历库
                    console.log(responseData);
                    this.fetchLibraryData(responseData.id);
                    this.setState({
                        departmentName: responseData.deptName,
                        departmentId: responseData.id,
                        secondId: responseData.id,
                        firstId: responseData.parentId,

                    })
                })
                .catch(
                    (error) => {
                        console.log('error', error);
                    });
            // 获取科室列表
            fetch(requestUrl.medicalRecordDept)
                .then((response) => response.json())
                .then((responseData) => {
                    console.log(responseData)
                    if (responseData.status === '10') {
                        this.props.navigation.navigate('Login');
                    } else {
                        if (responseData.status === '0') {
                            this.setState({
                                firstArr: responseData.baseDeptList,
                            })
                        }
                    }
                })
                .catch(
                    (error) => {
                        this.setState({isLoading: false,});
                        this.refs.toast.show('网络似乎断掉了');
                        console.log('error', error);
                    });

        } else {
            // 未认证
            this.defaultSearchMedicalRecord();
        }

    }

    render() {
        const {navigate, goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
                {this.state.isLoading ? <Loading text={'加载中...'}/> : null}
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
                         'title': '病例库',
                         'rightBtn': {type: false}
                     }}/>
                {/*<View style={styles.navContent}>*/}
                {/*<TouchableOpacity*/}
                {/*onPress={() => {*/}
                {/*goBack();*/}
                {/*}}*/}
                {/*activeOpacity={.8}*/}
                {/*style={{paddingLeft: 10, paddingRight: 10, height: 40, justifyContent: 'center'}}*/}
                {/*>*/}
                {/*<Image source={require('../../images/arrow_left.png')}/>*/}
                {/*</TouchableOpacity>*/}
                {/*<TouchableOpacity*/}
                {/*activeOpacity={.8}*/}
                {/*onPress={() => {*/}
                {/*navigate('Search', {api: 'medicalRecordSearch'});*/}
                {/*}}*/}
                {/*style={{paddingRight: 10, paddingLeft: 10,}}*/}
                {/*>*/}
                {/*<View style={styles.searchBox}>*/}
                {/*<Image source={require('../../images/search_img.png')}/>*/}
                {/*<Text style={styles.searchText}>搜索医生、疾病等</Text>*/}
                {/*</View>*/}
                {/*</TouchableOpacity>*/}
                {/*</View>*/}
                <View style={styles.selectContent}>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.state.oauthStatus === '0' || this.state.oauthStatus === '1') {
                                // 未认证 认证完成第一步
                                Alert.alert('', '您选择的项目涉及医师会诊服务，考虑到医学严谨性，您需要先进行医师认证并通过审核', [
                                    {
                                        text: '暂不认证', onPress: () => {
                                        }
                                    },
                                    {
                                        text: '立即认证', onPress: () => {
                                            navigate('AttestationOne');
                                        }
                                    },
                                ]);
                            } else if (this.state.oauthStatus === '2') {
                                // 审核中
                                this.refs.toast.show('医师认证审核中，请在通过审核后继续查看');
                            } else if (this.state.oauthStatus === '3') {
                                // 已经认证
                                this.state.firstArr.map((item, index) => {
                                    if (item.id === this.state.firstId) {
                                        this.setState({
                                            secondArr: item.baseDeptList
                                        })
                                    }
                                });
                                this.setState({
                                    departmentFlag: true,
                                })
                            } else if (this.state.oauthStatus === '4') {
                                Alert.alert('', '系统维护中...')
                            } else if (this.state.oauthStatus === '5') {
                                // 认证失败
                                navigate('AttestationOne');
                            } else {
                                Alert.alert('', '系统维护中...')
                            }
                        }}
                        activeOpacity={.8}
                    >
                        <View style={styles.selectBox}>
                            <Text
                                style={styles.selectText}>{UserInfo.oauthStatus === '3' ? this.state.departmentName : '全部'}</Text>
                            <Image source={require('../../images/arrow_gray_right.png')}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => {
                            if (this.state.oauthStatus === '0' || this.state.oauthStatus === '1') {
                                // 未认证 认证完成第一步
                                Alert.alert('', '您选择的项目涉及医师会诊服务，考虑到医学严谨性，您需要先进行医师认证并通过审核', [
                                    {
                                        text: '暂不认证', onPress: () => {
                                        }
                                    },
                                    {
                                        text: '立即认证', onPress: () => {
                                            navigate('AttestationOne');
                                        }
                                    },
                                ]);
                            } else if (this.state.oauthStatus === '2') {
                                // 审核中
                                this.refs.toast.show('医师认证审核中，请在通过审核后继续查看');
                            } else if (this.state.oauthStatus === '3') {
                                // 已经认证
                                navigate('Search', {api: 'medicalRecordSearch'});
                            } else if (this.state.oauthStatus === '4') {
                                Alert.alert('', '系统维护中...')
                            } else if (this.state.oauthStatus === '5') {
                                // 认证失败
                                navigate('AttestationOne');
                            } else {
                                Alert.alert('', '系统维护中...')
                            }
                        }}
                    >
                        <View style={styles.searchImgBox}>
                            <Image style={styles.searchImg} source={require('../../images/search_big_img.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{
                    flex: 1,
                    backgroundColor: '#efefef',
                }}>
                    {UserInfo.oauthStatus === '3' ?
                        <FlatList
                            style={styles.FlatListStyle}
                            data={this.state.libraryArr}
                            initialNumToRender={20}
                            keyExtractor={item => item.id}
                            renderItem={({item}) => this.renderItem(item)}
                            ListFooterComponent={() => {
                                if (IPhoneX) {
                                    return (
                                        <View style={{height: 34,}}></View>
                                    )
                                } else {
                                    return null;
                                }
                            }}
                            onRefresh={() => {
                                this.setState({pageNo: '1'});
                                this.fetchLibraryData(this.state.departmentId);
                            }}
                            refreshing={this.state.isRefresh}
                            onEndReached={() => this.onEndReached()}
                            onEndReachedThreshold={.1}
                            ItemSeparatorComponent={() => {
                                return (
                                    <View style={{height: 1, backgroundColor: '#efefef'}}></View>
                                )
                            }}
                            ListEmptyComponent={() => {
                                return (
                                    <View style={styles.noDataBox}>
                                        <Image source={require('../../images/no_data.png')}/>
                                        <Text style={styles.noDataText}>暂无信息</Text>
                                    </View>
                                )
                            }}
                        />
                        :
                        <FlatList
                            style={styles.FlatListStyle}
                            data={this.state.libraryArr}
                            initialNumToRender={20}
                            keyExtractor={item => item.id}
                            renderItem={({item}) => this.renderItem(item)}
                            onRefresh={() => {
                                this.setState({pageNo: '1'});
                                this.defaultSearchMedicalRecord();
                            }}
                            ListFooterComponent={() => {
                                if (IPhoneX) {
                                    return (
                                        <View style={{height: 34,}}></View>
                                    )
                                } else {
                                    return null;
                                }
                            }}
                            ItemSeparatorComponent={() => {
                                return (
                                    <View style={{height: 1, backgroundColor: '#efefef'}}></View>
                                )
                            }}
                            refreshing={this.state.isRefresh}
                            onEndReached={() => this.onEndReached()}
                            onEndReachedThreshold={.1}
                            ListEmptyComponent={() => {
                                return (
                                    <View style={styles.noDataBox}>
                                        <Image source={require('../../images/no_data.png')}/>
                                        <Text style={styles.noDataText}>暂无信息</Text>
                                    </View>
                                )
                            }}
                        />}
                </View>
                <Toast
                    ref='toast'
                    style={{backgroundColor: '#333333', borderRadius: 10,}}
                    position={'center'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeInDuration={1000}
                    opacity={.8}
                />
                {this.state.departmentFlag ?
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({departmentFlag: false})
                        }}
                        activeOpacity={.1}
                        style={styles.MaskClick}
                    >

                        <TouchableOpacity
                            onPress={() => {
                            }}
                            activeOpacity={1}
                        >
                            <View style={styles.pickerContent}>
                                <FlatList
                                    style={styles.firstFlatList}
                                    data={this.state.firstArr}
                                    initialNumToRender={20}
                                    keyExtractor={item => item.id}
                                    renderItem={({item}) => this.firstRender(item)}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{
                                                borderTopWidth: Pixel,
                                                borderTopColor: '#dbdbdb',
                                            }}></View>
                                        )
                                    }}
                                />
                                <FlatList
                                    style={styles.secondFlatList}
                                    data={this.state.secondArr}
                                    initialNumToRender={20}
                                    keyExtractor={item => item.id}
                                    renderItem={({item}) => this.secondRender(item)}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{
                                                borderTopWidth: Pixel,
                                                borderTopColor: '#dbdbdb'
                                            }}></View>
                                        )
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    : null
                }

            </View>
        );
    }

    renderItem = (item) => {
        const {navigate} = this.props.navigation;
        // 展示图片
        let imgArr = item.pictureList;
        let temp = [];
        let style = {marginRight: px2dp(6)};
        if (imgArr.length >= 0) {

            for (let i = 0; i < (imgArr.length >= 3 ? 3 : imgArr.length); i++) {
                temp.push(
                    <Image key={i}
                           style={[styles.libraryImg, i < 3 ? style : null]}
                           source={{uri: requestUrl.ImgIp + imgArr[i].pictureUrl}}/>
                );
            }
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.state.oauthStatus === '0' || this.state.oauthStatus === '1') {
                        // 未认证 认证完成第一步
                        Alert.alert('', '您选择的项目涉及医师会诊服务，考虑到医学严谨性，您需要先进行医师认证并通过审核', [
                            {
                                text: '暂不认证', onPress: () => {
                                }
                            },
                            {
                                text: '立即认证', onPress: () => {
                                    navigate('AttestationOne');
                                }
                            },
                        ]);
                    } else if (this.state.oauthStatus === '2') {
                        // 审核中
                        this.refs.toast.show('医师认证审核中，请在通过审核后继续查看');
                    } else if (this.state.oauthStatus === '3') {
                        // 已经认证
                        navigate('LibraryInfo', {data: item});
                    } else if (this.state.oauthStatus === '4') {
                        Alert.alert('', '系统维护中...')
                    } else if (this.state.oauthStatus === '5') {
                        // 认证失败
                        navigate('AttestationOne');
                    } else {
                        Alert.alert('', '系统维护中...')
                    }
                }}
                activeOpacity={.8}
            >
                <View style={styles.libraryBox}>
                    <Text style={styles.libraryTitle}>{item.illnessName}</Text>
                    <View style={styles.libraryImgBox}>
                        {temp}
                    </View>
                    <View style={styles.starContent}>
                        <View style={styles.browseBox}>
                            <Image source={require('../../images/browse_false.png')}/>
                            <Text style={styles.browseText}>{item.lookNo}</Text>
                        </View>
                        <View style={styles.starBox}>
                            <Image
                                source={item.collectionType === '1' ? require('../../images/collection_true.png') : require('../../images/collection_false.png')}/>
                            <Text style={styles.starText}>{item.collectionNo}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )

    };

    // 加载更多事件
    onEndReached() {
        if (this.state.dataFlag) {
            let tempNo = this.state.pageNo * 1 + 1 + '';
            UserInfo.oauthStatus === '3' ?
                this.fetchLibraryDataMore(this.state.departmentId, tempNo)
                :
                this.defaultSearchMedicalRecordMore(tempNo);
            this.setState({
                pageNo: tempNo,
            });
        }

    }

    // 获取病历库
    fetchLibraryData(deptId) {
        let formData = new FormData();
        formData.append("deptId", deptId);
        formData.append("pageNo", '1');
        formData.append("pageSize", this.state.pageSize);
        console.log(formData);
        fetch(requestUrl.queryMedicalRecord, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({isLoading: false});
                if (responseData.status === '0') {
                    if (responseData.medicalRecordBaseBeanList.length >= this.state.pageSize) {
                        this.setState({
                            libraryArr: responseData.medicalRecordBaseBeanList,
                            isRefresh: false,
                            dataFlag: true,
                        })
                    } else {
                        this.setState({
                            libraryArr: responseData.medicalRecordBaseBeanList,
                            isRefresh: false,
                            dataFlag: false,
                        })
                    }
                } else {
                    this.setState({
                        libraryArr: [],
                        isRefresh: false,
                        dataFlag: false,
                    })
                }
            })
            .catch(
                (error) => {
                    this.refs.toast.show('网络似乎断掉了');
                    this.setState({isLoading: false,});
                    console.log('error', error);
                });
    }

    // 获取病历库 更多
    fetchLibraryDataMore(deptId, pageNo) {
        let formData = new FormData();
        formData.append("deptId", deptId);
        formData.append("pageNo", pageNo);
        formData.append("pageSize", this.state.pageSize);
        console.log(formData);
        fetch(requestUrl.queryMedicalRecord, {
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
                    if (responseData.medicalRecordBaseBeanList.length >= this.state.pageSize) {
                        let temp = this.state.libraryArr;
                        temp = temp.concat(responseData.medicalRecordBaseBeanList);
                        this.setState({
                            libraryArr: temp,
                            dataFlag: true,
                            isRefresh: false,
                        })
                    } else {
                        let temp = this.state.libraryArr;
                        temp = temp.concat(responseData.medicalRecordBaseBeanList);
                        this.setState({
                            libraryArr: temp,
                            dataFlag: false,
                            isRefresh: false,
                        })
                    }

                } else {
                    this.setState({
                        libraryArr: [],
                        dataFlag: false,
                        isRefresh: false,
                    })
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
    }

    firstRender = (item) => {
        let style = {backgroundColor: '#fff', color: '#566cb7'};
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        secondArr: item.baseDeptList,
                        firstId: item.id,
                    })
                }}
                key={item.id}
                activeOpacity={.8}
            >
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingRight: px2dp(12),
                    backgroundColor: this.state.firstId === item.id ? '#fff' : '#f5f5f5',
                }}>
                    <Text
                        style={[styles.optionText, this.state.firstId === item.id ? style : null]}>{item.deptName}</Text>
                    {this.state.firstId === item.id ?
                        <Image source={require('../../images/arrow_gray_right.png')}/> : null}
                </View>
            </TouchableOpacity>
        )
    };

    secondRender = (item) => {
        let style = {color: '#566cb7'};
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        departmentFlag: false,
                        departmentId: item.id,
                        departmentName: item.deptName,
                        secondId: item.id,
                    });
                    this.fetchLibraryData(item.id);
                }}
                key={item.id}
                activeOpacity={.8}
            >
                <Text style={[styles.optionText, this.state.secondId === item.id ? style : null]}>{item.deptName}</Text>
            </TouchableOpacity>
        )
    };

    // 未认证数据分页判断
    // onEndReached() {
    //     if (this.state.dataFlag) {
    //         let temp = this.state.pageNo * 1 + 1 + '';
    //         this.setState({
    //             pageNo: temp,
    //         });
    //         this.defaultSearchPoolMore(temp);
    //     }
    // }

    // 未认证查询首页接口
    defaultSearchMedicalRecord() {
        let formData = new FormData();
        formData.append("pageNo", '1');
        formData.append("pageSize", this.state.pageSize);
        fetch(requestUrl.defaultSearchMedicalRecord, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({isLoading: false});
                console.log(responseData);
                if (responseData.status === '0') {
                    if (responseData.medicalRecordBaseBeanList.length >= this.state.pageSize) {
                        this.setState({
                            libraryArr: responseData.medicalRecordBaseBeanList,
                            dataFlag: true,
                        });
                    } else {
                        this.setState({
                            libraryArr: responseData.medicalRecordBaseBeanList,
                            dataFlag: false,
                        });
                    }
                } else {
                    this.setState({
                        libraryArr: [],
                        dataFlag: false,
                    });
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
    }

    // 未认证更多接口
    defaultSearchMedicalRecordMore(pageNo) {
        let formData = new FormData();
        formData.append("pageNo", pageNo);
        formData.append("pageSize", this.state.pageSize);
        fetch(requestUrl.defaultSearchMedicalRecord, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.medicalRecordBaseBeanList.length >= this.state.pageSize) {
                    let temp = this.state.medicalPoolBeanList;
                    temp = temp.concat(responseData.medicalRecordBaseBeanList);
                    this.setState({
                        libraryArr: temp,
                        dataFlag: true,
                        isRefresh: false,
                    })
                } else {
                    let temp = this.state.medicalPoolBeanList;
                    temp = temp.concat(responseData.medicalRecordBaseBeanList);
                    this.setState({
                        libraryArr: temp,
                        dataFlag: false,
                        isRefresh: false,
                    })
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    // 导航
    // navContent: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'space-around',
    //     height: IOS ? 65 : 65 - StatusBarHeight,
    //     paddingTop: IOS ? 20 : 0,
    //     backgroundColor: '#fff',
    // },
    // searchBox: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     height: px2dp(33),
    //     borderWidth: 1,
    //     borderColor: '#D1D1D1',
    //     borderRadius: px2dp(16.5),
    //     width: SCREEN_WIDTH * .8,
    //     backgroundColor: '#EFEFEF',
    // },
    // searchTitle: {
    //     marginLeft: px2dp(9),
    //     fontSize: FONT_SIZE(14),
    //     color: '#898989',
    // },
    // searchText: {
    //     marginLeft: px2dp(15),
    //     fontSize: FONT_SIZE(14),
    //     color: '#898989',
    // },

    // 科室选择
    selectContent: {
        // position: 'relative',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: px2dp(50),
        backgroundColor: '#fff',
        borderBottomWidth: Pixel,
        borderBottomColor: '#dbdbdb',
    },
    selectBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(25),
        paddingRight: px2dp(15),
        height: px2dp(50),
    },
    selectText: {
        marginRight: px2dp(11),
        fontSize: FONT_SIZE(16),
        color: '#333',
    },
    searchImgBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: px2dp(73),
        height: px2dp(30),
        borderLeftWidth: Pixel,
        borderLeftColor: '#dbdbdb',
    },

    FlatListStyle: {
        flex: 1,
    },
    // 病历模块
    libraryBox: {
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        backgroundColor: '#fff',
    },
    libraryTitle: {
        fontSize: FONT_SIZE(18),
        color: '#333',
        lineHeight: px2dp(40),
        fontWeight: '600',
    },
    libraryImgBox: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        height: px2dp(81),
    },
    libraryImg: {
        width: px2dp(107),
        height: px2dp(81),
    },
    // 浏览量 和 收藏量
    starContent: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(30),
        marginTop: px2dp(6),
    },
    browseBox: {
        marginLeft: px2dp(10),
        flexDirection: 'row',
        alignItems: 'center',
    },
    browseText: {
        marginLeft: px2dp(5),
        fontSize: FONT_SIZE(12),
        color: '#898989',
    },

    starBox: {
        marginLeft: px2dp(10),
        flexDirection: 'row',
        alignItems: 'center',
    },
    starText: {
        marginLeft: px2dp(5),
        fontSize: FONT_SIZE(12),
        color: '#898989',
    },
    optionText: {
        paddingLeft: px2dp(15),
        paddingTop: px2dp(16),
        paddingBottom: px2dp(16),
        fontSize: FONT_SIZE(16),
        color: '#757575',
        // backgroundColor: '#fff',
    },
    MaskClick: {
        position: 'absolute',
        top: IOS ? IPhoneX ? px2dp(50) + 88 : px2dp(50) + 65 : px2dp(50) + 65 - StatusBarHeight,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    pickerContent: {
        flexDirection: 'row',
        height: px2dp(250),
        backgroundColor: '#f5f5f5',
        borderTopWidth: Pixel,
        borderTopColor: '#eee',
    },
    firstFlatList: {
        // flex: 1,
        width: SCREEN_WIDTH * .38,
        borderRightWidth: Pixel,
        borderRightColor: '#f5f5f5',
    },
    secondFlatList: {
        // flex: 1,
        width: SCREEN_WIDTH * .62,
        backgroundColor: '#fff',
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
    }
});
