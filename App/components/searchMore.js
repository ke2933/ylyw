import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    FlatList,
    BackHandler,
} from 'react-native';

import {requestUrl} from '../Network/url';//接口url
import {RegExp} from '../Network/RegExp';//正则
import Nav from '../common/Nav';//导航
import {Global} from '../common/Global';
import Loading from '../common/Loading';
import CountDown from '../common/CountDown';
import px2dp from "../common/Tool";
// 倒计时

export default class searchMore extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            pageNo: '1',
            pageSize: '10',
            isLoading: true,
            dataFlag: false,
            dataArr: [],
            isRefresh: false,
            thisCityId: '',
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
            let data = this.props.navigation.state.params.data;
            let type = this.props.navigation.state.params.type;
            let title = '';
            if (type === 'doc') {
                title = '相关医生推荐'
            } else if (type === 'pool') {
                title = '病历池相关病历'
            } else if (type === 'record') {
                title = '病例库相关病例'
            }
            this.setState({
                type: type,
                title: title,
                fuzzyName: data.searchText,
                thisCityId: data.thisCityId,
            });
        }
    }

    componentDidMount() {
        this.fetchData();
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
                         'title': this.state.title,
                         'rightBtn': {type: 'false',}
                     }}/>
                <FlatList
                    style={styles.pickerFlatList}
                    data={this.state.dataArr}
                    initialNumToRender={20}
                    keyboardDismissMode="on-drag"
                    keyExtractor={item => item.id}
                    renderItem={({item}) => this.renderItem(item)}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{
                                borderTopWidth: Pixel,
                                borderTopColor: '#D6E1E8',
                                marginTop: px2dp(6),
                            }}></View>
                        )
                    }}
                    onRefresh={() => {
                        this.fetchData();
                    }}
                    refreshing={this.state.isRefresh}
                    onEndReached={() => this.onEndReached()}
                    onEndReachedThreshold={.1}
                />
            </View>
        );
    }

    renderItem = (item) => {
        const {navigate, goBack} = this.props.navigation;
        if (this.state.type === 'doc') {
            let areaLable = [];
            if (item.areaLable === this.state.thisCityId) {
                areaLable.push(
                    <View key={item.id} style={styles.areaLableBox}>
                        <Text style={styles.areaLableText}>本省</Text>
                    </View>
                );
            }
            return (
                <TouchableOpacity
                    onPress={() => {
                        navigate('ExpertsInfo', {data: this.state, doctorData: item})
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
        } else if (this.state.type === 'pool') {

            return (
                <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                        navigate('CaseHistoryInfo', {data: item})
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
                                <Text style={styles.caseHistoryDate}>还剩 <CountDown
                                    style={{color: '#333', fontSize: 16,}}
                                    duration={item.duration}
                                    beginTime={item.startTime}/></Text>
                            </View>
                            <Image source={require('../images/arrow_gray_right.png')}/>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        } else if (this.state.type === 'record') {
            let imgArr = item.pictureList;
            let temp = [];
            if (imgArr.length >= 0) {

                for (let i = 0; i < (imgArr.length >= 3 ? 3 : imgArr.length); i++) {
                    temp.push(
                        <Image key={i} style={styles.libraryImg}
                               source={{uri: requestUrl.ImgIp + imgArr[i].pictureUrl}}/>
                    );
                }
            }
            return (
                <TouchableOpacity
                    onPress={() => {
                        navigate('LibraryInfo', {data: item});
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
                                <Image source={require('../images/browse_false.png')}/>
                                <Text style={styles.browseText}>{item.lookNo}</Text>
                            </View>
                            <View style={styles.starBox}>
                                <Image
                                    source={item.collectionType === '1' ? require('../images/collection_true.png') : require('../images/collection_false.png')}/>
                                <Text style={styles.starText}>{item.collectionNo}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    };

    onEndReached() {
        if (this.state.dataFlag) {
            this.setState({
                pageNo: this.state.pageNo * 1 + 1 + '',
            });
            this.fetchDataMore(this.state.pageNo * 1 + 1 + '');
        }
    }

    fetchData() {
        this.setState({pageNo: '1'});
        let formData = new FormData();
        formData.append("type", this.state.type);
        formData.append("fuzzyName", this.state.fuzzyName);
        formData.append("pageNo", '1');
        formData.append("pageSize", this.state.pageSize);
        console.log(formData);
        fetch(requestUrl.viewMore, {
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
                if (this.state.type === 'doc') {
                    if (responseData.doctorBeans.length >= this.state.pageSize) {
                        this.setState({
                            dataFlag: true,
                            dataArr: responseData.doctorBeans,
                            isRefresh: false,
                        })
                    } else {
                        this.setState({
                            dataFlag: false,
                            dataArr: responseData.doctorBeans,
                            isRefresh: false,
                        })
                    }
                } else if (this.state.type === 'pool') {
                    if (responseData.medicalPoolBeanList.length >= this.state.pageSize) {
                        this.setState({
                            dataFlag: true,
                            dataArr: responseData.medicalPoolBeanList,
                            isRefresh: false,
                        })
                    } else {
                        this.setState({
                            dataFlag: false,
                            dataArr: responseData.medicalPoolBeanList,
                            isRefresh: false,
                        })
                    }
                } else if (this.state.type === 'record') {
                    if (responseData.medicalRecordBaseBeanList.length >= this.state.pageSize) {
                        this.setState({
                            dataFlag: true,
                            dataArr: responseData.medicalRecordBaseBeanList,
                            isRefresh: false,
                        })
                    } else {
                        this.setState({
                            dataFlag: false,
                            dataArr: responseData.medicalRecordBaseBeanList,
                            isRefresh: false,
                        })
                    }
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
    }

    fetchDataMore(pageNo) {
        let formData = new FormData();
        formData.append("type", this.state.type);
        formData.append("fuzzyName", this.state.fuzzyName);
        formData.append("pageNo", pageNo);
        formData.append("pageSize", this.state.pageSize);
        console.log(formData);
        fetch(requestUrl.viewMore, {
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
                if (this.state.type === 'doc') {
                    if (responseData.doctorBeans.length >= this.state.pageSize) {
                        let temp = this.state.dataArr;
                        temp = temp.concat(responseData.doctorBeans)
                        this.setState({
                            dataFlag: true,
                            dataArr: temp,
                            isRefresh: false,
                        })
                    } else {
                        let temp = this.state.dataArr;
                        temp = temp.concat(responseData.doctorBeans)
                        this.setState({
                            dataFlag: false,
                            dataArr: temp,
                            isRefresh: false,
                        })
                    }
                } else if (this.state.type === 'pool') {
                    if (responseData.medicalPoolBeanList.length >= this.state.pageSize) {
                        let temp = this.state.dataArr;
                        temp = temp.concat(responseData.medicalPoolBeanList);
                        this.setState({
                            dataFlag: true,
                            dataArr: temp,
                            isRefresh: false,
                        })
                    } else {
                        let temp = this.state.dataArr;
                        temp = temp.concat(responseData.medicalPoolBeanList)
                        this.setState({
                            dataFlag: false,
                            dataArr: temp,
                            isRefresh: false,
                        })
                    }
                } else if (this.state.type === 'record') {
                    if (responseData.medicalRecordBaseBeanList.length >= this.state.pageSize) {
                        let temp = this.state.dataArr;
                        temp = temp.concat(responseData.medicalRecordBaseBeanList);
                        this.setState({
                            dataFlag: true,
                            dataArr: temp,
                            isRefresh: false,
                        })
                    } else {
                        let temp = this.state.dataArr;
                        temp = temp.concat(responseData.medicalRecordBaseBeanList)
                        this.setState({
                            dataFlag: false,
                            dataArr: temp,
                            isRefresh: false,
                        })
                    }
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
        backgroundColor: '#EFEFEF',
    },
// 病历池
    caseHistoryItem: {
        // marginTop: px2dp(8),
        // marginLeft: px2dp(8),
        // marginRight: px2dp(8),
        // borderRadius: px2dp(10),
        backgroundColor: '#fff',
        // borderColor: '#e6e6e6',
        // borderWidth: Pixel,
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
        borderWidth: 1,
        borderTopLeftRadius: px2dp(10),
        borderBottomLeftRadius: px2dp(10),
    },
    statusText: {
        fontSize: FONT_SIZE(13),
        color: '#566CB7',
    },
    topBox: {
        // height: px2dp(147),
    },
    caseHistoryTitle: {
        marginTop: px2dp(20),
        marginLeft: px2dp(13),
        fontSize: FONT_SIZE(19),
        color: '#333333',
    },
    caseHistoryInfo: {
        marginTop: px2dp(10),
        marginLeft: px2dp(13),
        fontSize: FONT_SIZE(14),
        color: '#676767',
    },
    caseHistoryText: {
        marginTop: px2dp(14),
        marginLeft: px2dp(12),
        marginRight: px2dp(12),
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
        paddingRight: px2dp(24),
        borderTopColor: '#eeeeee',
        borderTopWidth: Pixel,
    },
    bottomLeftBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    caseHistoryPrice: {
        marginLeft: px2dp(13),
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
        justifyContent: 'space-between',
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
});
