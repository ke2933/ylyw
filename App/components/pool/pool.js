import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    FlatList,
    Animated,
    Easing,
    ScrollView,
    DeviceEventEmitter,
    BackHandler,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import CountDown from '../../common/CountDown';// 倒计时
import Toast, {DURATION} from 'react-native-easy-toast';
import px2dp from "../../common/Tool";
//弱提示


export default class pool extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            cityId: '',// 本省id
            cityName: '',// 本省名字
            fee: '会诊费',// 费用id
            hospitalId: '',// 医院id
            hospitalName: '选医院',
            medicalPoolBeanList: [],
            isRefresh: false,
            hospitalArr: [],
            feeArr: FeeNullArr,
            filterBox: false,//筛选模块
            areaFlag: true,// 展开true 收起false
            hospitalFlag: true,
            isLoading: true,
            deptId: '',
            feeActiveId: '',
            feeActiveName: '全部',
            selectFeeName: '全部',
            selectFeeId: '',
            cityActiveId: '',
            hospitalActiveId: '',
            hospitalActiveName: '全部',
            selectHospitalId: '',
            selectHospitalName: '全部',
            filterBoxRight: new Animated.Value(0),
            optionActiveBtnBox: {backgroundColor: '#7388d0'},
            optionActiveBtnText: {color: '#fff',},
            retractStyle: {maxHeight: px2dp(130), overflow: 'hidden'},
            cityBeanList: [],// 省份数组
            myAreaID: '',// 登录医生id
            myAreaName: '',
            areaActiveId: '',
            areaActiveName: '',
            selectAreaId: '',
            selectAreaName: '',
            oauthStatus: '',
            myFee: '',// 登录医生费用
            pageNo: '1',// 页码
            pageSize: '10',// 每页条数
            dataFlag: false,
            selectFlag: false,
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

    componentDidMount() {
        if (UserInfo.oauthStatus === '3') {
            // 已经认证
            // 获取登录医生信息
            fetch(requestUrl.baseInfo)
                .then((response) => response.json())
                .then((responseData) => {
                    console.log(responseData);
                    this.setState({
                        myAreaID: responseData.cityId,
                        myAreaName: responseData.cityName,
                        deptId: responseData.deptId,
                        areaActiveId: responseData.cityId,
                        areaActiveName: responseData.cityName,
                        selectAreaId: responseData.cityId,
                        selectAreaName: responseData.cityName,
                        myFee: responseData.fee,
                    });
                    this.selectCountry();
                    this.findDepartmentData(responseData.cityId);
                    this.queryMedicalPool();
                })
                .catch(
                    (error) => {
                        console.log('error', error);
                    });
        } else {
            // 未认证
            this.defaultSearchPool();
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
                         'title': '病历池',
                         'rightBtn': {
                             type: 'select',
                             click: this.rightBtn.bind(this),
                         }
                     }}/>
                {this.state.filterBox ? this.renderFilterBox() :
                    <View style={{flex: 1,}}>
                        <TouchableOpacity
                            onPress={() => {
                                if (UserInfo.oauthStatus === '0' || UserInfo.oauthStatus === '1') {
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
                                } else if (UserInfo.oauthStatus === '2') {
                                    // 审核中
                                    this.refs.toast.show('医师认证审核中，请在通过审核后继续查看');
                                } else if (UserInfo.oauthStatus === '3') {
                                    // 已经认证
                                    this.props.navigation.navigate('Search', {api: 'searchMedicalPool'})
                                } else if (UserInfo.oauthStatus === '4') {
                                    Alert.alert('', '系统维护中...')
                                } else if (UserInfo.oauthStatus === '5') {
                                    // 认证失败
                                    navigate('AttestationOne');
                                } else {
                                    Alert.alert('', '系统维护中...')
                                }


                            }}
                            activeOpacity={.8}
                        >
                            <View style={styles.searchContent}>
                                <View style={styles.searchBox}>
                                    <Image source={require('../../images/search_img.png')}/>
                                    <Text style={styles.searchTitle}>您可以输入医院 、医生、疾病</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        {UserInfo.oauthStatus === '3' ?
                            <FlatList
                                style={styles.pollFlatList}
                                data={this.state.medicalPoolBeanList}
                                initialNumToRender={20}
                                keyExtractor={item => item.id}
                                renderItem={({item}) => this.renderItem(item)}
                                onRefresh={() => {
                                    this.state.selectFlag ? this.firstScreenData(this.state.areaActiveId, this.state.hospitalActiveId, this.state.feeActiveId) : this.queryMedicalPool();
                                }}
                                ItemSeparatorComponent={() => {
                                    return (
                                        <View style={{
                                            // borderTopWidth: Pixel,
                                            // borderTopColor: '#dbdbdb',
                                            height: px2dp(6),
                                        }}></View>
                                    )
                                }}
                                refreshing={this.state.isRefresh}
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
                                style={styles.hospitalFlatList}
                                data={this.state.medicalPoolBeanList}
                                initialNumToRender={20}
                                keyExtractor={item => item.id}
                                renderItem={({item}) => this.renderItem(item)}
                                onRefresh={() => {
                                    this.setState({pageNo: '1'});
                                    this.defaultSearchPool();
                                }}
                                ItemSeparatorComponent={() => {
                                    return (
                                        <View style={{
                                            // borderTopWidth: Pixel,
                                            // borderTopColor: '#dbdbdb',
                                            height: px2dp(6),
                                        }}></View>
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
                    </View>}

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

    renderFilterBox() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({filterBox: false})
                }}
                style={styles.filterClick}
            >
                <TouchableOpacity
                    onPress={() => {
                    }}
                    activeOpacity={1}
                >
                    <Animated.View style={[styles.filterContainer, {right: this.state.filterBoxRight}]}>
                        <ScrollView>
                            <View style={styles.moduleContent}>
                                <View style={styles.fixedBox}>
                                    <View style={styles.fixedBoxItem}>
                                        <Text style={styles.fixedTitle}>选择地区</Text>
                                        <Text style={styles.fixedText}>{this.state.areaActiveName}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                areaFlag: !this.state.areaFlag,
                                            })
                                        }}
                                        activeOpacity={.8}
                                    >
                                        <View style={[styles.fixedBoxItem, styles.fixedBtnBox]}>
                                            <Text style={styles.fixedBtnText}>{this.state.areaFlag ? '展开' : '收起'}</Text>
                                            <Image
                                                source={this.state.areaFlag ? require('../../images/arrow_gray_right.png') : require('../../images/dropdown_arrow.png')}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={[styles.optionBtnContent, this.state.areaFlag ? this.state.retractStyle : null]}>
                                    {this.areaRender()}
                                </View>
                            </View>
                            <View style={styles.moduleContent}>
                                <View style={styles.fixedBox}>
                                    <View style={styles.fixedBoxItem}>
                                        <Text style={styles.fixedTitle}>选择诊费</Text>
                                        <Text style={styles.fixedText}>{this.state.feeActiveName}</Text>
                                    </View>

                                </View>
                                <View
                                    style={[styles.optionBtnContent, this.state.deptFlag ? this.state.retractStyle : null]}>
                                    {this.feeRender()}
                                </View>
                            </View>
                            <View style={styles.moduleContent}>
                                <View style={styles.fixedBox}>
                                    <View style={styles.fixedBoxItem}>
                                        <Text style={styles.fixedTitle}>选择医院</Text>
                                        <Text numberOfLines={1}
                                              style={styles.fixedText}>{this.state.hospitalActiveName}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                hospitalFlag: !this.state.hospitalFlag,
                                            })
                                        }}
                                        activeOpacity={.8}
                                    >
                                        <View style={[styles.fixedBoxItem, styles.fixedBtnBox]}>
                                            <Text
                                                style={styles.fixedBtnText}>{this.state.hospitalFlag ? '展开' : '收起'}</Text>
                                            <Image
                                                source={this.state.hospitalFlag ? require('../../images/arrow_gray_right.png') : require('../../images/dropdown_arrow.png')}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={[styles.optionBtnContent, this.state.hospitalFlag ? this.state.retractStyle : null]}>
                                    {this.hospitalRender()}
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        filterBox: false,
                                        selectFlag: true,
                                        selectFeeId: this.state.feeActiveId,
                                        selectFeeName: this.state.feeActiveName,
                                        selectAreaId: this.state.areaActiveId,
                                        selectAreaName: this.state.areaActiveName,
                                        selectHospitalId: this.state.hospitalActiveId,
                                        selectHospitalName: this.state.hospitalActiveName,
                                    });
                                    this.firstScreenData(this.state.areaActiveId, this.state.hospitalActiveId, this.state.feeActiveId);
                                }}
                                activeOpacity={.8}
                            >
                                <View style={styles.DetermineBtn}>
                                    <Text style={styles.DetermineText}>确定</Text>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </Animated.View>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    renderItem = (item) => {
        const {navigate, goBack} = this.props.navigation;
        return (
            <TouchableOpacity
                key={item.id}
                onPress={() => {
                    if (UserInfo.oauthStatus === '0' || UserInfo.oauthStatus === '1') {
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
                    } else if (UserInfo.oauthStatus === '2') {
                        // 审核中
                        this.refs.toast.show('医师认证审核中，请在通过审核后继续查看');
                    } else if (UserInfo.oauthStatus === '3') {
                        // 已经认证
                        navigate('CaseHistoryInfo', {data: item})
                    } else if (UserInfo.oauthStatus === '4') {
                        Alert.alert('', '系统维护中...')
                    } else if (UserInfo.oauthStatus === '5') {
                        // 认证失败
                        navigate('AttestationOne');
                    } else {
                        Alert.alert('', '系统维护中...')
                    }
                }}
                activeOpacity={.8}
            >
                <View style={styles.caseHistoryItem}>
                    <View style={styles.statusBox}>
                        <Text style={styles.statusText}>{item.consultationStatus}</Text>
                    </View>
                    <View style={styles.topBox}>
                        <Text style={styles.caseHistoryTitle}>{item.illnessName}</Text>
                        <Text
                            style={styles.caseHistoryInfo}>首诊：{item.doctorName}－{item.doctorTitle}－{item.hospitalName}</Text>
                        <Text numberOfLines={3} style={styles.caseHistoryText}>会诊目的：{item.consultationReason}</Text>
                    </View>

                    <View style={styles.bottomBox}>
                        <View style={styles.bottomLeftBox}>
                            <Text style={styles.caseHistoryPrice}>¥{item.fee}</Text>
                            <Text style={styles.caseHistoryDate}>还剩 <CountDown style={{color: '#333', fontSize: 16,}}
                                                                               duration={item.duration}
                                                                               beginTime={item.startTime}/></Text>
                        </View>
                        <Image source={require('../../images/arrow_gray_right.png')}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

// 地区按钮
    areaRender() {
        let arr = this.state.cityBeanList;
        let temp = [];
        for (let i = 0; i < arr.length; i++) {
            temp.push(
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            areaActiveId: arr[i].id,
                            areaActiveName: arr[i].cityName,
                            hospitalActiveName: '全部',
                            hospitalActiveId: '',
                        });
                        this.findDepartmentData(arr[i].id);
                    }}
                    key={i}
                    activeOpacity={.8}
                >
                    <View
                        style={[styles.optionBtn, this.state.areaActiveId === arr[i].id ? this.state.optionActiveBtnBox : null]}>
                        <Text
                            style={[styles.optionText, this.state.areaActiveId === arr[i].id ? this.state.optionActiveBtnText : null]}>{arr[i].cityName}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        return temp;
    }

    // 费用按钮
    feeRender() {
        let arr = this.state.feeArr;
        let temp = [];
        for (let i = 0; i < arr.length; i++) {
            temp.push(
                <TouchableOpacity
                    onPress={() => {
                        if (this.state.myFee * 1 >= arr[i].id * 1) {
                            this.setState({
                                feeActiveId: arr[i].id,
                                feeActiveName: arr[i].fee,
                            });
                        }
                    }}
                    key={i}
                    activeOpacity={.8}
                >
                    <View
                        style={[styles.optionBtn, this.state.feeActiveId === arr[i].id ? this.state.optionActiveBtnBox : null]}>
                        <Text
                            style={[styles.optionText, {color: this.state.myFee * 1 >= arr[i].id * 1 ? '#424242' : '#dbdbdb'}, this.state.feeActiveId === arr[i].id ? this.state.optionActiveBtnText : null,]}>{arr[i].fee}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        return temp;
    }

// 医院按钮
    hospitalRender() {
        let arr = this.state.hospitalArr;
        if (arr.length > 0) {
            let temp = [];
            for (let i = 0; i < arr.length; i++) {
                temp.push(
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                hospitalActiveId: arr[i].id,
                                hospitalActiveName: arr[i].hospitalName,
                            });
                        }}
                        key={i}
                        activeOpacity={.8}
                    >
                        <View
                            style={[styles.optionBtn, this.state.hospitalActiveId === arr[i].id ? this.state.optionActiveBtnBox : null]}>
                            <Text
                                style={[styles.optionText, this.state.hospitalActiveId === arr[i].id ? this.state.optionActiveBtnText : null]}>{arr[i].hospitalName}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
            return temp;

        } else {
            return (
                <View style={{flex: 1, alignItems: 'center', marginTop: px2dp(25)}}>
                    <Text style={{fontSize: FONT_SIZE(14), color: '#757575',}}>*未筛选到有会诊请求的医院*</Text>
                </View>
            )
        }
    }


    // 获取全国
    selectCountry() {
        fetch(requestUrl.selectCountry)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({
                    country: responseData,
                });
                //获取有医院的省份
                fetch(requestUrl.selectCityByPool)
                    .then((response) => response.json())
                    .then((responseData) => {
                        console.log(responseData);
                        responseData.cityBeanList.map((item, index) => {
                            if (item.id === this.state.myAreaID) {
                                responseData.cityBeanList.splice(index, 1);
                            }
                        });
                        responseData.cityBeanList.unshift(this.state.country);
                        responseData.cityBeanList.unshift({
                            'id': this.state.myAreaID,
                            'cityName': this.state.myAreaName
                        });
                        this.setState({
                            cityBeanList: responseData.cityBeanList,
                        });

                    })
                    .catch(
                        (error) => {
                            console.log('error', error);
                        });
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
    }

    // 获取医院列表
    findDepartmentData(cityId) {
        let formData = new FormData();
        formData.append("cityId", cityId);
        console.log(formData);
        fetch(requestUrl.selectPoolHospitalByCity, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.cityHospitalBeanList.length > 0) {
                    responseData.cityHospitalBeanList.unshift({'id': '', 'hospitalName': '全部'});
                    this.setState({
                        hospitalArr: responseData.cityHospitalBeanList,
                    })
                } else {
                    this.setState({
                        hospitalArr: [],
                    })
                }
            })
            .catch(
                (error) => {
                    console.log(error);
                    this.setState({isLoading: false, hospitalArr: []})

                });
    }

    // 首次加载接口
    queryMedicalPool() {
        let formData = new FormData();
        formData.append("cityId", UserInfo.cityId);
        formData.append("fee", UserInfo.fee);
        console.log(formData);
        fetch(requestUrl.queryMedicalPool, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                setTimeout(() => {
                    this.setState({isLoading: false,});
                }, 500);
                this.setState({
                    medicalPoolBeanList: [],
                });
                console.log(responseData);
                if (responseData.status === '0') {
                    this.setState({
                        medicalPoolBeanList: responseData.medicalPoolBeanList,
                    })
                }

            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                    console.log('error', error);
                });
    }

