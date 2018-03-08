import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    PixelRatio,
    StatusBar,
    TextInput,
    TouchableOpacity,
    FlatList,
    BackHandler,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Button from '../../common/Button';//按钮
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import px2dp from "../../common/Tool";

export default class InPool extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            departmentId: '',//科室id
            departmentName: '',//科室名字
            hospitalName: '全部',//医院名字
            hospitalId: '',//医院id
            areaId: '',// 地区id
            areaName: '',// 地区名字
            fee: '',
            feeFlag: false,
            feeArr: FeeArr,
            areaArr: [],
            areaFlag: false,
            hospitalArr: [],
            hospitalFlag: false,
            caseImgUrlArr: [],
            patientName: "",//患者姓名
            phone: "",//患者电话
            diseaseId: "",//疾病id
            consultationReason: "",//会诊目的

            feeActiveId: FeeArr[0].id,
            areaNativeId: '',
            areaNativeName: '',
            hospitalActiveId: '',
            hospitalActiveName: '',
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

        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params.data;
            this.setState({
                departmentId: data.departmentId,
                departmentName: data.departmentName,
                caseImgUrlArr: data.caseImgUrlArr,
                patientName: data.patientName,//患者姓名
                phone: data.phone,//患者电话
                diseaseId: data.diseaseId,//疾病id
                consultationReason: data.consultationReason,//会诊目的

            });
        }
    }

    componentDidMount() {
        //获取地区
        // fetch(requestUrl.getBaseCity)
        //     .then((response) => response.json())
        //     .then((responseData) => {
        //         // console.log(responseData);
        //         // let temp = responseData.baseCityList;
        //         // temp.unshift({id: responseData.id, cityName: '全国'});
        //         this.setState({
        //             areaArr: responseData.cityBeanList,
        //         });
        //     })
        //     .catch(
        //         (error) => {
        //             console.log('error', error);
        //         });
        // 获取本省 是哪个省
        fetch(requestUrl.queryProvince)
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status === '0') {
                    this.setState({
                        areaId: responseData.id,
                        areaName: responseData.name,
                        isLoading: false,
                        areaNativeId: responseData.id,
                        areaNativeName: responseData.name,
                    });
                    this.hospitalData(responseData.id);
                    // 获取全国
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
                                        'id': this.state.areaId,
                                        'cityName': this.state.areaName
                                    });
                                    this.setState({
                                        areaArr: responseData.cityBeanList,
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
                         'title': '投入病历池',
                         'rightBtn': {type: 'false'}
                     }}/>
                <View style={styles.selectBox}>
                    <Text style={styles.selectText}>投放地区</Text>
                    <TextInput
                        style={styles.selectInput}
                        placeholder={'请选择地区'}
                        placeholderTextColor={'#c7c7cd'}
                        underlineColorAndroid={'transparent'}
                        defaultValue={this.state.areaName}
                    />
                    <Image style={styles.arrowRightImg}
                           source={require('../../images/arrow_gray_right.png')}/>
                    <TouchableOpacity
                        style={styles.selectClick}
                        onPress={() => {
                            this.setState({
                                areaFlag: true,
                                hospitalFlag: false,
                                feeFlag: false,
                            })
                        }}
                        activeOpacity={0.8}
                    >
                    </TouchableOpacity>
                </View>
                <View style={styles.selectBox}>
                    <Text style={styles.selectText}>设定医院</Text>
                    <TextInput
                        style={styles.selectInput}
                        placeholder={'全部'}
                        placeholderTextColor={'#212121'}
                        onChangeText={(text) => this.setState({doctorIdcard: text})}
                        underlineColorAndroid={'transparent'}
                        defaultValue={this.state.hospitalName}
                    />
                    <Image style={styles.arrowRightImg}
                           source={require('../../images/arrow_gray_right.png')}/>
                    <TouchableOpacity
                        style={styles.selectClick}
                        onPress={() => {
                            this.setState({
                                areaFlag: false,
                                feeFlag: false,
                                hospitalFlag: true,
                            })
                        }}
                        activeOpacity={0.8}
                    >
                    </TouchableOpacity>
                </View>
                <View style={styles.exhibitionBox}>
                    <Text style={styles.exhibitionTitle}>会诊科室</Text>
                    <Text numberOfLines={1} style={styles.exhibitionText}>{this.state.departmentName}</Text>
                </View>
                <View style={styles.selectBox}>
                    <Text style={styles.selectText}>诊费</Text>
                    <TextInput
                        style={styles.selectInput}
                        placeholder={'请选择'}
                        placeholderTextColor={'#c7c7cd'}
                        underlineColorAndroid={'transparent'}
                        defaultValue={this.state.fee}
                    />
                    <Image style={styles.arrowRightImg}
                           source={require('../../images/arrow_gray_right.png')}/>
                    <TouchableOpacity
                        style={styles.selectClick}
                        onPress={() => {
                            this.setState({
                                feeFlag: true,
                                hospitalFlag: false,
                                areaFlag: false,
                            })
                        }}
                        activeOpacity={0.8}
                    >
                    </TouchableOpacity>
                </View>
                <Button text={'发送'} click={this.submit.bind(this)}/>
                {this.state.feeFlag ?
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                feeFlag: false,
                            })
                        }}
                        style={styles.feeClick}
                    >
                        <TouchableOpacity
                            onPress={() => {
                            }}
                            activeOpacity={1}
                            style={styles.MaskClick}
                        >
                            <View style={styles.titleContent}>
                                <View style={styles.titleBtn}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({feeFlag: false})
                                        }}
                                        activeOpacity={.8}
                                    >
                                        <Text style={styles.textBtn}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                feeFlag: false,
                                                fee: this.state.feeActiveId,
                                            })
                                        }}
                                        activeOpacity={.8}
                                    >
                                        <Text style={styles.textBtn}>确定</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <FlatList
                                style={styles.singleFlatList}
                                data={this.state.feeArr}
                                initialNumToRender={20}
                                keyExtractor={item => item.id}
                                renderItem={({item}) => this.feeRender(item)}
                                ItemSeparatorComponent={() => {
                                    return (
                                        <View style={{
                                            borderTopWidth: Pixel,
                                            borderTopColor: '#D6E1E8'
                                        }}></View>
                                    )
                                }}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                    : null
                }
                {this.state.areaFlag ?
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                areaFlag: false,
                            })
                        }}
                        style={styles.feeClick}
                    >
                        <TouchableOpacity
                            onPress={() => {
                            }}
                            activeOpacity={1}
                            style={styles.MaskClick}
                        >
                            <View style={styles.titleContent}>
                                <View style={styles.titleBtn}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({areaFlag: false})
                                        }}
                                        activeOpacity={.8}
                                    >
                                        <Text style={styles.textBtn}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                areaFlag: false,
                                                areaId: this.state.areaNativeId,
                                                areaName: this.state.areaNativeName,
                                                hospitalArr: [],
                                                hospitalId: '',
                                                hospitalName: '全部',
                                            });
                                            this.hospitalData(this.state.areaNativeId);
                                        }}
                                        activeOpacity={.8}
                                    >
                                        <Text style={styles.textBtn}>确定</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <FlatList
                                style={styles.singleFlatList}
                                data={this.state.areaArr}
                                initialNumToRender={20}
                                keyExtractor={item => item.id}
                                renderItem={({item}) => this.areaRender(item)}
                                ItemSeparatorComponent={() => {
                                    return (
                                        <View style={{
                                            borderTopWidth: Pixel,
                                            borderTopColor: '#D6E1E8'
                                        }}></View>
                                    )
                                }}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity> : null
                }
                {this.state.hospitalFlag ?
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                hospitalFlag: false,
                            })
                        }}
                        style={styles.feeClick}
                    >
                        <TouchableOpacity
                            onPress={() => {
                            }}
                            activeOpacity={1}
                            style={styles.MaskClick}
                        >
                            <View style={styles.titleContent}>
                                <View style={styles.titleBtn}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({hospitalFlag: false})
                                        }}
                                        activeOpacity={.8}
                                    >
                                        <Text style={styles.textBtn}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                hospitalFlag: false,
                                                hospitalId: this.state.hospitalActiveId,
                                                hospitalName: this.state.hospitalActiveName,
                                            })
                                        }}
                                        activeOpacity={.8}
                                    >
                                        <Text style={styles.textBtn}>确定</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <FlatList
                                style={styles.singleFlatList}
                                data={this.state.hospitalArr}
                                initialNumToRender={20}
                                keyExtractor={item => item.id}
                                renderItem={({item}) => this.hospitalRender(item)}
                                ItemSeparatorComponent={() => {
                                    return (
                                        <View style={{
                                            borderTopWidth: Pixel,
                                            borderTopColor: '#D6E1E8'
                                        }}></View>
                                    )
                                }}
                                ListEmptyComponent={() => {
                                    return (
                                        <View style={styles.noDataSelectBox}>
                                            <Text style={styles.noDataSeclectText}>暂无数据</Text>
                                        </View>
                                    )
                                }}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity> : null
                }
                <Toast
                    ref='toast'
                    style={{backgroundColor: '#333', borderRadius: 10,}}
                    position={'center'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeInDuration={2000}
                    opacity={.8}
                />
            </View>
        );
    }

    feeRender = (item) => {
        let style = {color: Colors.selectText, backgroundColor: '#fff'};
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        // fee: item.id,
                        // feeFlag: false,
                        feeActiveId: item.id,
                    })
                }}
                activeOpacity={.8}
            >
                <Text style={[styles.optionText, this.state.feeActiveId === item.id ? style : null]}>{item.fee}</Text>
            </TouchableOpacity>
        )
    };
    areaRender = (item) => {
        let style = {color: Colors.selectText, backgroundColor: '#fff'};
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        // areaId: item.id,
                        // areaName: item.cityName,
                        // areaFlag: false,
                        // isLoading: false,
                        areaNativeId: item.id,
                        areaNativeName: item.cityName,
                    });
                    // this.hospitalData(item.id);
                }}
                activeOpacity={.8}
            >
                <Text
                    style={[styles.optionText, this.state.areaNativeId === item.id ? style : null]}>{item.cityName}</Text>
            </TouchableOpacity>
        )
    };
    hospitalRender = (item) => {
        let style = {color: Colors.selectText, backgroundColor: '#fff'};
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        hospitalActiveId: item.id,
                        hospitalActiveName: item.hospitalName,

                    });
                }}
                activeOpacity={.8}
            >
                <Text
                    style={[styles.optionText, this.state.hospitalActiveId === item.id ? style : null]}>{item.hospitalName}</Text>
            </TouchableOpacity>
        )
    };

    // 通过地区获取医院
    hospitalData(areaId) {
        let formData = new FormData();
        formData.append("areaId", areaId);
        formData.append("deptId", this.state.departmentId);
        console.log(formData);
        fetch(requestUrl.selectHospitalByCity, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData)
                if (responseData.status === '0') {
                    responseData.cityHospitalBeanList.unshift({'hospitalName': '全部', 'id': ''})
                    this.setState({
                        hospitalArr: responseData.cityHospitalBeanList,
                        hospitalActiveId: responseData.cityHospitalBeanList[0].id,
                        hospitalActiveName: responseData.cityHospitalBeanList[0].hospitalName,
                    })
                } else {
                    this.setState({
                        hospitalArr: [],
                        hospitalActiveId: '',
                        hospitalActiveName: '',
                    })
                }
            })
            .catch(
                (error) => {
                    console.log(error)
                    // this.refs.toast.show('未搜到相关内容');
                });
    }


    submit() {
        if (this.state.fee === '') {
            this.refs.toast.show('请选择诊费');
        } else {
            let alertStr = `地区-${this.state.areaName};医院-${this.state.hospitalName};会诊科室：${this.state.departmentName};诊费：${this.state.fee}`;
            Alert.alert('请确认', alertStr, [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确认', onPress: () => {
                    this.setState({isLoading: true});
                    let formData = new FormData();
                    formData.append("patientName", this.state.patientName);//患者姓名
                    formData.append("phone", this.state.phone);//患者电话
                    formData.append("diseaseId", this.state.diseaseId);//疾病id
                    formData.append("departmentId", this.state.departmentId);//科室id
                    formData.append("consultationReason", this.state.consultationReason);//会诊目的
                    formData.append("hospitalId", this.state.hospitalId);//医院id
                    formData.append("areaId", this.state.areaId);//地区id
                    formData.append("fee", this.state.fee);//费用
                    let temp = this.state.caseImgUrlArr;
                    for (let i = 0; i < temp.length; i++) {
                        let caseImg = {
                            uri: temp[i],
                            type: 'multipart/form-data',
                            name: `caseImg${i}`
                        };
                        formData.append("file", caseImg);//费用
                    }
                    console.log(formData);
                    fetch(requestUrl.addConsultation, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((responseData) => {
                            console.log('responseData', responseData);
                            this.setState({isLoading: false});
                            if (responseData.status === '0') {
                                this.props.navigation.navigate('FoundSuccess');
                            } else {
                                this.refs.toast.show('添加失败');
                            }
                        })
                        .catch(
                            (error) => {
                                this.setState({isLoading: false});
                                this.refs.toast.show('添加失败');
                            });
                }
                },
            ])

        }


    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#efefef',
        flex: 1,
    },
    // 选择数据
    selectBox: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(50),
        marginTop: px2dp(9),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        backgroundColor: '#fff'
    },
    selectText: {
        width: px2dp(78),
        paddingLeft: px2dp(3.5),
        fontSize: FONT_SIZE(16),
        color: '#212121',
    },
    selectClick: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,
        width: SCREEN_WIDTH * .7,
        height: px2dp(50),
    },
    selectInput: {
        flex: 1,
        height: px2dp(50),
        marginRight: px2dp(6),
        color: '#212121',
        fontSize: FONT_SIZE(16),
        textAlign: 'right',
    },
    arrowRightImg: {
        marginRight: px2dp(10),
    },
