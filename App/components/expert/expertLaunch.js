import React, {Component} from 'react';
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
    BackHandler, Keyboard,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//
import Nav from '../../common/Nav';//导航
import Button from '../../common/Button';//按钮
import UploadPhoto from '../../common/UploadPhoto';//相机拍照
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';


export default class Launch extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            patientName: "",//患者姓名
            phone: "",//患者电话
            diseaseId: "",//疾病id
            departmentId: "",//科室id
            deptId: '',
            deptName: "",// 科室名
            consultationReason: "",//会诊目的
            caseImgUrlArr: [],//图片Url数组
            doctorId: '',//医生id
            hospitalId: '',//医院id
            fee: '',//费用
            diseaseName: '',//疾病名字
            cityLable: '',// 受邀医生地区
            isLoading: false,
            loadingText: '',
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

        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params.data;
            this.setState({
                departmentId: data.departmentId,
                deptId: data.departmentId,
                deptName: data.deptName,
                hospitalId: data.hospitalId,
                doctorId: data.doctorId,
                fee: data.fee,
                cityLable: data.cityLable,
            });
        }

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

    }

    render() {
        const {navigate, goBack} = this.props.navigation;
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
                <Nav navigation={this.props.navigation}
                     leftClick={() => {
                         RouteName.pop();
                         goBack()
                     }}
                     data={{
                         'leftBtn': true,
                         'title': '发起会诊',
                         'rightBtn': {type: 'false',}
                     }}/>
                <View style={{height: SCREEN_HEIGHT - 65 - this.state.keyHeight}}>
                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                        ref="_scroll"
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
                                <Text style={styles.showText}>{this.state.deptName}</Text>
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
                                onChangeText={(text) => this.setState({consultationReason: text})}
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

                        <Button text={'发起会诊'} click={this.submit.bind(this)}/>
                    </ScrollView>
                </View>

                <Toast
                    ref='toast'
                    style={{backgroundColor: '#333333', borderRadius: 10,}}
                    position={'top'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeOutDuration={800}
                    fadeInDuration={500}
                    opacity={.8}
                />
            </View>
        );
    }

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
        console.log(this.state.caseImgUrlArr)
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
                            this.props.navigation.navigate('ZoomImg', {data: this.state.caseImgUrlArr, 'index': i});
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
        console.log(index);
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
            this.refs.toast.show('请输入会诊目的及备注');
            return;
        } else {
            this.setState({isLoading: true, loadingText: '创建中...'});
            let formData = new FormData();
            formData.append("patientName", this.state.patientName);//患者姓名
            formData.append("phone", this.state.phone);//患者电话
            formData.append("diseaseId", this.state.diseaseId);//疾病id
            formData.append("departmentId", this.state.departmentId);//科室id
            formData.append("consultationReason", this.state.consultationReason);//会诊目的
            formData.append("hospitalId", this.state.hospitalId);//医院id
            formData.append("doctorId", this.state.doctorId);//受邀医生id
            formData.append("fee", this.state.fee);//费用
            formData.append("areaId", this.state.cityLable);//费用
            let temp = this.state.caseImgUrlArr;
            for (let i = 0; i < temp.length; i++) {
                let caseImg = {
                    uri: temp[i],
                    type: "image/jpeg",
                    name: temp[i].substring(temp[i].lastIndexOf('.'), temp[i].length),
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
                    if (responseData.status === '0') {
                        this.setState({loadingText: '创建成功'});
                        setTimeout(() => {
                            this.setState({isLoading: false});
                            this.props.navigation.navigate('FoundSuccess');
                        }, 1000)
                    } else {
                        this.setState({isLoading: false,});
                        this.refs.toast.show('创建失败，请重试');
                    }
                })
                .catch(
                    (error) => {
                        this.setState({isLoading: false});
                        this.refs.toast.show('添加失败，请稍后重试');
                        setTimeout(() => {
                            this.props.navigation.navigate('Home');
                        }, 1000)
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
    //展示
    showText: {
        flex: 1,
        fontSize: FONT_SIZE(16),
        color: '#898989',
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
        paddingLeft: 0,
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
        paddingLeft: 0,
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

});
