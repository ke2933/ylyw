import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    ScrollView,
    TextInput,
    TouchableOpacity,
    FlatList,
    BackHandler,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航组件
import UploadPhoto from '../../common/UploadPhoto';//相机拍照
import Button from '../../common/Button';//按钮
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {Global} from '../../common/Global';
import Loading from '../../common/Loading';
import px2dp from "../../common/Tool";

export default class AttestationTwo extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            qualificationBackA: "",//医师执业证图片A
            qualificationBackB: "",//医师执业证图片B
            certifiedPhoto: "",//手持工牌证图片
            doctorType: '0',//是否愿意为其他医生提供帮助(同意发”1”,不同意发”0”)
            fee: '',//费用
            area: '',//负责区域”(本省/全国)
            electronicSignature: '',//电子签名图片
            protocol: '0',//协议1同意 0不同意
            feeActiveId: FeeArr[0].id,
            areaActiveId: '全国',
            feeArr: FeeArr,
            areaArr: [{"id": "全国", "area": "全国"}, {"id": "本省", "area": "本省",}],
            feeFlag: false,
            areaFlag: false,
            isLoading: false,
            loadingText: '',
            qualificationBackAUrl: require('../../images/add_btn.png'),
            qualificationBackBUrl: require('../../images/add_btn.png'),
            certifiedPhotoUrl: require('../../images/add_btn.png'),
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
                         goBack();
                     }}
                     data={{
                         'leftBtn': true,
                         'title': '医师认证',
                         rightBtn: {type: 'nav', navText: '稍后认证', 'btnNav': 'Home'}
                     }}/>
                <ScrollView
                    style={{flex: 1, backgroundColor: '#efefef'}}
                >
                    <View style={styles.content}>
                        <View style={styles.titleBox}>
                            <Text style={styles.title}>医生资格证</Text>
                            <Text style={styles.placeholder}>请上传第一二页照片</Text>
                        </View>
                        <View style={styles.mainBox}>
                            <UploadPhoto
                                type={'small'}
                                url={this.state.qualificationBackAUrl}
                                changeImg={(data) => {
                                    this.qualificationBackA(data)
                                }}/>

                            <UploadPhoto
                                type={'small'}
                                url={this.state.qualificationBackBUrl}
                                changeImg={(data) => {
                                    this.qualificationBackB(data)
                                }}/>
                            <TouchableOpacity
                                onPress={() => {
                                    navigate('ZoomImg', {data: [requestUrl.ImgIp + '/static/sample/zhiyezhaoa.jpg']})
                                }}
                                activeOpacity={.8}
                            >
                                <View style={styles.sampleBox}>
                                    <Image source={{uri: requestUrl.ImgIp + '/static/sample/qualification_a@2x.png'}}
                                           style={styles.sampleImg}/>
                                    <Text style={styles.sampleText}>示例</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    navigate('ZoomImg', {data: [requestUrl.ImgIp + '/static/sample/zhiyezhaob.jpg']})
                                }}
                                activeOpacity={.8}
                            >
                                <View style={styles.sampleBox}>
                                    <Image source={{uri: requestUrl.ImgIp + '/static/sample/qualification_b@2x.png'}}
                                           style={styles.sampleImg}/>
                                    <Text style={styles.sampleText}>示例</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.titleBox}>
                            <Text style={styles.title}>手持工牌照</Text>
                            <Text style={styles.placeholder}>请上传您的真实照片</Text>
                        </View>
                        <View style={styles.mainBox}>
                            <UploadPhoto
                                type={'small'}
                                url={this.state.certifiedPhotoUrl}
                                changeImg={(data) => {
                                    this.certifiedPhoto(data);
                                }}/>
                            <TouchableOpacity
                                onPress={() => {
                                    navigate('ZoomImg', {data: [requestUrl.ImgIp + '/static/sample/shouchigongpai.jpg']})
                                }}
                                activeOpacity={.8}
                            >
                                <View style={styles.sampleBox}>
                                    <Image source={{uri: requestUrl.ImgIp + "/static/sample/certificates@2x.png"}}
                                           style={styles.sampleImg}/>
                                    <Text style={styles.sampleText}>示例</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/*<View style={styles.content}>*/}
                    {/*<TouchableOpacity*/}
                    {/*onPress={() => {*/}
                    {/*navigate('Autograph', {*/}
                    {/*"callback": (data) => {*/}
                    {/*this.setState({*/}
                    {/*electronicSignature: data,*/}
                    {/*})*/}
                    {/*}*/}
                    {/*})*/}
                    {/*}}*/}
                    {/*activeOpacity={.8}*/}
                    {/*style={styles.autographClick}*/}
                    {/*>*/}
                    {/*<Text style={styles.autographText}>电子签名</Text>*/}
                    {/*<Image style={styles.autographImg} source={require('../../images/arrow_gray_right.png')}/>*/}
                    {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                    <View style={styles.content}>
                        <View style={styles.doctorTypeBox}>
                            <Text style={styles.doctorTypeTitle}>是否愿意为其他医生提供会诊帮助</Text>
                            <TouchableOpacity
                                onPress={this.radioDoctorType.bind(this)}
                                activeOpacity={.8}
                                style={styles.doctorTypeImg}
                            >

                                <Image
                                    source={this.state.doctorType === '0' ? require('../../images/radio_false.png') : require('../../images/radio_true.png')}/>
                            </TouchableOpacity>
                        </View>
                        {this.renderHelpView()}
                    </View>
                    <View style={styles.content}>
                        <View style={styles.doctorTypeBox}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    navigate('Protocol', {
                                        'callback': (data) => {
                                            this.setState({protocol: data})
                                        }
                                    });
                                }}><Text style={styles.doctorTypeTitle}>查阅并同意

                                <Text
                                    style={{color: '#566cb7', textDecorationLine: 'underline'}}>
                                    医来医往平台协议
                                </Text>

                            </Text></TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.radioProtocol.bind(this)}
                                activeOpacity={.8}
                                style={styles.doctorTypeImg}
                            >

                                <Image
                                    source={this.state.protocol === '0' ? require('../../images/radio_false.png') : require('../../images/radio_true.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Button text={'提交'} click={this.addOauth.bind(this)}/>
                    <Toast
                        ref='toast'
                        style={{backgroundColor: '#333333', borderRadius: 10,}}
                        position={'center'}
                        textStyle={{color: '#ffffff', fontSize: 16,}}
                        fadeInDuration={1000}
                        opacity={.8}
                    />
                </ScrollView>
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
                    </TouchableOpacity> : null
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
                                                area: this.state.areaActiveId,
                                                // fee: this.state.feeActiveId,
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
                    </TouchableOpacity>
                    : null
                }
            </View>

        );
    }

    qualificationBackA(data) {
        this.setState({
            qualificationBackA: data,
            qualificationBackAUrl: {uri: data},

        })
    }

    qualificationBackB(data) {
        this.setState({
            qualificationBackB: data,
            qualificationBackBUrl: {uri: data},
        })
    }

    certifiedPhoto(data) {
        this.setState({
            certifiedPhoto: data,
            certifiedPhotoUrl: {uri: data},
        })
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
                        // area: item.id,
                        // areaFlag: false,
                        areaActiveId: item.id,
                    })
                }}
                activeOpacity={.8}
            >
                <Text style={[styles.optionText, this.state.areaActiveId === item.id ? style : null]}>{item.area}</Text>
            </TouchableOpacity>
        )
    };

    //是否愿意为其他医生提供会诊帮助
    radioDoctorType() {
        if (this.state.doctorType === '0') {
            this.setState({
                doctorType: '1',
            })
        } else {
            this.setState({
                doctorType: '0',
            })
        }
    }

    //同意会诊部分
    renderHelpView() {
        if (this.state.doctorType === '0') {
            return;
        } else {
            return (
                <View style={styles.helpContent}>
                    <View style={[styles.helpBox, {borderBottomWidth: Pixel,}]}>
                        <Text style={styles.helpTitle}>选择提供会诊区域</Text>
                        <View style={styles.helpInputBox}>
                            <TextInput
                                style={styles.selectInput}
                                placeholder={'请选择'}
                                placeholderTextColor={'#c7c7cd'}
                                underlineColorAndroid={'transparent'}
                                defaultValue={this.state.area}
                            >
                            </TextInput>
                            <Image style={styles.selectImg} source={require('../../images/arrow_gray_right.png')}/>
                        </View>
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={this.area.bind(this)}
                            style={styles.selectClick}
                        >

                        </TouchableOpacity>
                    </View>
                    <View style={styles.helpBox}>
                        <Text style={styles.helpTitle}>选择会诊费用</Text>
                        <View style={styles.helpInputBox}>
                            <TextInput
                                style={styles.selectInput}
                                placeholder={'请选择'}
                                placeholderTextColor={'#c7c7cd'}
                                underlineColorAndroid={'transparent'}
                                defaultValue={this.state.fee}
                            >
                            </TextInput>
                            <Image style={styles.selectImg} source={require('../../images/arrow_gray_right.png')}/>
                        </View>
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={this.fee.bind(this)}
                            style={styles.selectClick}
                        >

                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }


    // 是否同意协议
    radioProtocol() {
        if (this.state.protocol === '0') {
            this.setState({
                protocol: '1',
            })
        } else {
            this.setState({
                protocol: '0',
            })
        }
    }

    addOauth() {
        if (this.state.qualificationBackA === '') {
            this.refs.toast.show('请上传医师资格证第一页');
            return;
        }
        if (this.state.qualificationBackB === '') {
            this.refs.toast.show('请上传医师资格证第二页');
            return;
        }
        if (this.state.certifiedPhoto === '') {
            this.refs.toast.show('手持工牌证图片');
            return;
        }
        // if (this.state.electronicSignature === '') {
        //     this.refs.toast.show('请完成电子签名');
        //     return;
        // }
        if (this.state.doctorType === '1') {
            if (this.state.fee === '') {
                this.refs.toast.show('请选择费用');
                return;
            }
            if (this.state.area === '') {
                this.refs.toast.show('请选择地区');
                return;
            }
        }
        if (this.state.qualificationBackB === '') {
            this.refs.toast.show('请上传医师资格证第二页');
            return;
        }
        if (this.state.protocol === '0') {
            this.refs.toast.show('请同意医来医往协议');
            return;
        } else {
            this.setState({isLoading: true, loadingText: '上传中...'});
            let formData = new FormData();
            let qualificationBackA = {
                uri: this.state.qualificationBackA,
                type: 'image/jpeg',
                name: 'qualificationBackA'
            };
            let qualificationBackB = {
                uri: this.state.qualificationBackB,
                type: 'image/jpeg',
                name: 'qualificationBackB'
            };
            let certifiedPhoto = {
                uri: this.state.certifiedPhoto,
                type: 'image/jpeg',
                name: 'certifiedPhoto'
            };
            // let electronicSignature = {
            //     uri: this.state.electronicSignature,
            //     type: 'image/jpeg',
            //     name: 'electronicSignature'
            // };
            formData.append("file", qualificationBackA);//医师执业证图片A
            formData.append("file", qualificationBackB);//医师执业证图片B
            formData.append("file", certifiedPhoto);//手持工牌证图片
            //是否愿意为其他医生提供帮助(同意发”1”,不同意发”0”)”
            if (this.state.doctorType === '1') {
                formData.append("doctorType", '1');
                formData.append("area", this.state.area);
                formData.append("fee", this.state.fee);
            } else {
                formData.append("doctorType", '0');
            }
            // formData.append("file", electronicSignature);//电子签名图片
            console.log(formData);

            fetch(requestUrl.addOauth, {
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
                        this.setState({loadingText: '保存成功'});
                        setTimeout(() => {
                            this.setState({isLoading: false,});
                            this.props.navigation.navigate('AttestationThree');
                        }, 1000);
                    } else if (responseData.status === '1') {
                        this.setState({isLoading: false,});
                        this.refs.toast.show('提交失败，请重新提交');
                    } else if (responseData.status === '2') {
                        this.setState({isLoading: false,});
                        this.refs.toast.show('认证信息已存在，请不要重复认证');
                    } else {
                        this.setState({isLoading: false,});
                        this.refs.toast.show('提交失败，请重新提交');
                    }
                })
                .catch(
                    (error) => {
                        console.log(error);
                        this.setState({isLoading: false,});
                        this.refs.toast.show('请稍后重试');
                    });

        }

    }

    area() {
        this.setState({
            feeFlag: false,
            areaFlag: true,
        })
    }

    fee() {
        this.setState({
            areaFlag: false,
            feeFlag: true,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    //功能块
    content: {
        backgroundColor: '#fff',
        marginTop: px2dp(6),
    },
    //功能块 头部
    titleBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: SCREEN_WIDTH * 0.92,
        marginLeft: SCREEN_WIDTH * 0.04,
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        height: px2dp(50),
        borderBottomColor: '#d6e1e8',
        borderBottomWidth: Pixel,
    },
    title: {
        fontSize: FONT_SIZE(16),
        color: '#333333'
    },
    placeholder: {
        fontSize: FONT_SIZE(16),
        color: '#c7c7cd',
    },
    // 功能块功能
    mainBox: {
        flexDirection: 'row',
        alignItems: 'center',
        width: SCREEN_WIDTH * 0.92,
        height: px2dp(82),
        marginLeft: SCREEN_WIDTH * 0.04,
        paddingLeft: px2dp(15),
    },
    sampleBox: {
        marginRight: px2dp(10),
    },
    sampleImg: {
        width: px2dp(60),
        height: px2dp(60),
        borderRadius: px2dp(5),
    },
    sampleText: {
        position: 'absolute',
        bottom: px2dp(5),
        left: 0,
        width: px2dp(60),
        textAlign: 'center',
        backgroundColor: 'transparent',
        fontSize: FONT_SIZE(12),
        color: '#333333',
    },
    // 签名功能
    autographClick: {
        width: SCREEN_WIDTH * 0.92,
        marginLeft: SCREEN_WIDTH * 0.04,
        height: px2dp(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    autographText: {
        fontSize: FONT_SIZE(16),
        color: '#333333',
        paddingLeft: px2dp(15),
    },
    autographImg: {
        marginRight: SCREEN_WIDTH * 0.04,
        paddingRight: px2dp(9),
        width: px2dp(7),
        height: px2dp(14),
    },
    // 会诊
    doctorTypeBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: px2dp(50),

    },
    doctorTypeTitle: {
        marginLeft: SCREEN_WIDTH * 0.04,
        paddingLeft: px2dp(15),
        fontSize: FONT_SIZE(16),
        color: '#333333'
    },
    doctorTypeImg: {
        marginRight: SCREEN_WIDTH * 0.04,
        paddingRight: px2dp(9),
        paddingTop: px2dp(9),
        paddingLeft: px2dp(9),
        paddingBottom: px2dp(9),
    },
    //同意会诊部分
    helpContent: {
        borderTopColor: '#d6e1e8',
        borderTopWidth: Pixel,
    },
    helpBox: {
        flexDirection: 'row',
        alignItems: 'center',
        width: SCREEN_WIDTH * .92,
        marginLeft: SCREEN_WIDTH * .04,
        height: px2dp(50),
        borderBottomColor: '#d6e1e8',
    },
    helpTitle: {
        fontSize: FONT_SIZE(16),
        color: '#333333',
        paddingLeft: px2dp(15),
    },
    helpInputBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectInput: {
        flex: 1,
        textAlign: 'right',
    },
    selectImg: {
        marginRight: SCREEN_WIDTH * 0.04,
        paddingRight: px2dp(9),
        marginLeft: px2dp(5),
    },
    selectClick: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: SCREEN_WIDTH * 0.92,
        height: px2dp(50),
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

});
