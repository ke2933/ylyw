import React, {
    Component
} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    BackHandler,
    Keyboard,
} from 'react-native';

import {
    requestUrl
} from '../../Network/url'; //接口url
import {
    RegExp
} from '../../Network/RegExp'; //
import Nav from '../../common/Nav'; //导航
import Button from '../../common/Button'; //按钮
import UploadPhoto from '../../common/UploadPhoto'; //相机拍照
import Toast, {
    DURATION
} from 'react-native-easy-toast'; //弱提示
import {
    Global
} from './../../common/Global';
import Loading from "../../common/Loading";
import px2dp from "../../common/Tool";

export default class Launch extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            patientName: "", //患者姓名
            phone: "", //患者电话
            diseaseId: "", //疾病id
            departmentId: "", //科室id
            consultationReason: "", //会诊目的
            caseImgUrlArr: [], //图片Url数组
            departmentName: '', //科室名字
            diseaseName: '', //疾病名字
            textareaHeight: 100,
            departmentFlag: false,
            firstArr: [],
            isLoading: true,
            secondArr: [],
            firstId: '',
            secondId: '',
            secondName: '',
            keyHeight: 0,
            scrollY: 0,
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
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }


    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow(e) {
        this.setState({
            keyHeight: Math.ceil(e.endCoordinates.height),
        })
    }

    _keyboardDidHide() {
        this.setState({
            keyHeight: 0,
        })
    }

    //获取数据
    componentDidMount() {
        fetch(requestUrl.selectDepartment)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '10') {
                    this.props.navigation.navigate('Login');
                } else {
                    this.setState({
                        departmentName: responseData.deptName,
                        secondName: responseData.deptName,
                        departmentId: responseData.id,
                        firstId: responseData.parentId,
                        secondId: responseData.id,
                    })
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
        fetch(requestUrl.medicalRecordDept)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({
                    isLoading: false,
                });
                if (responseData.status === '0') {
                    this.setState({
                        firstArr: responseData.baseDeptList,
                    })
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
    }

    render() {
        const {
            navigate,
            goBack
        } = this.props.navigation;
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
                         Alert.alert('', '会诊病历还未填完', [
                             {
                                 text: '放弃填写', onPress: () => {
                                     RouteName.pop();
                                     goBack();
                                 }
                             },
                             {
                                 text: '继续填写', onPress: () => {
                                 }
                             },
                         ], {cancelable: false})

                     }}
                     data={{
                         'leftBtn': true,
                         'title': '发起会诊',
                         'rightBtn': {type: 'false',}
                     }}/>
                <View
                    style={{height: SCREEN_HEIGHT - 65 - this.state.keyHeight}}
                    // onLayout={(e) => {
                    //     console.log(e.nativeEvent);
                    //     // this.state.scrollFlag ? this.refs._scroll.scrollTo({x: 0, y: 350, animated: true}) : null;
                    //     this.state.scrollFlag ? this.refs._scroll.scrollToEnd() : null;
                    // }}
                >
                    <ScrollView
                        ref='_scroll'
                        // onScroll={(event)=>{
                        //     console.log(event.nativeEvent.contentOffset.x);//水平滚动距离
                        //     console.log(event.nativeEvent.contentOffset.y)//垂直滚动距离
                        // }}
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View style={styles.titleBox}>
                            <Text style={styles.title}>基本信息</Text>
                        </View>
                        <View style={styles.content}>
                            <View style={[styles.dataBox, {borderBottomWidth: Pixel,}]}>
                                <Text style={styles.dataText}>患者姓名</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={'填写姓名'}
                                    placeholderTextColor={'#c7c7cd'}
                                    onChangeText={(text) => this.setState({patientName: text})}
                                    underlineColorAndroid={'transparent'}
                                    onBlur={this.patientNameReg.bind(this)}
                                />

                            </View>
                            <View style={styles.dataBox}>
                                <Text style={styles.dataText}>手机号码</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={'填写手机号码'}
                                    placeholderTextColor={'#c7c7cd'}
                                    onChangeText={(text) => this.setState({phone: text})}
                                    underlineColorAndroid={'transparent'}
                                    onBlur={this.phoneReg.bind(this)}
                                />

                            </View>
                        </View>
                        <View style={styles.titleBox}>
                            <Text style={styles.title}>疾病信息</Text>
                        </View>
                        <View style={styles.content}>
                            <View style={[styles.selectBox, {borderBottomWidth: Pixel,}]}>
                                <Text style={styles.selectText}>会诊科室</Text>
                                <TextInput
                                    style={styles.selectInput}
                                    placeholder={'请选择科室'}
                                    placeholderTextColor={'#c7c7cd'}
                                    defaultValue={this.state.departmentName}
                                    underlineColorAndroid={'transparent'}
                                />
                                <Image style={styles.arrowRightImg}
                                       source={require('../../images/arrow_gray_right.png')}/>
                                <TouchableOpacity
                                    style={styles.selectClick}
                                    onPress={() => {
                                        this.selectClick()
                                    }}
                                    activeOpacity={0.8}
                                >
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.selectBox]}>
                                <Text style={styles.selectText}>疾病名称</Text>
                                <TextInput
                                    style={styles.selectInput}
                                    placeholder={'填写疾病名称'}
                                    placeholderTextColor={'#c7c7cd'}
                                    defaultValue={this.state.diseaseName}
                                    underlineColorAndroid={'transparent'}
                                />
                                <Image style={styles.arrowRightImg}
                                       source={require('../../images/arrow_gray_right.png')}/>
                                <TouchableOpacity
                                    style={styles.selectClick}
                                    onPress={() => navigate('Search', {
                                            "api": 'likeDisease',
                                            "deptId": this.state.departmentId,
                                            "callback": (data) => {
                                                this.setState({
                                                    diseaseName: data.illnessName,
                                                    diseaseId: data.id
                                                })
                                            }
                                        }
                                    )}
                                    activeOpacity={0.8}
                                >
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.titleBox}>
                            <Text style={styles.title}>会诊病历及附件拍照</Text>
                        </View>
                        <View style={styles.content}>
                            <View style={styles.imgBox}>
                                {this.renderCaseImg()}
                                <UploadPhoto
                                    type={'big'}
                                    changeImg={(data) => {
                                        this.caseImgUrl(data)
                                    }}
                                />
                            </View>
                        </View>
                        <View
                            style={styles.titleBox}
                            onLayout={(e) => {
                                this.setState({
                                    scrollY: e.nativeEvent.layout.y,
                                })
                            }}
                        >
                            <Text style={styles.title}>会诊目的及备注</Text>
                        </View>
                        <View style={styles.textareaBox}>
                            <TextInput
                                style={[styles.textareaStyle, {minHeight: 100, maxHeight: SCREEN_HEIGHT * .3}]}
                                placeholder={'您更希望解决哪些问题？写下您想说的话，与会诊医生更畅快的沟通…'}
                                placeholderTextColor={'#c7c7cd'}
                                multiline={true}
                                onChangeText={(text) => this.setState({consultationReason: text.replace(/(^\s*)|(\s*$)/g, "")})}
                                onContentSizeChange={this.onContentSizeChange.bind(this)}
                                underlineColorAndroid={'transparent'}
                                onBlur={this.onContentSizeChangeReg.bind(this)}
                                onFocus={() => {
                                   this.refs._scroll.scrollTo({
                                        x: 0,
                                        y: this.state.scrollY,
                                        animated: true
                                    })
                                }}
                            />
                        </View>
                        <Button text={'下一步'} click={this.submit.bind(this)}/>
                    </ScrollView>
                </View>
                <Toast
                    ref='toast'
                    style={{backgroundColor: '#333333', borderRadius: 10,}}
                    position={'top'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeInDuration={1000}
                    opacity={.8}
                />
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
                                <Text style={styles.deptTitleText}>选择意向会诊科室</Text>
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
                                {/*diseaseId: '',*/}
                                {/*diseaseName: '',*/}
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

    selectClick() {
        Keyboard.dismiss();
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
    }


    firstRender = (item) => {
        let styleView = {
            backgroundColor: '#fff',
            borderRightColor: '#fff',
            borderBottomWidth: px2dp(5),
            borderTopWidth: px2dp(5),
            borderBottomColor: '#325ceb',
            borderTopColor: 'transparent',
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
        let styleView = {
            backgroundColor: '#fff'
        };
        let styleText = {
            color: Colors.selectText
        };
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        departmentId: item.id,
                        departmentName: item.deptName,
                        secondId: item.id,
                        secondName: item.deptName,
                        diseaseId: '',
                        diseaseName: '',
                    });
                    setTimeout(() => {
                        this.setState({
                            departmentFlag: false,
                        })
                    }, 300)
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

    // 多行输入高度处理
    onContentSizeChange(event) {
        this.setState({
            textareaHeight: event.nativeEvent.contentSize.height,
        })
    }

    // 验证患者姓名
    patientNameReg() {
        if (this.state.patientName === '') {
            this.refs.toast.show('请输入患者姓名');
            return;
        }
        if (!RegExp.Reg_Name.test(this.state.patientName)) {
            this.refs.toast.show('请核对患者姓名');
            return;
        }
    }

    // 验证手机号
    phoneReg() {
        if (this.state.phone === '') {
            this.refs.toast.show('请输入手机号');
            return;
        }
        if (!RegExp.Reg_TelNo.test(this.state.phone)) {
            this.refs.toast.show('请核对手机号');
            return;
        }
    }

    // 验证备注信息
    onContentSizeChangeReg() {
        if (this.state.consultationReason === '') {
            this.refs.toast.show('请输入会诊目的及备注');
            return;
        }
    }

    // 处理上传图片路径
    caseImgUrl(data) {
        let temp = this.state.caseImgUrlArr;
        temp.push(data);
        this.setState({
            caseImgUrlArr: temp,
        });
    }

    // 展示上传的图片
    renderCaseImg() {
        let imgArr = this.state.caseImgUrlArr;
        if (imgArr.length >= 0) {
            let Temp = [];
            for (let i = 0; i < imgArr.length; i++) {
                Temp.push(
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('ZoomImg', {data: this.state.caseImgUrlArr, index: i});
                        }}
                        key={i}
                        activeOpacity={.8}
                        style={{paddingTop: px2dp(8), marginTop: -px2dp(8)}}
                    >
                        <View style={styles.caseItemBox}>
                            <Image style={styles.caseItemImg} source={{uri: imgArr[i]}}/>
                            <TouchableOpacity
                                onPress={this.deleteCaseImg.bind(this, i)}
                                activeOpacity={.8}
                                style={styles.deleteClick}
                            >
                                <Image style={styles.deleteImg} source={require('../../images/delete_img.png')}/>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )
            }
            return Temp;
        } else {
            return null;
        }


    }

    //删除图片
    deleteCaseImg(index) {
        let temp = this.state.caseImgUrlArr;
        temp.splice(index, 1);
        this.setState({
            caseImgUrlArr: temp,
        })
    }

    // 提交事件
    submit() {
        if (this.state.patientName === '') {
            this.refs.toast.show('请输入患者姓名');
            return;
        }
        if (!RegExp.Reg_Name.test(this.state.patientName)) {
            this.refs.toast.show('请核对患者姓名');
            return;
        }
        if (this.state.phone === '') {
            this.refs.toast.show('请输入手机号');
            return;
        }
        if (!RegExp.Reg_TelNo.test(this.state.phone)) {
            this.refs.toast.show('请核对手机号');
            return;
        }
        if (this.state.diseaseName === '') {
            this.refs.toast.show('请选填疾病');
            return;
        }
        if (this.state.caseImgUrlArr.length <= 0) {
            this.refs.toast.show('请上传病历及附件');
            return;
        }
        if (this.state.consultationReason === '') {
            this.refs.toast.show('请输入会诊目的');
            return;
        } else {
            this.props.navigation.navigate('SelectHospital', {
                data: this.state
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    //title
    titleBox: {
        height: px2dp(35),
        justifyContent: 'center',
        paddingLeft: px2dp(19),
    },
    title: {
        fontSize: FONT_SIZE(14),
        color: '#898989',
    },
    // 数据块
    content: {
        backgroundColor: "#fff",
    },
    // 输入数据
    dataBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(50),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderBottomColor: '#D6E1E8',
    },
    dataText: {
        width: px2dp(78),
        paddingLeft: px2dp(3.5),
        color: '#333333',
        fontSize: FONT_SIZE(16),
    },
    textInput: {
        flex: 1,
        fontSize: FONT_SIZE(16),
    },
    // 选择数据
    selectBox: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(50),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderBottomColor: '#D6E1E8',
    },
    selectText: {
        width: px2dp(78),
        paddingLeft: px2dp(3.5),
        fontSize: FONT_SIZE(16),
        color: '#333333',
    },
    selectClick: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,
        width: SCREEN_WIDTH,
        height: px2dp(50),
    },
    selectInput: {
        flex: 1,
        height: px2dp(50),
        marginRight: px2dp(6),
        color: '#333333',
        fontSize: FONT_SIZE(16),
    },
    arrowRightImg: {
        marginRight: px2dp(10),
    },
    // 图片数据块
    imgBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: px2dp(15),
        paddingLeft: px2dp(19),
        paddingRight: px2dp(19),
    },
    // 病理图片
    caseItemBox: {
        position: 'relative',
        marginRight: px2dp(15),
        width: px2dp(60),
        height: px2dp(60),
        marginBottom: px2dp(15),
    },
    caseItemImg: {
        width: px2dp(60),
        height: px2dp(60),
        borderRadius: px2dp(4),
    },
    deleteClick: {
        position: 'absolute',
        top: -px2dp(8),
        right: -px2dp(8),
        zIndex: 1,
        backgroundColor: '#fff',
        borderRadius: px2dp(10),
    },

    // 多行输入块
    textareaBox: {
        backgroundColor: '#fff',
    },
    textareaStyle: {
        margin: 0,
        paddingTop: px2dp(15),
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        paddingBottom: px2dp(15),
        fontSize: FONT_SIZE(16),
        color: '#333',
        textAlignVertical: 'top',
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
    MaskClick: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: px2dp(250),
    },
    titleContent: {
        width: SCREEN_WIDTH,
        height: px2dp(50),
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
    departmentText: {
        fontSize: FONT_SIZE(16),
        // paddingTop: px2dp(16),
        // paddingLeft: px2dp(30),
        // paddingBottom: px2dp(16),
        color: '#757575',
    },
    secondView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: px2dp(44),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
    },
    pickerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(445),
        width: SCREEN_WIDTH,
        backgroundColor: '#fff',
        borderTopWidth: Pixel,
        borderTopColor: '#eee',
    },
    pickerFlatList: {
        flex: 1,
        height: px2dp(445),
        width: SCREEN_WIDTH / 2,
        backgroundColor: '#eee',
    },
    departmentView: {
        justifyContent: 'center',
        height: px2dp(44),
        paddingLeft: px2dp(15),
        borderRightColor: '#bdbdbd',
        borderRightWidth: px2dp(1),
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