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
    ScrollView,
    BackHandler,
    Easing,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import Nav from '../../common/Nav';
import px2dp from "../../common/Tool";

export default class selectHospital extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            deptId: '',// 科室id
            departmentId: '',// 科室id
            deptName: '',
            hospitalArr: [],//医院数组
            pageNo: '1',
            pageSize: '10',//每页显示数
            dataFlag: false,// 是否有数据
            isRefresh: false,// 加载图
            filterBoxRight: new Animated.Value(0),

            myAreaID: '',// 本省id
            myAreaName: '',// 本省名字
            country: {},// 全国信息
            filterBox: false,//筛选模块
            areaFlag: true,// 展开true 收起false
            deptFlag: true,

            optionActiveBtnBox: {backgroundColor: '#7388d0'},
            optionActiveBtnText: {color: '#fff',},
            retractStyle: {maxHeight: px2dp(130), overflow: 'hidden'},

            cityBeanList: [],// 省份数组
            baseDeptList: [],// 科室列表
            cityHospitalBeanList: [],//通过地区获取医院数组

            areaActiveId: '',// 选择的地区id
            areaActiveName: '',// 选择的地区名字
            selectAreaId: '',
            selectAreaName: '',

            deptActiveId: '',// 选择科室id
            deptActiveName: '',// 选择科室名字
            selectDeptId: '',
            selectDeptName: '',

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
        // 获取登录医生信息
        fetch(requestUrl.baseInfo)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({
                    myAreaID: responseData.cityId,
                    myAreaName: responseData.cityName,
                    deptId: responseData.deptId,
                    departmentId: responseData.deptId,
                    deptName: responseData.deptName,
                    areaActiveId: responseData.cityId,
                    areaActiveName: responseData.cityName,
                    selectAreaId: responseData.cityId,
                    selectAreaName: responseData.cityName,
                    deptActiveId: responseData.deptId,
                    deptActiveName: responseData.deptName,
                    selectDeptId: responseData.deptId,
                    selectDeptName: responseData.deptName,

                });
                this.selectCountry();// 获取全国
                // this.getUseTwoDeptFetch(responseData.cityId);// 获取科室
                this.findDepartmentData();
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
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
                         'title': '会诊专家',
                         'rightBtn': {
                             type: 'select',
                             click: this.rightBtn.bind(this),
                         }
                     }}/>
                {this.state.filterBox ? this.renderFilterBox() :
                    <View style={{flex: 1,}}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('SearchDoctor', {
                                    "api": 'search',
                                    "data": this.state,
                                    'type': 'expert'
                                })
                            }}
                            activeOpacity={.8}
                        >
                            <View style={styles.searchContent}>
                                <View style={styles.searchBox}>
                                    <Image source={require('../../images/search_img.png')}/>
                                    <Text style={styles.searchTitle}>搜索医院、医生</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <FlatList
                            style={styles.hospitalFlatList}
                            data={this.state.hospitalArr}
                            initialNumToRender={20}
                            keyExtractor={item => item.hospitalId}
                            ListFooterComponent={() => {
                                if (IPhoneX) {
                                    return (
                                        <View style={{height: 34,}}></View>
                                    )
                                } else {
                                    return null;
                                }
                            }}
                            renderItem={({item}) => this.renderItem(item)}
                            onRefresh={() => {
                                this.findDepartmentData();
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

            </View>
        );
    }

    // 医院列表
    renderItem = (item) => {
        const {navigate} = this.props.navigation;
        return (
            <TouchableOpacity
                onPress={() => {
                    navigate('SelectExperts', {data: this.state, hospitalData: item})
                }}
                activeOpacity={.8}
                key={item.hospitalId}
            >
                <View style={styles.hospitalContent}>
                    <View style={styles.topBox}>
                        <View style={styles.titleBox}>
                            <Text numberOfLines={2} style={styles.title}>{item.hospitalName}</Text>
                        </View>
                        <View style={styles.hospitalDetailBox}>
                            <Text numberOfLines={1} style={styles.hospitalDetailText}>{item.departmentDetail}</Text>
                        </View>
                    </View>
                    <View style={styles.bottomBox}>
                        <View style={styles.hospitalLableContent}>
                            {item.areaLable === this.state.myAreaID ?
                                <View style={styles.areaLableBox}>
                                    <Text style={styles.areaLableText}>本省</Text>
                                </View> : null}
                            {item.hospitalLable > 0 ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>顶级医院</Text>
                            </View> : null}
                            {item.hospitalLable === 0 ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>知名医院</Text>
                            </View> : null}
                            {item.hospitalType ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>{item.hospitalType}</Text>
                            </View> : null}
                            {item.departmentLable > 0 ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>顶级科室</Text>
                            </View> : null}
                            {item.departmentLable === 0 ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>知名科室</Text>
                            </View> : null}
                        </View>
                        <Image source={require('../../images/arrow_gray_right.png')}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };


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
                                {/*<View style={styles.defaultBox}>*/}
                                {/*<Text style={styles.defaultText}>您的认证地区：</Text>*/}
                                {/*<TouchableOpacity*/}
                                {/*onPress={() => {*/}
                                {/*this.setState({*/}
                                {/*areaActiveId: this.state.myAreaID,*/}
                                {/*areaActiveName: this.state.myAreaName,*/}
                                {/*})*/}
                                {/*}}*/}
                                {/*activeOpacity={.8}*/}
                                {/*>*/}
                                {/*<View*/}
                                {/*style={[styles.myOptionBtn, this.state.areaActiveId === this.state.myAreaID ? this.state.optionActiveBtnBox : null]}>*/}
                                {/*<Text*/}
                                {/*style={[styles.myOptionText, this.state.areaActiveId === this.state.myAreaID ? this.state.optionActiveBtnText : null]}>{this.state.myAreaName}</Text>*/}
                                {/*</View>*/}
                                {/*</TouchableOpacity>*/}
                                {/*</View>*/}
                                <View
                                    style={[styles.optionBtnContent, this.state.areaFlag ? this.state.retractStyle : null]}>
                                    {this.areaRender()}
                                </View>
                            </View>
                            <View style={styles.moduleContent}>
                                <View style={styles.fixedBox}>
                                    <View style={styles.fixedBoxItem}>
                                        <Text style={styles.fixedTitle}>选择科室</Text>
                                        <Text style={styles.fixedText}>{this.state.deptActiveName}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                deptFlag: !this.state.deptFlag,
                                            })
                                        }}
                                        activeOpacity={.8}
                                    >
                                        <View style={[styles.fixedBoxItem, styles.fixedBtnBox]}>
                                            <Text style={styles.fixedBtnText}>{this.state.deptFlag ? '展开' : '收起'}</Text>
                                            <Image
                                                source={this.state.deptFlag ? require('../../images/arrow_gray_right.png') : require('../../images/dropdown_arrow.png')}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {/*<View style={styles.defaultBox}>*/}
                                {/*<Text style={styles.defaultText}>您的认证科室：</Text>*/}
                                {/*<TouchableOpacity*/}
                                {/*onPress={() => {*/}
                                {/*this.setState({*/}
                                {/*deptActiveId: this.state.deptId,*/}
                                {/*deptActiveName: this.state.deptName,*/}
                                {/*})*/}
                                {/*}}*/}
                                {/*activeOpacity={.8}*/}
                                {/*>*/}
                                {/*<View*/}
                                {/*style={[styles.myOptionBtn, this.state.deptId === this.state.deptActiveId ? this.state.optionActiveBtnBox : null]}>*/}
                                {/*<Text*/}
                                {/*style={[styles.myOptionText, this.state.deptId === this.state.deptActiveId ? this.state.optionActiveBtnText : null]}>{this.state.deptName}</Text>*/}
                                {/*</View>*/}
                                {/*</TouchableOpacity>*/}
                                {/*</View>*/}
                                <View
                                    style={[styles.optionBtnContent, this.state.deptFlag ? this.state.retractStyle : null]}>
                                    {this.deptRender()}
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.confirm();
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

    areaRender() {
        let arr = this.state.cityBeanList;
        let temp = [];
        for (let i = 0; i < arr.length; i++) {
            temp.push(
                <TouchableOpacity
                    onPress={() => {
                        this.getUseTwoDeptFetch(arr[i].id);
                        this.setState({
                            areaActiveId: arr[i].id,
                            areaActiveName: arr[i].cityName,
                            deptActiveId: this.state.baseDeptList[0].id,
                            deptActiveName: this.state.baseDeptList[0].deptName,
                        });

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

    deptRender() {
        let arr = this.state.baseDeptList;
        let temp = [];
        for (let i = 0; i < arr.length; i++) {
            temp.push(
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            deptActiveId: arr[i].id,
                            deptActiveName: arr[i].deptName,
                        })
                    }}
                    key={i}
                    activeOpacity={.8}
                >
                    <View
                        style={[styles.optionBtn, this.state.deptActiveId === arr[i].id ? this.state.optionActiveBtnBox : null]}>
                        <Text
                            style={[styles.optionText, this.state.deptActiveId === arr[i].id ? this.state.optionActiveBtnText : null]}>{arr[i].deptName}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        return temp;
    }


    // 加载更多事件
    onEndReached() {
        if (this.state.dataFlag) {
            this.findDepartmentDataMore(this.state.pageNo * 1 + 1 + '');
            this.setState({pageNo: this.state.pageNo * 1 + 1 + ''});
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
                fetch(requestUrl.selectCityByHospital)
                    .then((response) => response.json())
                    .then((responseData) => {
                        console.log(responseData);
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

    // 通过地区查询有医生的科室
    getUseTwoDeptFetch(cityId) {
        let formData = new FormData();
        formData.append("cityId", cityId);
        console.log(formData);
        fetch(requestUrl.getUseTwoDept, {
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
                    responseData.baseDeptList.unshift({'id': this.state.deptId, 'deptName': this.state.deptName});
                    this.setState({
                        baseDeptList: responseData.baseDeptList,
                    })
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
    }

    // 获取医院列表
    findDepartmentData() {
        this.setState({pageNo: '1'});
        let formData = new FormData();
        formData.append("cityId", this.state.areaActiveId);
        formData.append("deptId", this.state.deptActiveId);
        formData.append("pageNo", '1');
        formData.append("pageSize", this.state.pageSize);
        console.log(formData);
        fetch(requestUrl.findHospital, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({isLoading: false,});
                console.log(responseData);
                if (responseData.hospitalDepartmentList.length >= this.state.pageSize) {
                    this.setState({
                        dataFlag: true,
                        hospitalArr: responseData.hospitalDepartmentList,
                    })
                } else {
                    this.setState({
                        dataFlag: false,
                        hospitalArr: responseData.hospitalDepartmentList,
                    })
                }
            })
            .catch(
                (error) => {
                    console.log(error);
                    this.setState({isLoading: false})
                });
    }

    // 获取医院列表－更多
    findDepartmentDataMore(pageNo) {
        let formData = new FormData();
        formData.append("cityId", this.state.areaActiveId);
        formData.append("deptId", this.state.deptActiveId);
        formData.append("pageNo", pageNo);
        formData.append("pageSize", this.state.pageSize);
        fetch(requestUrl.findHospital, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.hospitalDepartmentList.length >= this.state.pageSize) {
                    let temp = this.state.hospitalArr;
                    temp = temp.concat(responseData.hospitalDepartmentList);
                    this.setState({
                        hospitalArr: temp,
                        dataFlag: true,
                        isRefresh: false,
                    })
                } else {
                    let temp = this.state.hospitalArr;
                    temp = temp.concat(responseData.hospitalDepartmentList);
                    this.setState({
                        hospitalArr: temp,
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

    rightBtn() {
        this.setState({
            filterBox: !this.state.filterBox,
            areaActiveId: this.state.selectAreaId,
            areaActiveName: this.state.selectAreaName,
            deptActiveId: this.state.selectDeptId,
            deptActiveName: this.state.selectDeptName,
        });
        this.getUseTwoDeptFetch(this.state.selectAreaId);// 获取科室
        this.state.filterBoxRight.setValue(-SCREEN_WIDTH * .93);
        Animated.timing(this.state.filterBoxRight, {
            toValue: 0,
            duration: 300,
            easing: Easing.linear,// 线性的渐变函数
        }).start();
    }

    // 确定事件
    confirm() {
        this.setState({
            filterBox: false,
            selectAreaId: this.state.areaActiveId,
            selectAreaName: this.state.areaActiveName,
            selectDeptId: this.state.deptActiveId,
            selectDeptName: this.state.deptActiveName,
        });
        this.findDepartmentData();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },

    // 医院item
    hospitalContent: {
        marginBottom: px2dp(6),
        backgroundColor: '#fff',
    },
    topBox: {
        paddingTop: px2dp(15),
        paddingRight: px2dp(15),
        paddingLeft: px2dp(15),
        paddingBottom: px2dp(9),
        borderBottomWidth: Pixel,
        borderBottomColor: '#efefef',
    },
    titleBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: FONT_SIZE(17),
        lineHeight: px2dp(24),
        fontWeight: '500',
        color: '#333333',
    },
    areaLableBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(68),
        height: px2dp(25),
        marginRight: px2dp(5),
        // backgroundColor: '#f08058',
        borderRadius: px2dp(5),
        borderWidth: Pixel,
        borderColor: '#f08058',
    },
    areaLableText: {
        fontSize: FONT_SIZE(13),
        color: '#f08058',
    },
    hospitalDetailBox: {
        justifyContent: 'center',
        height: px2dp(33),
        marginBottom: px2dp(5),

    },
    hospitalDetailText: {
        fontSize: FONT_SIZE(14),
        color: '#757575',
    },
    bottomBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: px2dp(44),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
    },
    hospitalLableContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hospitalLabelBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: px2dp(5),
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        // width: px2dp(68),
        height: px2dp(25),
        borderRadius: px2dp(5),
        borderWidth: Pixel,
        borderColor: '#566cb7',
    },
    hospitalLabelText: {
        fontSize: FONT_SIZE(13),
        color: '#566CB7',
    },
    lowestText: {
        fontSize: FONT_SIZE(16),
        color: '#333',
    },
    FlatListStyle: {
        marginTop: px2dp(6),
        backgroundColor: '#efefef',
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
// 筛选
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
    hospitalFlatList: {
        flex: 1,
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
