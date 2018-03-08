import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    TextInput,
    FlatList,
    BackHandler,
    ToastAndroid,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import Button from '../../common/Button';//按钮
import Nav from '../../common/Nav';//导航
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import px2dp from "../../common/Tool";

export default class AttestationOne extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            // oauthFlag: false,// 是否有认证信息
            hospitalId: '',//医院id
            hospitalName: '',//医院名字
            departmentId: "",//科室id
            departmentName: "",//科室名字
            titleId: '',//职称id
            titleName: '',
            doctorIdcard: '',//医生身份证
            doctorName: '',//真实姓名
            sexStyle: false,
            sex: '－',
            department: [],//科室列表
            titleArr: [],
            optionArr: [],
            titleFlag: false,
            departmentFlag: false,
            firstArr: [],
            secondArr: [],
            isLoading: false,
            titleActiveId: '',
            titleActiveName: '',
            firstId: '',
            secondId: '',
            secondName: '',
            loadingText: '',
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
        fetch(requestUrl.firstOauthQuery)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '0') {
                    this.setState({
                        // oauthFlag: true,
                        departmentName: responseData.departmentName,
                        hospitalName: responseData.hospitalName,
                        doctorIdcard: responseData.idCard,
                        doctorName: responseData.name,
                        sex: responseData.sex,
                        titleName: responseData.titleName,
                        hospitalId: responseData.hospitalId,
                        departmentId: responseData.deptId,
                        titleId: responseData.titleId,
                        sexStyle: true,
                    });
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
        // 科室选择列表接口
        fetch(requestUrl.department)
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status === '10') {
                    console.log(this);
                    this.props.navigation.navigate('Login');
                } else if (responseData.status === '0') {
                    // 数据处理
                    this.setState({
                        firstArr: responseData.baseDeptList,
                        firstId: responseData.baseDeptList[0].id,
                        secondArr: responseData.baseDeptList[0].baseDeptList,
                        // secondId: responseData.baseDeptList[0].baseDeptList[0].id,
                        // secondName: responseData.baseDeptList[0].baseDeptList[0].deptName,
                    })
                }
                console.log('responseData', responseData);
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
        //  职称选择列表接口
        fetch(requestUrl.title)
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status === '0') {
                    // 数据处理
                    this.setState({
                        titleArr: responseData.lists,
                        titleActiveId: responseData.lists[0].id,
                        titleActiveName: responseData.lists[0].doctorTitleName
                    })
                }
                console.log(responseData);
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                {this.state.isLoading ? <Loading text={this.state.loadingText}/> : null}
                <StatusBar//状态栏
                    animated={true}//是否动画
                    hidden={false}//是否隐藏
                    backgroundColor={'#000'}//android 设置状态栏背景颜色
                    translucent={false}//android 设置状态栏是否为透明
                    showHideTransition="fade"//IOS状态栏改变时动画 fade:默认 slide
                    networkActivityIndicatorVisible={this.state.isLoading}//IOS设定网络活动指示器(就是那个菊花)是否显示在状态栏。
                    statusBarStyle={"default"}//ios:白底黑字  android:黑底白字
                />
                <Nav navigation={this.props.navigation} data={{
                    'leftBtn': false,
                    'title': '医师认证',
                    rightBtn: {type: 'nav', navText: '稍后认证', 'btnNav': 'Home'}
                }}/>
                <ScrollView
                    keyboardShouldPersistTaps={'handled'}
                >
                    <View style={styles.textContent}>
                        <View style={[styles.textBox, {borderBottomWidth: Pixel,}]}>
                            <Text style={styles.text}>真实姓名</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'请输入真实姓名'}
                                placeholderTextColor={'#c7c7cd'}
                                onChangeText={(text) => this.setState({doctorName: text})}
                                underlineColorAndroid={'transparent'}
                                onBlur={this.doctorNameReg.bind(this)}
                                defaultValue={this.state.doctorName}
                            />
                        </View>
                        <View style={[styles.textBox, {borderBottomWidth: Pixel,}]}>
                            <Text style={styles.text}>身份证号</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'请输入身份证号'}
                                placeholderTextColor={'#c7c7cd'}
                                onChangeText={(text) => this.setState({doctorIdcard: text})}
                                underlineColorAndroid={'transparent'}
                                onBlur={this.doctorIdcardReg.bind(this)}
                                keyboardType={'numeric'}
                                defaultValue={this.state.doctorIdcard}
                            />
                        </View>
                        <View style={styles.textBox}>
                            <Text style={styles.text}>性别</Text>
                            <Text
                                style={[{color: this.state.sexStyle ? '#333' : '#c7c7cd'}, styles.sexText]}>{this.state.sex}</Text>
                        </View>
                    </View>
                    <View style={styles.selectContent}>
                        <View style={[styles.selectBox, {borderBottomWidth: Pixel,}]}>
                            <Text style={styles.text}>所在医院</Text>
                            <TextInput
                                style={styles.selectInput}
                                placeholder={'请选择所在医院'}
                                placeholderTextColor={'#c7c7cd'}
                                onChangeText={(text) => this.setState({hospitalName: text})}
                                defaultValue={this.state.hospitalName}
                                underlineColorAndroid={'transparent'}
                                onBlur={this.doctorIdcardReg.bind(this)}
                            />
                            <Image style={styles.arrowRightImg}
                                   source={require('../../images/arrow_gray_right.png')}/>
                            <TouchableOpacity
                                style={styles.selectClick}
                                onPress={this.hospital.bind(this)}
                                activeOpacity={0.8}
                            >
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.selectBox, {borderBottomWidth: Pixel,}]}>
                            <Text style={styles.text}>所在科室</Text>
                            <TextInput
                                style={styles.selectInput}
                                placeholder={'请选择'}
                                placeholderTextColor={'#c7c7cd'}
                                onChangeText={(text) => this.setState({departmentName: text})}
                                underlineColorAndroid={'transparent'}
                                defaultValue={this.state.departmentName}
                                onBlur={this.doctorIdcardReg.bind(this)}
                            />
                            <Image style={styles.arrowRightImg}
                                   source={require('../../images/arrow_gray_right.png')}/>
                            <TouchableOpacity
                                style={styles.selectClick}
                                onPress={() => {
                                    this.selectClick('department');
                                }}
                                activeOpacity={0.8}
                            >
                            </TouchableOpacity>

                        </View>
                        <View style={styles.selectBox}>
                            <Text style={styles.text}>职称</Text>
                            <TextInput
                                style={styles.selectInput}
                                placeholder={'请选择'}
                                placeholderTextColor={'#c7c7cd'}
                                onChangeText={(text) => this.setState({titleName: text})}
                                defaultValue={this.state.titleName}
                                underlineColorAndroid={'transparent'}
                                onBlur={this.doctorIdcardReg.bind(this)}
                            />
                            <Image style={styles.arrowRightImg}
                                   source={require('../../images/arrow_gray_right.png')}/>
                            <TouchableOpacity
                                style={styles.selectClick}
                                onPress={() => {
                                    this.selectClick('title');
                                }}
                                activeOpacity={0.8}
                            >
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Button text={'下一步'} click={this.addDoctorTwo.bind(this)}/>
                </ScrollView>
                <Toast
                    ref='toast'
                    style={{backgroundColor: '#333333', borderRadius: 10,}}
                    position={'center'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeInDuration={1000}
                    opacity={.8}
                />
                {this.state.titleFlag ?
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                titleFlag: false,
                            })
                        }}
                        style={styles.titleClick}
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
                                            this.setState({titleFlag: false})
                                        }}
                                        activeOpacity={.8}
                                    >
                                        <Text style={styles.textBtn}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                titleId: this.state.titleActiveId,
                                                titleName: this.state.titleActiveName,
                                                titleFlag: false,
                                            })
                                        }}
                                        activeOpacity={.8}
                                    >
                                        <Text style={styles.textBtn}>确定</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <FlatList
                                style={styles.titleFlatList}
                                data={this.state.titleArr}
                                initialNumToRender={20}
                                keyExtractor={item => item.id}
                                renderItem={({item}) => this.titleRender(item)}
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
                {this.state.departmentFlag ?
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({departmentFlag: false})
                        }}
                        style={styles.titleClick}
                    >
                        <TouchableOpacity
                            onPress={() => {
                            }}
                            activeOpacity={1}
                            style={{
                                position: 'absolute',
                                bottom: 0, left: 0,
                            }}
                        >
                            <View style={styles.deptTitle}>
                                <Text style={styles.deptTitleText}>选择您所在科室</Text>
                                {/*<View style={styles.titleBtn}>*/}
                                {/*<TouchableOpacity*/}
                                {/*onPress={() => {*/}
                                {/*this.setState({departmentFlag: false})*/}
                                {/*}}*/}
                                {/*activeOpacity={.8}*/}
                                {/*>*/}
                                {/*<Text style={styles.textBtn}>取消</Text>*/}
                                {/*</TouchableOpacity>*/}
                                {/*<TouchableOpacity*/}
                                {/*onPress={() => {*/}
                                {/*this.setState({*/}
                                {/*departmentFlag: false,*/}
                                {/*departmentId: this.state.secondId,*/}
                                {/*departmentName: this.state.secondName,*/}
                                {/*})*/}
                                {/*}}*/}
                                {/*activeOpacity={.8}*/}
                                {/*>*/}
                                {/*<Text style={styles.textBtn}>确定</Text>*/}
                                {/*</TouchableOpacity>*/}
                                {/*</View>*/}
                            </View>
                            <View style={styles.pickerContent}>
                                <FlatList
                                    style={styles.pickerFlatList}
                                    data={this.state.firstArr}
                                    initialNumToRender={20}
                                    keyExtractor={item => item.id}
                                    renderItem={({item}) => this.firstRender(item)}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={{
                                                borderTopWidth: Pixel,
                                                borderTopColor: '#D6E1E8'
                                            }}></View>
                                        )
                                    }}
                                />
                                <FlatList
                                    style={[styles.pickerFlatList, {backgroundColor: '#fff'}]}
                                    data={this.state.secondArr}
                                    initialNumToRender={20}
                                    keyExtractor={item => item.id}
                                    renderItem={({item}) => this.secondRender(item)}
                                />
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity> : null
                }

            </View>

        );
    }

    titleRender = (item) => {
        let key = '';
        let id = '';
        for (let k in item) {
            if (k === 'id') {
                id = k;
            } else {
                key = k;
            }
        }
        let style = {color: Colors.selectText, backgroundColor: '#fff'};
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        // titleId: item[id],
                        // titleName: item[key],
                        titleActiveName: item[key],
                        titleActiveId: item[id],
                    })
                }}
                activeOpacity={.8}
            >
                <Text
                    style={[styles.optionText, this.state.titleActiveId === item[id] ? style : null]}>{item[key]}</Text>
            </TouchableOpacity>
        )
    };

    firstRender = (item) => {
        let styleView = {
            backgroundColor: '#fff',
            borderRightColor: '#fff',
            borderBottomWidth: px2dp(5),
            borderTopWidth: px2dp(5),
            borderTopColor: 'transparent',
            borderBottomColor: '#325ceb',
        };
        let styleText = {
            color: Colors.selectText,
        };
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
                <View style={[styles.departmentView, this.state.firstId === item.id ? styleView : null,]}>
                    <Text
                        style={[styles.departmentText, this.state.firstId === item.id ? styleText : null]}>{item.deptName}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    secondRender = (item) => {
        let styleView = {backgroundColor: '#fff'};
        let styleText = {color: Colors.selectText};
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        departmentId: item.id,
                        departmentName: item.deptName,
                        secondId: item.id,
                        secondName: item.deptName,
                    });
                    setTimeout(()=>{
                       this.setState({
                           departmentFlag: false,
                       })
                    },300)
                }}
                key={item.id}
                activeOpacity={.8}
            >
                <View style={[styles.secondView, this.state.secondId === item.id ? styleView : null]}>
                    <Text
                        style={[styles.departmentText, this.state.secondId === item.id ? styleText : null]}>{item.deptName}</Text>
                    {this.state.secondId === item.id ? <Image source={require('../../images/pushpin.png')}/> : null}
                </View>
            </TouchableOpacity>
        )
    };


    selectClick(type) {
        if (type === 'title') {
            this.setState({
                titleFlag: true,
                departmentFlag: false,
            })
        } else if (type === 'department') {
            this.setState({
                departmentFlag: true,
                titleFlag: false,
            })
        }
    }

    hospital() {
        this.props.navigation.navigate('Search', {
            "api": 'likeFindHospital',
            "callback": (data) => {
                this.setState({
                    hospitalName: data.hospitalName,
                    hospitalId: data.id
                })
            }
        });
    }

    //验证名字
    doctorNameReg() {
        if (this.state.doctorName === '') {
            this.refs.toast.show('请输入真实姓名');
            return;
        }
        if (!RegExp.Reg_Name.test(this.state.doctorName)) {
            this.refs.toast.show('请输入真实姓名');
            return;
        }
    }

    // 验证身份证号
    doctorIdcardReg() {

        if (this.state.doctorIdcard === '') {
            this.refs.toast.show('请输入身份证号');
            return;
        }
        if (!RegExp.Reg_IDCardNo.test(this.state.doctorIdcard)) {
            this.refs.toast.show('身份证格式不正确');
        } else {
            // 判断性别
            let Id = this.state.doctorIdcard;
            if (Id.length > 15) {
                let N = Id.substring(Id.length - 2, Id.length - 1);
                if (N % 2 === 1) {
                    this.setState({
                        sexStyle: true,
                        sex: '男',
                    })
                } else {
                    this.setState({
                        sexStyle: true,
                        sex: '女',
                    })
                }
            } else {
                let N = Id.substring(Id.length - 1, Id.length);
                if (N % 2 === 1) {
                    this.setState({
                        sexStyle: true,
                        sex: '男',
                    })
                } else {
                    this.setState({
                        sexStyle: true,
                        sex: '女',
                    })
                }
            }
        }

    }

    // 提交事件
    addDoctorTwo() {
        // if (this.state.oauthFlag) {
        //     this.props.navigation.navigate('AttestationTwo');
        // } else {
        //验证姓名
        if (this.state.doctorName === '') {
            this.refs.toast.show('请输入真实姓名');
            return;
        }
        if (!RegExp.Reg_Name.test(this.state.doctorName)) {
            this.refs.toast.show('请输入真实姓名');
            return;
        }
        // 验证身份证
        if (this.state.doctorIdcard === '') {
            this.refs.toast.show('请输入身份证号');
            return;
        }
        if (!RegExp.Reg_IDCardNo.test(this.state.doctorIdcard)) {
            this.refs.toast.show('身份证格式不正确');
        } else {
            // 判断性别
            let Id = this.state.doctorIdcard;
            if (Id.length > 15) {
                let N = Id.substring(Id.length - 2, Id.length - 1);
                if (N % 2 === 1) {
                    this.setState({
                        sexStyle: true,
                        sex: '男',
                    })
                } else {
                    this.setState({
                        sexStyle: true,
                        sex: '女',
                    })
                }
            } else {
                let N = Id.substring(Id.length - 1, Id.length);
                if (N % 2 === 1) {
                    this.setState({
                        sexStyle: true,
                        sex: '男',
                    })
                } else {
                    this.setState({
                        sexStyle: true,
                        sex: '女',
                    })
                }
            }
        }
        if (this.state.hospitalId === '') {
            this.refs.toast.show('请填写医院');
        }
        if (this.state.departmentId === '') {
            this.refs.toast.show('请选择科室');
        }
        if (this.state.titleId === '') {
            this.refs.toast.show('请选择职称');
        } else {
            this.setState({isLoading: true, loadingText: '上传中...'});
            let formData = new FormData();
            formData.append("hospitalId", this.state.hospitalId);//医院ID
            formData.append("hospitalName", this.state.hospitalName);//医院名字
            formData.append("departmentId", this.state.departmentId);//部门id
            formData.append("titleId", this.state.titleId);//职称id
            formData.append("idCard", this.state.doctorIdcard);//医生身份证
            formData.append("doctorName", this.state.doctorName);//真实姓名
            console.log(formData)
            fetch(requestUrl.addDoctorTwo, {
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
                        this.setState({loadingText: '保存成功'});
                        setTimeout(() => {
                            this.setState({isLoading: false});
                            this.props.navigation.navigate('AttestationTwo');
                        }, 1000);
                    } else if (responseData.status === '1') {
                        this.setState({isLoading: false});
                        this.refs.toast.show('提交失败，请重试');
                    } else if (responseData.status === '2') {
                        this.refs.toast.show('身份证输入有误');
                        this.setState({isLoading: false});
                    } else if (responseData.status === '3') {
                        this.setState({isLoading: false});
                        this.refs.toast.show('请选择科室');
                    } else if (responseData.status === '4') {
                        this.setState({isLoading: false});
                        this.refs.toast.show('请选择职称');
                    } else if (responseData.status === '5') {
                        this.setState({isLoading: false});
                        this.refs.toast.show('请填写真实姓名');
                    } else if (responseData.status === '6') {
                        this.setState({isLoading: false});
                        this.refs.toast.show('已认证，请勿重复认证');
                    } else if (responseData.status === '7') {
                        this.setState({isLoading: false});
                        this.refs.toast.show('该身份证已注册');
                    } else {
                        this.setState({isLoading: false});
                        this.refs.toast.show('提交失败，请重新提交');

                    }
                })
                .catch(
                    (error) => {
                        console.log(error);
                        this.setState({isLoading: false});
                        this.refs.toast.show('提交失败，请稍后重新提交');
                    });
        }
    }

    // }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    // 输入块
    textContent: {
        marginTop: px2dp(6),
        backgroundColor: '#fff',
    },
    textBox: {
        flexDirection: 'row',
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: px2dp(66),
        paddingTop: px2dp(10),
        // marginLeft: SCREEN_WIDTH * 0.04,
        borderBottomColor: '#D6E1E8',
    },
    text: {
        color: '#333333',
        fontSize: FONT_SIZE(16),
        paddingLeft: px2dp(15),
    },
    textInput: {
        flex: 1,
        height: px2dp(56),
        textAlign: 'right',
        paddingRight: px2dp(15),
        color: '#333',
        fontSize: FONT_SIZE(16),
    },
    sexText: {
        flex: 1,
        textAlign: 'right',
        paddingRight: px2dp(15),
        justifyContent: 'center',
        fontSize: FONT_SIZE(16),
    },

