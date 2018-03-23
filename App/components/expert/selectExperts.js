import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    StatusBar,
    Animated,
    Easing,
    ScrollView,
    TextInput,
    BackHandler,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import px2dp from "../../common/Tool";

export default class SelectDoctor extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            departmentDetail: '',// 科室描述
            departmentId: '',// 科室id
            hospitalId: '',// 医院id
            hospitalLable: '',// 医院表签
            departmentLable: '',// 科室标签
            areaLable: '',// 地区标签
            hospitalName: '',
            myAreaID: '',// 登录医生id
            doctorArr: [],
            titleArr: [],// 职称列表
            feeArr: FeeNullArr,
            isLoading: false,
            pageNo: '1',
            pageSize: '10',
            isRefresh: false,
            selected: false,
            filterBoxRight: new Animated.Value(0),
            optionActiveBtnBox: {backgroundColor: '#7388d0'},
            optionActiveBtnText: {color: '#fff',},
            retractStyle: {maxHeight: px2dp(130), overflow: 'hidden'},
            filterBox: false,//筛选模块
            areaFlag: false,// 展开true 收起false
            deptFlag: false,
            titleActiveId: '',
            titleActiveName: '全部',
            selectTitleId: '',
            selectTitleName: '全部',
            feeActiveId: '',
            feeActiveName: '全部',
            selectFeeId: '',
            selectFeeName: '全部',
            myAreaName: '',
            deptId: '',
            deptName: '',
            clearBtn: false,
            searchText: '',
        }
    }


    componentWillMount() {
       NetWork ? null : Alert.alert('网络似乎断掉了'), this.setState({isLoading: false});RouteName.push(this.props.navigation.state);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }
        if (this.props.navigation.state.params) {
            // if (this.props.navigation.state.params.hospitalData) {
            let data = this.props.navigation.state.params.data;
            console.log(data)
            let hospitalData = this.props.navigation.state.params.hospitalData;
            this.setState({
                hospitalId: hospitalData.hospitalId,
                hospitalLable: hospitalData.hospitalLable,
                hospitalName: hospitalData.hospitalName,
                areaLable: hospitalData.areaLable,
                departmentDetail: hospitalData.departmentDetail,
                departmentId: data.departmentId,
                deptId: data.departmentId,
            })
            // } else {
            //     let data = this.props.navigation.state.params.data;
            //     this.setState({
            //         selected: true,
            //         hospitalId: data.hospitalId,
            //         hospitalName: data.hospitalName,
            //         departmentId: data.departmentId,
            //         areaId: data.areaId,
            //         fee: data.feeId,
            //         thisareaID: data.thisareaID,
            //     })
            // }

        }
    }


    componentDidMount() {
        //  职称选择列表接口
        fetch(requestUrl.title)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '0') {
                    responseData.lists.unshift({'doctorTitleName': '全部', 'id': ''});
                    this.setState({
                        titleArr: responseData.lists,
                    })
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
        this.fetchData();
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
                         'title': this.state.hospitalName,
                         'rightBtn': {
                             type: 'select',
                             click: this.rightBtn.bind(this),
                         }
                     }}/>
                <TouchableOpacity
                    onPress={() => {
                        navigate('Synopsis', {data: this.state.departmentDetail});
                    }}
                    activeOpacity={.8}
                >
                    <View style={styles.synopsisBox}>
                        <Text numberOfLines={1} style={styles.synopsisLeftText}>
                            {this.state.departmentDetail}
                        </Text>
                        <Text style={styles.synopsisRightText}>点击更多</Text>
                    </View>
                </TouchableOpacity>

                {this.state.filterBox ? this.renderFilterBox() :
                    <View style={{flex: 1,}}>
                        <View style={styles.searchBox}>
                            <Image style={styles.searchImg} source={require('../../images/search_img.png')}/>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'搜索医生'}
                                placeholderTextColor={'#bebebe'}
                                onChangeText={(text) => {
                                    if (text.length > 0) {
                                        this.setState({
                                            clearBtn: true,
                                            searchText: text
                                        });
                                        this.findDoctorStr(text);
                                    } else {
                                        this.setState({
                                            clearBtn: false,
                                            searchText: text,
                                        });
                                        this.fetchData();
                                    }
                                }}
                                defaultValue={this.state.searchText}
                                underlineColorAndroid={'transparent'}
                                keyboardType={"default"}
                                enablesReturnKeyAutomatically={true}//ios禁止空确认
                            >
                            </TextInput>
                            {this.state.clearBtn ?
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            searchText: '',
                                            clearBtn: false,
                                        });
                                        this.fetchData();
                                    }}
                                    activeOpacity={.8}
                                    style={styles.clearTextClick}
                                >
                                    <Image source={require('../../images/input_clear.png')}/>
                                </TouchableOpacity>
                                : null}
                        </View>
                        <FlatList
                            style={styles.FlatListStyle}
                            data={this.state.doctorArr}
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
                            ItemSeparatorComponent={() => {
                                return (
                                    <View style={{height: Pixel, backgroundColor: '#efefef'}}></View>
                                )
                            }}
                            onRefresh={() => {
                                this.state.searchText.length > 0 ? this.findDoctorStr(this.state.searchText) : this.fetchData();
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
                        />
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

    rightBtn() {
        this.setState({
            filterBox: !this.state.filterBox,
            titleActiveId: this.state.selectTitleId,
            titleActiveName: this.state.selectTitleName,
            feeActiveId: this.state.selectFeeId,
            feeActiveName: this.state.selectFeeName,
        });
        this.state.filterBoxRight.setValue(-SCREEN_WIDTH * .93);
        Animated.timing(this.state.filterBoxRight, {
            toValue: 0,
            duration: 300,
            easing: Easing.linear,// 线性的渐变函数
        }).start();
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
                                        <Text style={styles.fixedTitle}>选择职称</Text>
                                        <Text style={styles.fixedText}>{this.state.titleActiveName}</Text>
                                    </View>
                                </View>
                                <View
                                    style={[styles.optionBtnContent, this.state.areaFlag ? this.state.retractStyle : null]}>
                                    {this.titleRender()}
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
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        filterBox: false,
                                        searchText: '',
                                        clearBtn: false,
                                        selectTitleId: this.state.titleActiveId,
                                        selectTitleName: this.state.titleActiveName,
                                        selectFeeId: this.state.feeActiveId,
                                        selectFeeName: this.state.feeActiveName,
                                    });
                                    this.fetchData();
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

    // 职称循环
    titleRender() {
        let arr = this.state.titleArr;
        let temp = [];
        for (let i = 0; i < arr.length; i++) {
            temp.push(
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            titleActiveId: arr[i].id,
                            titleActiveName: arr[i].doctorTitleName,
                        });
                    }}
                    key={i}
                    activeOpacity={.8}
                >
                    <View
                        style={[styles.optionBtn, this.state.titleActiveId === arr[i].id ? this.state.optionActiveBtnBox : null]}>
                        <Text
                            style={[styles.optionText, this.state.titleActiveId === arr[i].id ? this.state.optionActiveBtnText : null]}>{arr[i].doctorTitleName}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        return temp;
    }

    feeRender() {
        let arr = this.state.feeArr;
        let temp = [];
        for (let i = 0; i < arr.length; i++) {
            temp.push(
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            feeActiveId: arr[i].id,
                            feeActiveName: arr[i].fee,
                        });
                    }}
                    key={i}
                    activeOpacity={.8}
                >
                    <View
                        style={[styles.optionBtn, this.state.feeActiveId === arr[i].id ? this.state.optionActiveBtnBox : null]}>
                        <Text
                            style={[styles.optionText, this.state.feeActiveId === arr[i].id ? this.state.optionActiveBtnText : null]}>{arr[i].fee}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        return temp;
    }

    renderItem = (item) => {
        const {navigate} = this.props.navigation;
        let areaLable = [];
        if (item.areaLable === this.state.myAreaID) {
            areaLable.push(
                <View key={item.id} style={styles.areaLableBox}>
                    <Text style={styles.areaLableText}>本省</Text>
                </View>
            );
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    if (item.liabilityArea) {
                        if (item.liabilityArea === UserInfo.countryId) {
                            navigate('ExpertsInfo', {data: this.state, doctorData: item})
                        } else if (item.liabilityArea === UserInfo.cityId) {
                            navigate('ExpertsInfo', {data: this.state, doctorData: item})
                        } else {
                            Alert.alert('该医生只为本省提供会诊服务');
                        }
                    } else {
                        Alert.alert('该医生不提供会诊服务')
                    }
                }}
                activeOpacity={.8}
            >
                <View style={styles.doctorItem}>
                    <View style={styles.doctorItemTop}>
                        <View style={styles.portraitBox}>
                            <Image style={styles.portraitImg} source={{uri: requestUrl.ImgIp + item.pictureUrl}}/>
                            {areaLable}
                        </View>
                        <View style={styles.userInfo}>
                            <View style={styles.basicInfo}>
                                <Text style={styles.doctorName}>{item.doctorName}</Text>
                                <Text style={styles.departmentName}>{item.departmentName}</Text>
                                <Text style={styles.titleName}>{item.titleName}</Text>
                            </View>
                            <Text style={styles.hospitalName}>{item.hospitalName}</Text>
                            <Text numberOfLines={2} style={styles.beGood}>{item.beGood}</Text>
                        </View>
                    </View>
                    <View style={styles.doctorItemBottom}>
                        <View style={styles.hospitalLableContent}>
                            {item.hospitalLable > 0 ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>顶级医院</Text>
                            </View> : null}
                            {item.hospitalLable === '0' ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>知名医院</Text>
                            </View> : null}
                            {item.hospitalType ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>{item.hospitalType}</Text>
                            </View> : null}
                            {item.departmentLable > 0 ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>顶级科室</Text>
                            </View> : null}
                            {item.departmentLable === '0' ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>知名科室</Text>
                            </View> : null}
                        </View>
                        <Text style={styles.fee}>¥{item.doctorConsultationFee}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    onEndReached() {
        if (this.state.dataFlag) {
            this.state.searchText !== '' ? this.findDoctorStrMore(this.state.pageNo * 1 + 1 + '') : this.fetchDataMore(this.state.pageNo * 1 + 1 + '');
            this.setState({
                pageNo: this.state.pageNo * 1 + 1 + '',
            });

        }
    }

    fetchData() {
        this.setState({pageNo: '1'});
        let formData = new FormData();
        formData.append("hospitalId", this.state.hospitalId);
        formData.append("departmentId", this.state.departmentId);
        formData.append("titleId", this.state.titleActiveId);
        formData.append("fee", this.state.feeActiveId);
        formData.append("pageNo", '1');
        formData.append("pageSize", this.state.pageSize);
        console.log(formData);
        fetch(requestUrl.findDoctor, {
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
                    if (responseData.doctorBeans.length >= this.state.pageSize) {
                        this.setState({
                            doctorArr: responseData.doctorBeans,
                            dataFlag: true,
                            myAreaID: responseData.thisCity,
                        })
                    } else {
                        this.setState({
                            doctorArr: responseData.doctorBeans,
                            dataFlag: false,
                            myAreaID: responseData.thisCity,
                        })
                    }
                } else {
                    this.setState({
                        doctorArr: [],
                        dataFlag: false,
                    })
                }
            })
            .catch(
                (error) => {
                    console.log(error);
                    this.setState({isLoading: false});
                    this.refs.toast.show('加载数据失败');
                });
    }

    fetchDataMore(pageNo) {
        // this.setState({isLoading: true});
        let formData = new FormData();
        formData.append("hospitalId", this.state.hospitalId);
        formData.append("departmentId", this.state.departmentId);
        formData.append("titleId", this.state.titleActiveId);
        formData.append("fee", this.state.feeActiveId);
        formData.append("pageNo", pageNo);
        formData.append("pageSize", this.state.pageSize);
        console.log(formData)
        fetch(requestUrl.findDoctor, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData)
                this.setState({isLoading: false,});
                if (responseData.status === '0') {
                    if (responseData.doctorBeans.length >= this.state.pageSize) {
                        let temp = this.state.doctorArr;
                        temp = temp.concat(responseData.doctorBeans);
                        this.setState({
                            doctorArr: temp,
                            dataFlag: true,
                            isRefresh: false,
                        })
                    } else {
                        let temp = this.state.doctorArr;
                        temp = temp.concat(responseData.doctorBeans);
                        this.setState({
                            doctorArr: temp,
                            dataFlag: false,
                            isRefresh: false,
                        })
                    }
                } else {
                    this.refs.toast.show('未搜到相关内容');
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                });
    }

    findDoctorStr(str) {
        this.setState({pageNo: '1'});
        let formData = new FormData();
        formData.append("hospitalId", this.state.hospitalId);
        formData.append("deptId", this.state.deptId);
        formData.append("str", str);
        formData.append("pageNo", '1');
        formData.append("pageSize", this.state.pageSize);
        console.log(formData);
        fetch(requestUrl.searchDoctor, {
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
                    if (responseData.doctorBeanList.length >= this.state.pageSize) {
                        this.setState({
                            doctorArr: responseData.doctorBeanList,
                            dataFlag: true,
                        })
                    } else {
                        this.setState({
                            doctorArr: responseData.doctorBeanList,
                            dataFlag: false,
                        })
                    }
                } else {
                    this.setState({
                        doctorArr: [],
                        dataFlag: false,
                        isRefresh: false,
                    })
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false});
                    this.refs.toast.show('加载数据失败');
                });
    }

    //
    findDoctorStrMore(pageNo) {
        // this.setState({isLoading: true});
        let formData = new FormData();
        formData.append("hospitalId", this.state.hospitalId);
        formData.append("deptId", this.state.deptId);
        formData.append("str", this.state.searchText);
        formData.append("pageNo", pageNo);
        formData.append("pageSize", this.state.pageSize);
        console.log(formData);
        fetch(requestUrl.searchDoctor, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({isLoading: false,});
                if (responseData.status === '0') {
                    if (responseData.doctorBeanList.length >= this.state.pageSize) {
                        let temp = this.state.doctorArr;
                        temp = temp.concat(responseData.doctorBeanList);
                        this.setState({
                            doctorArr: temp,
                            dataFlag: true,
                            isRefresh: false,
                        })
                    } else {
                        let temp = this.state.doctorArr;
                        temp = temp.concat(responseData.doctorBeanList);
                        this.setState({
                            doctorArr: temp,
                            dataFlag: false,
                            isRefresh: false,
                        })
                    }
                } else {
                    this.setState({
                        doctorArr: [],
                        dataFlag: false,
                        isRefresh: false,
                    })
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false});
                    this.refs.toast.show('加载数据失败');
                });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    synopsisBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: px2dp(35),
        backgroundColor: Colors.color,
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
    },
    synopsisLeftText: {
        // width: px2dp(285),
        flex: 1,
        fontSize: FONT_SIZE(14),
        color: '#fff',
    },
    synopsisRightText: {
        // width: px2dp(60),
        // flex: 1,
        // width: 'auto',
        paddingLeft: 5,
        fontSize: FONT_SIZE(14),
        color: '#fff',
    },

    // // 不选择医生
    // noDoctorBox: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'space-between',
    //     height: 41,
    //     marginTop: 5,
    //     marginBottom: 9,
    //     paddingLeft: 20,
    //     paddingRight: 20,
    //     backgroundColor: '#fff',
    // },
    // noDoctorText: {
    //     fontSize: 16,
    //     color: '#333',
    // },
    // FlatListStyle: {
    //     marginTop: 6,
    // },
    // 医生模块
    doctorItem: {
        marginBottom: px2dp(6),
        backgroundColor: '#fff',
    },
    doctorItemTop: {
        flexDirection: 'row',
        paddingTop: px2dp(8),
        paddingLeft: px2dp(12),
        paddingRight: px2dp(20),
        borderBottomColor: '#d6e1e8',
        borderBottomWidth: Pixel,
    },
    // 头像
    portraitBox: {
        marginRight: px2dp(12),
        marginBottom: px2dp(12),
        width: px2dp(50),
        alignItems: 'center',
    },
    portraitImg: {
        marginBottom: px2dp(9),
        width: px2dp(50),
        height: px2dp(50),
        borderRadius: px2dp(25),
    },
    areaLableBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(38),
        height: px2dp(18),
        backgroundColor: '#f08058',
        borderRadius: px2dp(9),
    },
    areaLableText: {
        fontSize: FONT_SIZE(11),
        color: '#fff',
    },
    // 信息
    userInfo: {
        flex: 1,
    },
    basicInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(18),
    },
    doctorName: {
        marginRight: px2dp(8),
        fontSize: FONT_SIZE(19),
        color: '#333333',
    },
    departmentName: {
        marginRight: px2dp(10),
        fontSize: FONT_SIZE(14),
        color: '#333',
    },
    titleName: {
        fontSize: FONT_SIZE(14),
        color: '#333',
    },
    hospitalName: {
        fontSize: FONT_SIZE(14),
        lineHeight: px2dp(25),
        color: '#333',
    },
    beGood: {
        fontSize: FONT_SIZE(14),
        color: '#898989',
        lineHeight: px2dp(20),
    },

    doctorItemBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: px2dp(50),
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
    },
    hospitalLableContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hospitalLabelBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: px2dp(5),
        // width: px2dp(68),
        height: px2dp(25),
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        borderRadius: px2dp(5),
        borderWidth: Pixel,
        borderColor: '#566cb7',
    },
    hospitalLabelText: {
        fontSize: FONT_SIZE(13),
        color: '#566CB7',
    },
    fee: {
        fontSize: FONT_SIZE(14),
        color: '#333',
    },

    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: px2dp(8),
        marginBottom: px2dp(8),
        height: px2dp(33),
        borderRadius: px2dp(16.5),
        backgroundColor: '#fff',
        width: SCREEN_WIDTH * .92,
        marginLeft: SCREEN_WIDTH * .04,
    },
    searchImg: {
        marginLeft: px2dp(25),
        marginRight: px2dp(10),
    },
    textInput: {
        flex: 1,
        padding: 0,
        height: px2dp(33),
        fontSize: FONT_SIZE(16),

    },
    // 清空按钮
    clearTextClick: {
        paddingRight: px2dp(10),
        paddingLeft: px2dp(5),
        justifyContent: 'center',
        alignItems: 'center',
        height: px2dp(33),
    },
    cancelText: {
        fontSize: FONT_SIZE(14),
        color: '#676666',
    },
    defaultPromptBox: {
        paddingTop: px2dp(27),
    },
    defaultPromptText: {
        width: SCREEN_WIDTH,
        fontSize: FONT_SIZE(14),
        color: '#bebebe',
        textAlign: 'center',
    },
    FlatListStyle: {
        backgroundColor: '#efefef',
    },
    // 选择按钮
    // selectBtn: {
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     width: px2dp(85),
    //     height: px2dp(31),
    //     borderWidth: Pixel,
    //     borderColor: '#898989',
    //     borderRadius: px2dp(5),
    // },
    // slecetBtnText: {
    //     fontSize: FONT_SIZE(16),
    //     color: '#333',
    // },
    filterClick: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.2)',
        alignItems: 'flex-end',
    },
    filterContainer: {
        position: 'relative',
        top: 0,
        right: 0,
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
        fontSize: FONT_SIZE(14),
        color: '#9e9e9e',
    },
    fixedBtnText: {
        marginRight: px2dp(16),
        fontSize: FONT_SIZE(14),
        color: '#9E9E9E',
    },
    // 默认模块
    defaultBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(45),
        borderBottomWidth: Pixel,
        borderColor: '#DBDBDB',
    },
    defaultText: {
        fontSize: FONT_SIZE(14),
        color: '#9E9E9E',
    },
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
        height: px2dp(30),
        paddingLeft: px2dp(30),
        paddingRight: px2dp(30),
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
        color: '#757575',
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
    }
});
