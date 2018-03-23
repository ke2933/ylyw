import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    FlatList,
    ScrollView,
    BackHandler,

} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {requestUrl} from '../Network/url';//接口url
import {RegExp} from '../Network/RegExp';//正则
import {Global} from '../common/Global';
import Loading from '../common/Loading';
import CountDown from '../common/CountDown';// 倒计时

export default class searchDoctor extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            clearBtn: false,
            searchText: '',
            searchArr: [],
            pageNo: '1',
            pageSize: '10',
            isLoading: false,
            thisCityId: '',
            departmentId: '',// 科室id
            thisCity: '',
            doctorBeanList: [],// 医生列表
            baseHospitalDeptList: [],// 医院列表
            patientName: "",//患者姓名
            phone: "",//患者电话
            diseaseId: "",//疾病id
            consultationReason: "",//会诊目的
            caseImgUrlArr: [],//图片Url数组
            departmentName: '',//科室名字
            diseaseName: '',//疾病名字
            type: '',
            activeId: '',// 找专家选择的地区
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
            if (type === 'doc') {
                this.setState({
                    patientName: data.patientName,//患者姓名
                    phone: data.phone,//患者电话
                    diseaseId: data.diseaseId,//疾病id
                    consultationReason: data.consultationReason,//会诊目的
                    caseImgUrlArr: data.caseImgUrlArr,//图片Url数组
                    departmentName: data.caseImgUrlArr,//科室名字
                    diseaseName: data.diseaseName,//疾病名字
                    departmentId: data.departmentId,// 科室id
                    type: type,
                    activeId: data.areaActiveId,
                })
            } else if (type === 'expert') {
                this.setState({
                    departmentId: data.deptActiveId,// 科室id
                    activeId: data.areaActiveId,
                    type: type,
                })
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.Loading ? <Loading/> : null}
                <View style={styles.navContent}>
                    <View style={styles.searchBox}>
                        <Image style={styles.searchImg} source={require('../images/search_img.png')}/>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'搜索医院/医生'}
                            placeholderTextColor={'#bebebe'}
                            onChangeText={(text) => {
                                if (text.length > 0) {
                                    this.setState({
                                        clearBtn: true,
                                        searchText: text
                                    });
                                    this.fetchData(text);
                                } else {
                                    this.setState({
                                        clearBtn: false,
                                        searchText: text,
                                    });
                                    this.fetchData(text);
                                }
                            }}
                            autoFocus={true}
                            defaultValue={this.state.searchText}
                            underlineColorAndroid={'transparent'}
                            // onBlur={this.searchTextReg.bind(this)}
                            keyboardType={"default"}
                            enablesReturnKeyAutomatically={true}//ios禁止空确认
                            returnKeyType={'search'}
                        >
                        </TextInput>
                        {this.state.clearBtn ?
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        searchText: '',
                                        clearBtn: false,
                                    })
                                }}
                                activeOpacity={.8}
                                style={styles.clearTextClick}
                            >
                                <Image source={require('../images/input_clear.png')}/>
                            </TouchableOpacity>
                            : null}
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            RouteName.pop();
                            this.props.navigation.goBack();
                        }}
                        activeOpacity={.8}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: SCREEN_WIDTH * .15,
                            height: 33,
                        }}
                    >
                        <Text style={styles.cancelText}>取消</Text>
                    </TouchableOpacity>
                </View>
                {this.searchText()}
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

    searchText() {
        const {navigate, goBack} = this.props.navigation;
        if (this.state.searchText === '') {
            return (
                <View style={styles.defaultPromptBox}>
                    <Text style={styles.defaultPromptText}>请输入关键词</Text>
                </View>

            )
        } else if (this.state.baseHospitalDeptList.length + this.state.doctorBeanList.length <= 0) {
            return (
                <View style={styles.noDataBox}>
                    <Image source={require('../images/no_data.png')}/>
                    <Text style={styles.noDataText}>暂无数据</Text>
                </View>
            )
        } else {
            return (
                <ScrollView
                    style={{flex: 1,}}>
                    <View style={styles.searchContainer}>
                        {this.state.baseHospitalDeptList.length > 0 ? <View style={styles.searchContent}>
                            <View style={styles.moreBox}>
                                <Text style={styles.moreTitle}>医院推荐</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigate('SearchDoctorMore', {data: this.state, type: 'hos',})
                                    }}
                                    activeOpacity={.8}
                                >
                                    <View style={styles.moreBtn}>
                                        <Text style={styles.moreText}>更多</Text>
                                        <Image source={require('../images/arrow_gray_right.png')}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                style={styles.FlatListStyle}
                                data={this.state.baseHospitalDeptList}
                                initialNumToRender={20}
                                keyExtractor={item => item.hospitalId}
                                renderItem={({item}) => this.hospitalRender(item)}
                                scrollEnabled={false}
                                ItemSeparatorComponent={() => {
                                    return (
                                        <View style={{height: Pixel, backgroundColor: '#efefef'}}></View>
                                    )
                                }}
                                ListEmptyComponent={() => {
                                    return (
                                        <View style={styles.noDataBox}>
                                            <Image source={require('../images/no_data.png')}/>
                                            <Text style={styles.noDataText}>暂无数据</Text>
                                        </View>
                                    )
                                }}
                            />
                        </View> : null}
                        {this.state.doctorBeanList.length > 0 ? <View style={styles.searchContent}>
                            <View style={styles.moreBox}>
                                <Text style={styles.moreTitle}>医生推荐</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigate('SearchDoctorMore', {data: this.state, type: 'doc'})
                                    }}
                                    activeOpacity={.8}
                                >
                                    <View style={styles.moreBtn}>
                                        <Text style={styles.moreText}>更多</Text>
                                        <Image source={require('../images/arrow_gray_right.png')}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                style={styles.FlatListStyle}
                                data={this.state.doctorBeanList}
                                initialNumToRender={20}
                                keyExtractor={item => item.id}
                                renderItem={({item}) => this.selectDocter(item)}
                                scrollEnabled={false}
                                ItemSeparatorComponent={() => {
                                    return (<View style={{height: Pixel, backgroundColor: '#efefef'}}></View>)
                                }}
                                ListEmptyComponent={() => {
                                    return (
                                        <View style={styles.noDataBox}>
                                            <Image source={require('../images/no_data.png')}/>
                                            <Text style={styles.noDataText}>暂无数据</Text>
                                        </View>
                                    )
                                }}
                            />
                        </View> : null}
                    </View>
                    {IPhoneX ? <View style={{height: 34,}}></View> : null}
                </ScrollView>
            )
        }
    }

    // renderItem = (item) => {
    //     const {navigate, goBack, state} = this.props.navigation;
    //
    // };
    // 发起会诊 搜索 2中情况
    hospitalRender = (item) => {
        const {navigate} = this.props.navigation;
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.state.type === 'doc') {
                        navigate('SelectDoctor', {data: this.state, hospitalData: item})
                    } else if (this.state.type === 'expert') {
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
                        <Image source={require('../images/arrow_gray_right.png')}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };
    selectDocter = (item) => {
        const {navigate} = this.props.navigation;
        let areaLable = [];
        if (this.state.thisCity === item.areaLable) {
            areaLable.push(
                <View key={1} style={styles.docareaLableBox}>
                    <Text style={styles.docareaLableText}>本省</Text>
                </View>
            );
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.state.type === 'doc') {
                        navigate('DoctorInfo', {data: this.state, doctorData: item})
                    } else {
                        navigate('ExpertsInfo', {data: this.state, doctorData: item})
                    }
                }}
                key={item.id}
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

    fetchData(text) {
        let formData = new FormData();
        formData.append("departmentId", this.state.departmentId);
        formData.append("areaId", this.state.activeId);
        formData.append("str", text);
        console.log(formData);
        fetch(requestUrl.search, {
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
                    this.setState({
                        doctorBeanList: responseData.doctorBeanList,
                        baseHospitalDeptList: responseData.baseHospitalDeptList,
                        thisCity: responseData.thisCity,
                    })
                }
            })
            .catch(
                (error) => {
                    console.log(error)
                    this.setState({isLoading: false});
                });
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    navContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: IOS ? IPhoneX ? 88 : 64 : 44,
        paddingTop: IOS ? IPhoneX ? 44 : 20 : 0,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: Pixel,
        borderBottomColor: '#DBDBDB',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        width: SCREEN_WIDTH * .8,
        height: px2dp(33),
        marginLeft: px2dp(15),
        borderRadius: px2dp(16.5),
        backgroundColor: '#fff',
    },
    searchImg: {
        marginLeft: px2dp(15),
        marginRight: px2dp(10),
    },
    textInput: {
        flex: 1,
        padding: 0,
        height: px2dp(33),
        fontSize: FONT_SIZE(14),
        color: '#212121',
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

    // 首页搜索
    searchContainer: {
        flex: 1,
    },
    searchContent: {
        marginTop: px2dp(6),
        backgroundColor: '#fff',
    },
    moreBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: Pixel,
        borderBottomColor: '#E6E6E6',
        paddingLeft: px2dp(15),
        height: px2dp(40),
    },
    moreTitle: {
        fontSize: FONT_SIZE(15),
        color: '#333333',
    },
    moreBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: px2dp(12),
        paddingLeft: px2dp(10),
    },
    moreText: {
        marginRight: px2dp(6),
        fontSize: FONT_SIZE(14),
        color: '#898989',
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
        // width: px2dp(68),
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
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
        borderRadius: px2dp(25),
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
    },


});
