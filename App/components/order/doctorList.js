import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    TextInput,
    FlatList,
    BackHandler
} from 'react-native';

import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Button from '../../common/Button';
import px2dp from "../../common/Tool";
//按钮

export default class doctorList extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isRefresh: false,
            dataFlag: false,
            pageNo: '1',
            pageSize: '10',
            doctorArr: [],
            hospitalId: '',
            hospitalLable: '',
            hospitalName: '',
            deptLabel: '',
            areaId: '',
            departmentDetail: '',
            departmentId: '',
            thisCity: '',
            launch: 0,
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
        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params.data;
            this.setState({
                hospitalId: data.consultationHospitalId,
                hospitalLable: data.hospitalLable,
                hospitalName: data.consultationHospitalName,
                deptLabel: data.deptLabel,
                areaId: data.areaId,
                departmentDetail: data.consultationDeptInfo,
                departmentId: data.consultationDeptId,
                thisCity: data.thisCity,
            })
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
                         'title': this.state.hospitalName,
                         'rightBtn': {
                             type: false,
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
                <FlatList
                    style={styles.FlatListStyle}
                    data={this.state.doctorArr}
                    initialNumToRender={20}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => this.renderItem(item)}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{height: Pixel, backgroundColor: '#efefef'}}></View>
                        )
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
                                <Image source={require('../../images/no_data.png')}/>
                                <Text style={styles.noDataText}>暂无数据</Text>
                            </View>
                        )
                    }}
                />
            </View>
        );
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
                            {this.state.hospitalLable > 0 ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>顶级医院</Text>
                            </View> : null}
                            {this.state.departmentLable > 0 ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>顶级科室</Text>
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
            this.fetchDataMore(this.state.pageNo * 1 + 1 + '');
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
        formData.append("titleId", '');
        formData.append("fee", '');
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
                    console.log(error)
                    this.setState({isLoading: false});
                    this.refs.toast.show('加载数据失败');
                });
    }

    fetchDataMore(pageNo) {
        // this.setState({isLoading: true});
        let formData = new FormData();
        formData.append("hospitalId", this.state.hospitalId);
        formData.append("departmentId", this.state.departmentId);
        formData.append("titleId", '');
        formData.append("fee", '');
        formData.append("pageNo", pageNo);
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
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
        width: px2dp(285),
        fontSize: FONT_SIZE(14),
        color: '#fff',
    },
    synopsisRightText: {
        width: px2dp(60),
        fontSize: FONT_SIZE(14),
        color: '#fff',
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
    fee: {
        fontSize: FONT_SIZE(14),
        color: '#333',
    },
    FlatListStyle: {
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