// 筛选接口
    firstScreenData(cityId, hospitalId, feeId) {
        let formData = new FormData();
        formData.append("cityId", cityId);
        if (hospitalId) {
            formData.append("hospitalId", hospitalId);
        }
        if (feeId) {
            formData.append("fee", feeId);
        } else {
            formData.append("fee", this.state.myFee);
        }
        console.log(formData);
        fetch(requestUrl.screenMedicalPool, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                setTimeout(() => {
                    this.setState({
                        isLoading: false,
                    });
                }, 500);
                this.setState({
                    medicalPoolBeanList: [],
                });
                console.log(responseData);
                if (responseData.status === '0') {
                    this.setState({
                        medicalPoolBeanList: responseData.medicalPoolBeanList,
                    })
                }

            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                    console.log('error', error);
                });
    }


    rightBtn() {
        if (UserInfo.oauthStatus === '0' || UserInfo.oauthStatus === '1') {
            // 未认证 认证完成第一步
            Alert.alert('', '您选择的项目涉及医师会诊服务，考虑到医学严谨性，您需要先进行医师认证并通过审核', [
                {
                    text: '暂不认证', onPress: () => {
                    }
                },
                {
                    text: '立即认证', onPress: () => {
                        this.props.navigation.navigate('AttestationOne');
                    }
                },
            ]);
        } else if (UserInfo.oauthStatus === '2') {
            // 审核中
            this.refs.toast.show('医师认证审核中，请在通过审核后继续查看');
        } else if (UserInfo.oauthStatus === '3') {
            // 已经认证
            this.setState({
                filterBox: !this.state.filterBox,
                feeActiveId: this.state.selectFeeId,
                feeActiveName: this.state.selectFeeName,
                areaActiveId: this.state.selectAreaId,
                areaActiveName: this.state.selectAreaName,
                hospitalActiveId: this.state.selectHospitalId,
                hospitalActiveName: this.state.selectHospitalName,
            });
            this.findDepartmentData(this.state.areaActiveId);
            this.state.filterBoxRight.setValue(-SCREEN_WIDTH * .93);
            Animated.timing(this.state.filterBoxRight, {
                toValue: 0,
                duration: 300,
                easing: Easing.linear,// 线性的渐变函数
            }).start();
        } else if (UserInfo.oauthStatus === '4') {
            Alert.alert('', '系统维护中...')
        } else if (UserInfo.oauthStatus === '5') {
            // 认证失败
            this.props.navigation.navigate('AttestationOne');
        } else {
            Alert.alert('', '系统维护中...')
        }


    }

    // 未认证数据分页判断
    onEndReached() {
        if (this.state.dataFlag) {
            let temp = this.state.pageNo * 1 + 1 + '';
            this.setState({
                pageNo: temp,
            });
            this.defaultSearchPoolMore(temp);
        }
    }

    // 未认证查询首页接口
    defaultSearchPool() {
        let formData = new FormData();
        formData.append("pageNo", '1');
        formData.append("pageSize", this.state.pageSize);
        fetch(requestUrl.defaultSearchPool, {
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
                    if (responseData.medicalPoolBeanList.length >= this.state.pageSize) {
                        this.setState({
                            medicalPoolBeanList: responseData.medicalPoolBeanList,
                            dataFlag: true,
                        });
                    } else {
                        this.setState({
                            medicalPoolBeanList: responseData.medicalPoolBeanList,
                            dataFlag: false,
                        });
                    }
                } else {
                    this.setState({
                        medicalPoolBeanList: [],
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
    defaultSearchPoolMore(pageNo) {
        let formData = new FormData();
        formData.append("pageNo", pageNo);
        formData.append("pageSize", this.state.pageSize);
        fetch(requestUrl.defaultSearchPool, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.medicalPoolBeanList.length >= this.state.pageSize) {
                    let temp = this.state.medicalPoolBeanList;
                    temp = temp.concat(responseData.medicalPoolBeanList);
                    this.setState({
                        medicalPoolBeanList: temp,
                        dataFlag: true,
                        isRefresh: false,
                    })
                } else {
                    let temp = this.state.medicalPoolBeanList;
                    temp = temp.concat(responseData.medicalPoolBeanList);
                    this.setState({
                        medicalPoolBeanList: temp,
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
    pollFlatList: {
        flex: 1,
    },
    caseHistoryItem: {
        flex: 1,
        marginLeft: px2dp(8),
        marginRight: px2dp(8),
        borderRadius: px2dp(10),
        backgroundColor: '#fff',
        borderColor: '#e6e6e6',
        borderWidth: Pixel,
    },
    statusBox: {
        position: 'absolute',
        top: px2dp(9),
        right: 0,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(89),
        height: px2dp(30),
        backgroundColor: '#fff',
        borderColor: '#e6e6e6',
        borderTopWidth: Pixel,
        borderLeftWidth: Pixel,
        borderBottomWidth: Pixel,
        borderTopLeftRadius: px2dp(10),
        borderBottomLeftRadius: px2dp(10),
    },
    statusText: {
        fontSize: FONT_SIZE(13),
        color: '#566CB7',
    },
    topBox: {
        paddingLeft: px2dp(13),
        paddingRight: px2dp(13),
    },
    caseHistoryTitle: {
        marginTop: px2dp(20),
        fontSize: FONT_SIZE(19),
        color: '#333333',
    },
    caseHistoryInfo: {
        marginTop: px2dp(5),
        fontSize: FONT_SIZE(14),
        color: '#676767',
        lineHeight: px2dp(20),
    },
    caseHistoryText: {
        marginTop: px2dp(8),
        marginBottom: px2dp(10),
        fontSize: FONT_SIZE(14),
        color: '#333333',
        lineHeight: px2dp(20),
    },
    bottomBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: px2dp(52),
        borderTopColor: '#eeeeee',
        borderTopWidth: Pixel,
        paddingLeft: px2dp(13),
        paddingRight: px2dp(13),
    },
    bottomLeftBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    caseHistoryPrice: {
        fontSize: FONT_SIZE(19),
        color: '#333333',
    },
    caseHistoryDate: {
        marginLeft: px2dp(13),
        fontSize: FONT_SIZE(14),
        color: '#333333',
    },
    caseHistoryCheckBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: px2dp(70),
        width: px2dp(91),
        height: px2dp(41),
        backgroundColor: '#f08058',
        borderRadius: px2dp(10),
    },
    caseHistoryCheckText: {
        fontSize: FONT_SIZE(16),
        color: '#FFFEFE',
    },
    selectedBox: {
        height: px2dp(100),
    },

    // 搜索行
    searchContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: px2dp(50),
        // backgroundColor: '#fff',
        // marginBottom: px2dp(6),
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        height: px2dp(33),
        // borderWidth: Pixel,
        // borderColor: '#D1D1D1',
        paddingLeft: px2dp(15),
        borderRadius: px2dp(16.5),
        width: SCREEN_WIDTH * .92,
        backgroundColor: '#fff',
    },
    searchTitle: {
        marginLeft: px2dp(9),
        fontSize: FONT_SIZE(14),
        color: '#9e9e9e',
    },
    selectText: {
        color: '#757575',
        fontSize: FONT_SIZE(16),
        paddingRight: px2dp(10),
    },
    // 选择按钮
    selectBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(85),
        height: px2dp(31),
        borderWidth: Pixel,
        borderColor: '#898989',
        borderRadius: px2dp(5),
    },
    slecetBtnText: {
        fontSize: FONT_SIZE(16),
        color: '#333',
    },
    filterClick: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.2)',
        alignItems: 'flex-end',
    },
    filterContainer: {
        position: 'relative',
        top: 0,
        right: -100,
        flex: 1,
        width: SCREEN_WIDTH * .93,
        paddingTop: px2dp(15),
        backgroundColor: '#fff',
    },
    moduleContent: {
        paddingLeft: px2dp(25),
    },
    // 固定Box
    fixedBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: px2dp(35),
        borderBottomWidth: Pixel,
        borderColor: '#DBDBDB',
    },
    fixedBoxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(35),
    },
    fixedBtnBox: {
        paddingRight: px2dp(19),
        paddingLeft: px2dp(10),
    },
    fixedTitle: {
        marginRight: px2dp(16),
        fontSize: FONT_SIZE(16),
        color: Colors.color,
    },
    fixedText: {
        width: px2dp(150),
        fontSize: FONT_SIZE(14),
        color: '#9e9e9e',
    },
    fixedBtnText: {
        marginRight: px2dp(16),
        fontSize: FONT_SIZE(14),
        color: '#9E9E9E',
    },
    // 默认模块
    // defaultBox: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     height: px2dp(45),
    //     borderBottomWidth: Pixel,
    //     borderColor: '#DBDBDB',
    // },
    // defaultText: {
    //     fontSize: FONT_SIZE(14),
    //     color: '#9E9E9E',
    // },
    myOptionBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: px2dp(30),
        paddingLeft: px2dp(30),
        paddingRight: px2dp(30),
        borderWidth: Pixel,
        borderColor: '#DBDBDB',
        borderRadius: px2dp(15),
    },
    optionBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: px2dp(30),
        paddingLeft: px2dp(25),
        paddingRight: px2dp(25),
        borderWidth: Pixel,
        borderColor: '#DBDBDB',
        borderRadius: px2dp(15),
        marginTop: px2dp(10),
        marginRight: px2dp(15),
    },
    myOptionText: {
        fontSize: FONT_SIZE(14),
        color: '#757575',
    },
    optionText: {
        fontSize: FONT_SIZE(14),
        color: '#424242',
    },
    optionBtnContent: {
        position: 'relative',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: px2dp(5),
        paddingRight: px2dp(5),
        marginBottom: px2dp(20),
        backgroundColor: 'transparent',
    },
    // 确定按钮
    DetermineBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: px2dp(50),
        backgroundColor: '#f5f5f5',
    },
    DetermineText: {
        fontSize: FONT_SIZE(16),
        color: Colors.color,
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