//展示块
    exhibitionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: px2dp(50),
        marginTop: px2dp(9),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        backgroundColor: '#fff',
    },
    exhibitionTitle: {
        paddingLeft: px2dp(3.5),
        fontSize: FONT_SIZE(16),
        color: '#212121',
    },
    exhibitionText: {
        textAlign: 'right',
        width: px2dp(250),
        marginRight: px2dp(23),
        fontSize: FONT_SIZE(16),
        color: '#c7c7cd',
    },
    feeClick: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,.2)',
        height: SCREEN_HEIGHT,
    },
    MaskClick: {
        position: 'absolute',
        bottom: px2dp(0),
        left: 0,
        height: px2dp(250),
    },
    titleContent: {
        width: SCREEN_WIDTH,
    },
    titleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: px2dp(50),
        backgroundColor: '#fff',
    },
    textBtn: {
        fontSize: FONT_SIZE(16),
        paddingLeft: px2dp(30),
        paddingRight: px2dp(30),
        paddingTop: px2dp(16),
        paddingBottom: px2dp(16),
        color: Colors.selectText,
    },
    singleFlatList: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: px2dp(200),
        backgroundColor: '#eeeeee',
        borderTopWidth: Pixel,
        borderTopColor: '#eee',
    },
    optionText: {
        flex: 1,
        textAlign: 'center',
        fontSize: FONT_SIZE(16),
        paddingTop: px2dp(16),
        paddingBottom: px2dp(16),
        color: '#757575',
    },
    // 无数据模块
    noDataSelectBox: {
        height: px2dp(200),
        alignItems: 'center',
        justifyContent: 'center',
    },
    noDataSeclectText: {
        fontSize: FONT_SIZE(16),
        color: Colors.placeholder,
    },
});