// 选择块
    selectContent: {
        marginTop: px2dp(6),
        backgroundColor: '#fff',
    },
    selectBox: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: px2dp(66),
        paddingTop: px2dp(10),
        // marginLeft: SCREEN_WIDTH * 0.04,
        borderBottomColor: '#D6E1E8',
    },
    selectClick: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,
        width: SCREEN_WIDTH,
        height: px2dp(56),
    },
    selectInput: {
        flex: 1,
        height: px2dp(56),
        textAlign: 'right',
        marginRight: px2dp(6),
        color: '#333333',
        fontSize: FONT_SIZE(16),
    },
    arrowRightImg: {
        marginRight: px2dp(15),
    },
    // 提交按钮
    btnContent: {
        marginTop: px2dp(76),
        alignItems: 'center',
    },
    btnBox: {
        width: px2dp(200),
        height: px2dp(46),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: px2dp(46),
        backgroundColor: '#566cb7',
    },
    btnText: {
        fontSize: FONT_SIZE(18),
        color: '#fffefe',
        backgroundColor: 'transparent',
    },
    titleClick: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1,
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
    deptTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: px2dp(50),
        backgroundColor: '#fff',
        borderBottomWidth: Pixel,
        borderColor: '#dbdbdb',
    },
    deptTitleText: {
        fontSize: FONT_SIZE(16),
        color: '#757575',
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
    titleFlatList: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        flex: 1,
        width: SCREEN_WIDTH,
        height: px2dp(200),
        backgroundColor: '#eeeeee',
        borderTopWidth: 1,
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
    departmentView: {
        height: px2dp(44),
        justifyContent: 'center',
        paddingLeft: px2dp(15),
        borderRightColor: '#bdbdbd',
        borderRightWidth: px2dp(1),
    },
    secondView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: px2dp(44),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
    },
    departmentText: {
        fontSize: FONT_SIZE(16),
        color: '#757575',

    },
    pickerContent: {
        flexDirection: 'row',
        height: px2dp(445),
        backgroundColor: '#fff',
        borderTopWidth: Pixel,
        borderTopColor: '#eee',
    },
    pickerFlatList: {
        flex: 1,
        width: SCREEN_WIDTH / 2,
        backgroundColor: '#eee',
    },
    departmentClick: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,.2)',
        height: SCREEN_HEIGHT,
    }

});
