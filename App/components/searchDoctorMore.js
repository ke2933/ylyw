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
import CountDown from '../common/CountDown';// 倒计时

export default class searchMore extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            pageNo: '1',
            pageSize: '10',
            isLoading: false,
            dataFlag: false,
            dataArr: [],
            isRefresh: false,

            searchText: '',
            patientName: '',//患者姓名
            phone: '',//患者电话
            diseaseId: '',//疾病id
            consultationReason: '',//会诊目的
            caseImgUrlArr: [],//图片Url数组
            departmentName: '',//科室名字
            diseaseName: '',//疾病名字
            departmentId: '',// 科室id
            thisCity: '',
            selectType: '',
        }
    }

    componentWillMount() {
       NetWork ? null : Alert.alert('网络似乎断掉了'), this.setState({isLoading: false});RouteName.push(this.props.navigation.state);        if (Android) {            BackHandler.addEventListener('hardwareBackPress', () => {                backAndroid();                return true;            });        }
        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params.data;
            let type = this.props.navigation.state.params.type;
            let title = '';
            if (type === 'doc') {
                title = '相关医生推荐'
            } else if (type === 'hos') {
                title = '相关医院推荐'
            }
            this.setState({
                type: type,
                title: title,
                searchText: data.searchText,
                patientName: data.patientName,//患者姓名
                phone: data.phone,//患者电话
                diseaseId: data.diseaseId,//疾病id
                consultationReason: data.consultationReason,//会诊目的
                caseImgUrlArr: data.caseImgUrlArr,//图片Url数组
                departmentName: data.caseImgUrlArr,//科室名字
                diseaseName: data.diseaseName,//疾病名字
                departmentId: data.departmentId,// 科室id
                selectType: data.type,
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
                         goBack()
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
                    keyExtractor={item => this.state.type === 'doc' ?item.id :item.hospitalId}
                    renderItem={({item}) => this.renderItem(item)}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{
                                borderTopWidth: Pixel,
                                borderTopColor: '#D6E1E8'
                            }}></View>
                        )
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
                    onRefresh={() => {
                        this.fetchData();
                    }}
                    refreshing={this.state.isRefresh}
                    onEndReached={() => this.onEndReached()}
                    onEndReachedThreshold={.1}
                    ListEmptyComponent={() => {
                        return (
                            <View style={styles.noDataBox}>
                                <Image source={require('../images/no_data.png')}/>
                                <Text style={styles.noDataText}>暂无数据</Text>
                            </View>
                        )
                    }}
                />
            </View>
        );
    }

    renderItem = (item) => {
        const {navigate, goBack} = this.props.navigation;
        if (this.state.type === 'doc') {
            let areaLable = [];
            if (this.state.thisCity === item.areaLable) {
                areaLable.push(
                    <View key={item.id} style={styles.docareaLableBox}>
                        <Text style={styles.docareaLableText}>本省</Text>
                    </View>
                );
            }
            return (
                <TouchableOpacity
                    onPress={() => {
                        if (this.state.selectType === 'doc') {
                            navigate('DoctorInfo', {data: this.state, doctorData: item})
                        } else {
                            navigate('ExpertsInfo', {data: this.state, doctorData: item})
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
        } else if (this.state.type === 'hos') {
            const {navigate} = this.props.navigation;
            return (
                <TouchableOpacity
                    onPress={() => {
                        if(this.state.selectType === 'doc'){
                            navigate('SelectDoctor', {data: this.state, hospitalData: item})
                        }else if(this.state.selectType === 'expert'){
                            navigate('SelectExperts', {data: this.state, hospitalData: item})
                        }
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
                                {item.areaLable === this.state.thisCity ?
                                    <View style={styles.areaLableBox}>
                                        <Text style={styles.areaLableText}>本省</Text>
                                    </View> : null}
                                {item.hospitalLable > 0 ? <View style={styles.hospitalLabelBox}>
                                    <Text style={styles.hospitalLabelText}>顶级医院</Text>
                                </View> : null}
                                {item.hospitalLable === 0 ? <View style={styles.hospitalLabelBox}>
                                    <Text style={styles.hospitalLabelText}>知名医院</Text>
                                </View> : null}
                                {item.hospitalType ?<View style={styles.hospitalLabelBox}>
                                    <Text style={styles.hospitalLabelText}>{item.hospitalType}</Text>
                                </View>:null}
                                {item.departmentLable > 0 ? <View style={styles.hospitalLabelBox}>
                                    <Text style={styles.hospitalLabelText}>顶级科室</Text>
                                </View> : null}
                                {item.departmentLable === 0 ? <View style={styles.hospitalLabelBox}>
                                    <Text style={styles.hospitalLabelText}>知名科室</Text>
                                </View> : null}
                            </View>
                            <Image source={require('../images/arrow_gray_right.png')}/>
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
        formData.append("departmentId", this.state.departmentId);
        formData.append("str", this.state.searchText);
        formData.append("pageNo", '1');
        formData.append("pageSize", this.state.pageSize);
        console.log(formData);
        fetch(requestUrl.searchMore, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData)
                this.setState({isLoading: false,thisCity: responseData.thisCity});
                if (this.state.type === 'doc') {
                    if (responseData.doctorBeanList.length >= this.state.pageSize) {
                        this.setState({
                            dataFlag: true,
                            dataArr: responseData.doctorBeanList,
                            isRefresh: false,
                        })
                    } else {
                        this.setState({
                            dataFlag: false,
                            dataArr: responseData.doctorBeanList,
                            isRefresh: false,
                        })
                    }
                } else if (this.state.type === 'hos') {
                    if (responseData.baseHospitalDeptList.length >= this.state.pageSize) {
                        this.setState({
                            dataFlag: true,
                            dataArr: responseData.baseHospitalDeptList,
                            isRefresh: false,
                        })
                    } else {
                        this.setState({
                            dataFlag: false,
                            dataArr: responseData.baseHospitalDeptList,
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
        // this.setState({isLoading: true});
        let formData = new FormData();
        formData.append("type", this.state.type);
        formData.append("departmentId", this.state.departmentId);
        formData.append("str", this.state.searchText);
        formData.append("pageNo", pageNo);
        formData.append("pageSize", this.state.pageSize);
        console.log(formData);
        fetch(requestUrl.searchMore, {
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
                    if (responseData.doctorBeanList.length >= this.state.pageSize) {
                        let temp = this.state.dataArr;
                        temp = temp.concat(responseData.doctorBeanList)
                        this.setState({
                            dataFlag: true,
                            dataArr: temp,
                            isRefresh: false,
                        })
                    } else {
                        let temp = this.state.dataArr;
                        temp = temp.concat(responseData.doctorBeanList)
                        this.setState({
                            dataFlag: false,
                            dataArr: temp,
                            isRefresh: false,
                        })
                    }
                } else if (this.state.type === 'hos') {
                    if (responseData.baseHospitalDeptList.length >= this.state.pageSize) {
                        let temp = this.state.dataArr;
                        temp = temp.concat(responseData.baseHospitalDeptList);
                        this.setState({
                            dataFlag: true,
                            dataArr: temp,
                            isRefresh: false,
                        })
                    } else {
                        let temp = this.state.dataArr;
                        temp = temp.concat(responseData.baseHospitalDeptList)
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
    hospitalDetailBox:{
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
    lowestText: {
        fontSize: FONT_SIZE(16),
        color: '#333',
    },
    FlatListStyle: {
        marginTop: px2dp(6),
        backgroundColor: '#efefef',
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
        borderRadius: px2dp(25)
        ,
    },
    docareaLableBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(38),
        height: px2dp(18),
        backgroundColor: '#f08058',
        borderRadius: px2dp(9),
    },
    docareaLableText: {
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
        fontSize: FONT_SIZE(12),
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
    // hospitalLableContent: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    // },
    // hospitalLabelBox: {
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginRight: px2dp(5),
    //     width: px2dp(68),
    //     height: px2dp(25),
    //     borderRadius: px2dp(5),
    //     borderWidth: Pixel,
    //     borderColor: '#566cb7',
    // },
    // hospitalLabelText: {
    //     fontSize: FONT_SIZE(13),
    //     color: '#566CB7',
    // },
    fee: {
        fontSize: FONT_SIZE(14),
        color: '#333',
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
