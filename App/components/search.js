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
    Keyboard,
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast';//弱提示
import {requestUrl} from '../Network/url';//接口url
import {RegExp} from '../Network/RegExp';//正则
import {Global} from '../common/Global';
import Loading from '../common/Loading';
import CountDown from '../common/CountDown';
import px2dp from "../common/Tool";
// 倒计时

export default class Search extends Component {
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
            isRefresh: false,//
            isLoadMore: false,//true 没有更多数据
            api: '',
            dataFlag: false,
            isLoading: false,
            doctorBeans: [],
            medicalRecordBaseBeanList: [],
            medicalPoolBeanList: [],
            thisCityId: '',
            departmentId: '',// 科室id
            thisCity: '',
            doctorBeanList: [],// 医生列表
            baseHospitalDeptList: [],// 医院列表
            deptId: '',// 科室id
            placeholderText: '',
        }
    }

    // componentWillUnmount() {
    //     this.keyboardDidShowListener.remove();
    //     this.keyboardDidHideListener.remove();
    // }
    //
    //
    // _keyboardDidShow(e) {
    //     this.refs.search.focus();
    // }
    //
    // _keyboardDidHide(e) {
    //     this.refs.search.blur();
    // }

    componentWillMount() {
        RouteName.push(this.props.navigation.state);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }
        // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params;
            if (data.api === 'likeDisease') {
                this.setState({
                    api: data.api,
                    deptId: data.deptId,
                })
            } else {
                this.setState({
                    api: data.api,
                })
            }
            if (data.api === 'likeDisease') {
                this.setState({
                    placeholderText: '请输入疾病名称'
                })
            } else if (data.api === 'likeFindHospital') {
                this.setState({
                    placeholderText: '请输入医院名称'
                })
            } else if (data.api === 'medicalRecordSearch') {
                this.setState({
                    placeholderText: '您可以输入医院 、医生、疾病'
                })
            } else if (data.api === 'homeSearch') {
                this.setState({
                    placeholderText: '搜索医院、科室、医生、疾病'
                })
            } else if (data.api === 'searchMedicalPool') {
                this.setState({
                    placeholderText: '您可以输入医院 、医生、疾病'
                })
            } else {
                this.setState({
                    placeholderText: '请输入疾病名称/医院姓名'
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
                            ref={'search'}
                            style={styles.textInput}
                            placeholder={this.state.placeholderText}
                            placeholderTextColor={'#bdbdbd'}
                            autoFocus={true}
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
                                    })
                                }
                            }}
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
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
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
        } else {
            if (this.state.api === 'likeDisease') {
                return (
                    <FlatList
                        style={styles.FlatListStyle}
                        data={this.state.searchArr}
                        keyboardDismissMode="on-drag"
                        initialNumToRender={20}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => this.renderItem(item)}
                        onRefresh={() => {
                            this.setState({pageNo: '1'});
                            this.fetchData(this.state.searchText)
                        }}
                        refreshing={this.state.isRefresh}
                        onEndReached={() => this.onEndReached()}
                        onEndReachedThreshold={.3}
                        removeClippedSubviews={false}
                        keyboardShouldPersistTaps={'always'}
                        ListEmptyComponent={() => {
                            return (
                                <View style={styles.noDataBox}>
                                    <Image source={require('../images/no_search.png')}/>
                                    <Text style={styles.noDataText}>没有您搜索的内容</Text>
                                </View>
                            )
                        }}

                    />
                )
            } else if (this.state.api === 'likeFindHospital') {
                return (
                    <FlatList
                        style={styles.FlatListStyle}
                        data={this.state.searchArr}
                        keyboardDismissMode="on-drag"
                        initialNumToRender={20}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => this.renderItem(item)}
                        onRefresh={() => {
                            this.setState({pageNo: '1'});
                            this.fetchData(this.state.searchText)
                        }}
                        refreshing={this.state.isRefresh}
                        onEndReached={() => this.onEndReached()}
                        onEndReachedThreshold={.3}
                        removeClippedSubviews={false}
                        ListEmptyComponent={() => {
                            return (
                                <View style={styles.noDataBox}>
                                    <Image source={require('../images/no_search.png')}/>
                                    <Text style={styles.noDataText}>没有您搜索的内容</Text>
                                </View>
                            )
                        }}
                    />
                )
            } else if (this.state.api === 'medicalRecordSearch') {
                return (
                    <FlatList
                        style={styles.FlatListStyle}
                        data={this.state.searchArr}
                        initialNumToRender={20}
                        keyboardDismissMode="on-drag"
                        keyExtractor={item => item.id}
                        renderItem={({item}) => this.renderItem(item)}
                        onRefresh={() => {
                            this.setState({pageNo: '1'});
                            this.fetchData(this.state.searchText)
                        }}
                        refreshing={this.state.isRefresh}
                        onEndReached={() => this.onEndReached()}
                        onEndReachedThreshold={.3}
                        removeClippedSubviews={false}
                        ListEmptyComponent={() => {
                            return (
                                <View style={styles.noDataBox}>
                                    <Image source={require('../images/no_search.png')}/>
                                    <Text style={styles.noDataText}>没有您搜索的内容</Text>
                                </View>
                            )
                        }}
                    />
                )
            } else if (this.state.api === 'search') {
                return (
                    // doctorBeanList: [],// 医生列表
                    // baseHospitalDeptList: [],// 医院列表
                    <ScrollView
                        keyboardDismissMode="on-drag"
                        style={{flex: 1,}}>
                        <View style={styles.searchContainer}>
                            {this.state.baseHospitalDeptList.length > 0 ? <View style={styles.searchContent}>
                                <View style={styles.moreBox}>
                                    <Text style={styles.moreTitle}>医院推荐</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            // navigate('SearchMore', {data: this.state})
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
                                    keyExtractor={item => item.id}
                                    renderItem={({item}) => this.hospitalRender(item)}
                                    scrollEnabled={false}
                                    ItemSeparatorComponent={() => {
                                        return (<View style={{
                                            height: Pixel,
                                            backgroundColor: '#efefef',
                                            marginTop: px2dp(6),
                                        }}></View>)
                                    }}
                                    ListEmptyComponent={() => {
                                        return (
                                            <View style={styles.noDataBox}>
                                                <Image source={require('../images/no_search.png')}/>
                                                <Text style={styles.noDataText}>没有您搜索的内容</Text>
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
                                            // navigate('SearchMore', {data: this.state})
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
                                        return (<View style={{
                                            height: Pixel,
                                            backgroundColor: '#efefef',
                                            marginTop: px2dp(6),
                                        }}></View>)
                                    }}
                                    ListEmptyComponent={() => {
                                        return (
                                            <View style={styles.noDataBox}>
                                                <Image source={require('../images/no_search.png')}/>
                                                <Text style={styles.noDataText}>没有您搜索的内容</Text>
                                            </View>
                                        )
                                    }}
                                />
                            </View> : null}
                        </View>
                    </ScrollView>
                )
            } else if (this.state.api === 'homeSearch') {
                return (
                    <ScrollView
                        keyboardDismissMode="on-drag"
                        style={{flex: 1,}}>
                        <View style={styles.searchContainer}>
                            {this.state.medicalPoolBeanList.length > 0 ? <View style={styles.searchContent}>
                                <View style={styles.moreBox}>
                                    <Text style={styles.moreTitle}>病历池</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigate('SearchMore', {data: this.state, type: 'pool'})
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
                                    data={this.state.medicalPoolBeanList}
                                    initialNumToRender={20}
                                    keyExtractor={item => item.id}
                                    renderItem={({item}) => this.medicalPoolRender(item)}
                                    scrollEnabled={false}
                                    ItemSeparatorComponent={() => {
                                        return (<View style={{
                                            height: Pixel,
                                            backgroundColor: '#efefef',
                                            marginTop: px2dp(6),
                                        }}></View>)
                                    }}
                                    ListEmptyComponent={() => {
                                        return (
                                            <View style={styles.noDataBox}>
                                                <Image source={require('../images/no_search.png')}/>
                                                <Text style={styles.noDataText}>没有您搜索的内容</Text>
                                            </View>
                                        )
                                    }}
                                />
                            </View> : null}
                            {this.state.doctorBeans.length > 0 ? <View style={styles.searchContent}>
                                <View style={styles.moreBox}>
                                    <Text style={styles.moreTitle}>医生推荐</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigate('SearchMore', {data: this.state, type: 'doc'})
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
                                    data={this.state.doctorBeans}
                                    initialNumToRender={20}
                                    keyExtractor={item => item.id}
                                    renderItem={({item}) => this.doctorRender(item)}
                                    scrollEnabled={false}
                                    ItemSeparatorComponent={() => {
                                        return (<View style={{
                                            height: Pixel,
                                            backgroundColor: '#efefef',
                                            marginTop: px2dp(6),
                                        }}></View>)
                                    }}
                                    ListEmptyComponent={() => {
                                        return (
                                            <View style={styles.noDataBox}>
                                                <Image source={require('../images/no_search.png')}/>
                                                <Text style={styles.noDataText}>没有您搜索的内容</Text>
                                            </View>
                                        )
                                    }}
                                />
                            </View> : null}
                            {this.state.medicalRecordBaseBeanList.length > 0 ? <View style={styles.searchContent}>
                                <View style={styles.moreBox}>
                                    <Text style={styles.moreTitle}>病例库</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigate('SearchMore', {data: this.state, type: 'record'})

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
                                    data={this.state.medicalRecordBaseBeanList}
                                    initialNumToRender={20}
                                    keyExtractor={item => item.id}
                                    renderItem={({item}) => this.medicalRecordRender(item)}
                                    scrollEnabled={false}
                                    ItemSeparatorComponent={() => {
                                        return (<View style={{
                                            height: Pixel,
                                            backgroundColor: '#efefef',
                                            marginTop: px2dp(6),
                                        }}></View>)
                                    }}
                                    ListEmptyComponent={() => {
                                        return (
                                            <View style={styles.noDataBox}>
                                                <Image source={require('../images/no_search.png')}/>
                                                <Text style={styles.noDataText}>没有您搜索的内容</Text>
                                            </View>
                                        )
                                    }}
                                />
                            </View> : null}
                        </View>
                    </ScrollView>

                )
            } else if (this.state.api === 'searchMedicalPool') {
                return (
                    <FlatList
                        style={styles.FlatListStyle}
                        data={this.state.searchArr}
                        initialNumToRender={20}
                        keyboardDismissMode="on-drag"
                        keyExtractor={item => item.id}
                        renderItem={({item}) => this.renderItem(item)}
                        onRefresh={() => {
                            this.setState({pageNo: '1'});
                            this.fetchData(this.state.searchText)
                        }}
                        ItemSeparatorComponent={() => {
                            return (<View style={{
                                height: Pixel,
                                backgroundColor: '#efefef',
                                marginTop: px2dp(6),
                            }}></View>)
                        }}
                        refreshing={this.state.isRefresh}
                        onEndReached={() => this.onEndReached()}
                        onEndReachedThreshold={.3}
                        removeClippedSubviews={false}
                        ListEmptyComponent={() => {
                            return (
                                <View style={styles.noDataBox}>
                                    <Image source={require('../images/no_search.png')}/>
                                    <Text style={styles.noDataText}>没有您搜索的内容</Text>
                                </View>
                            )
                        }}
                    />
                )
            }
        }
    }

    renderItem = (item) => {
        const {navigate, goBack, state} = this.props.navigation;
        if (this.state.api === 'likeFindHospital') {
            return (
                <TouchableOpacity
                    onPress={() => {
                        state.params.callback(item);
                        goBack();
                    }}
                    key={item.id}
                    activeOpacity={0.8}
                    style={styles.itemClick}
                >
                    <Text style={styles.itemText}>{item.hospitalName}</Text>
                </TouchableOpacity>
            )
        } else if (this.state.api === 'likeDisease') {
            return (
                <TouchableOpacity
                    onPress={() => {
                        state.params.callback(item);
                        goBack();
                    }}
                    key={item.id}
                    activeOpacity={0.8}
                    style={styles.itemClick}
                >
                    <Text style={styles.itemText}>{item.illnessName}</Text>
                </TouchableOpacity>
            )
        } else if (this.state.api === 'medicalRecordSearch') {
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
        } else if (this.state.api === 'searchMedicalPool') {
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
        }
    };
    // 首页搜索 3中情况
    medicalPoolRender = (item) => {
        const {navigate, goBack} = this.props.navigation;
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
                            <Text style={styles.caseHistoryDate}>还剩 <CountDown style={{color: '#333', fontSize: 16,}}
                                                                               duration={item.duration}
                                                                               beginTime={item.startTime}/></Text>
                        </View>
                        <Image source={require('../images/arrow_gray_right.png')}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };
    doctorRender = (item) => {
        const {navigate} = this.props.navigation;
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
    };

    medicalRecordRender = (item) => {
        const {navigate} = this.props.navigation;
        // 展示图片
        let imgArr = item.pictureList;
        let temp = [];
        if (imgArr.length >= 0) {

            for (let i = 0; i < (imgArr.length >= 3 ? 3 : imgArr.length); i++) {
                temp.push(
                    <Image key={i} style={styles.libraryImg} source={{uri: requestUrl.ImgIp + imgArr[i].pictureUrl}}/>
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
    };

    // 发起会诊 搜索 2中情况
    hospitalRender = (item) => {
        const {navigate} = this.props.navigation;
        let areaLable = [];
        if (item.areaLable === this.state.thisCity) {
            areaLable.push(
                <View key={item.hospitalId} style={styles.areaLableBox}>
                    <Text style={styles.areaLableText}>本省</Text>
                </View>
            );
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    navigate('SelectDoctor', {data: this.state, hospitalData: item})
                }}
                activeOpacity={.8}
                key={item.hospitalId}
            >
                <View style={styles.hospitalContent}>
                    <View style={styles.topBox}>
                        <View style={styles.titleBox}>
                            <Text style={styles.title}>{item.hospitalName}</Text>
                            {areaLable}
                        </View>
                        <Text numberOfLines={2} style={styles.hospitalDetailText}>{item.departmentDetail}</Text>
                    </View>
                    <View style={styles.bottomBoxLable}>
                        <View style={styles.hospitalLableContent}>
                            {item.hospitalLable > 0 ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>顶级医院</Text>
                            </View> : null}
                            {item.departmentLable > 0 ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>顶级科室</Text>
                            </View> : null}
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                navigate('SelectDoctor', {data: this.state, hospitalData: item})
                            }}
                            activeOpacity={.8}
                        >
                            <View style={styles.selectBtn}>
                                <Text style={styles.slecetBtnText}>选择</Text>
                            </View>
                        </TouchableOpacity>
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
                <View key={item.id} style={styles.areaLableBox}>
                    <Text style={styles.areaLableText}>本省</Text>
                </View>
            );
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    navigate('DoctorInfo', {data: this.state, doctorData: item})
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
                            {item.departmentLable > 0 ? <View style={styles.hospitalLabelBox}>
                                <Text style={styles.hospitalLabelText}>顶级科室</Text>
                            </View> : null}
                        </View>
                        <Text style={styles.fee}>¥{item.doctorConsultationFee}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    // 加载更多事件
    onEndReached() {
        if (this.state.dataFlag) {
            let tempNo = this.state.pageNo * 1 + 1 + '';
            this.setState({
                pageNo: tempNo,
            });
            this.fetchDataMore(tempNo)
        }
    }

    fetchData(text) {
        if (this.state.api === 'likeFindHospital') {
            let formData = new FormData();
            formData.append("hospitalName", text);
            formData.append("pageNo", '1');
            formData.append("pageSize", this.state.pageSize);
            console.log(formData)
            fetch(requestUrl.likeFindHospital, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((responseData) => {
                    this.setState({isLoading: false});
                    if (responseData.status === '0') {
                        this.setState({
                            searchArr: responseData.beanList,
                            dataFlag: true,
                        })
                    } else {
                        // this.refs.toast.show('未搜到相关内容');
                    }
                    console.log('responseData', responseData);
                })
                .catch(
                    (error) => {
                        // this.refs.toast.show('未搜到相关内容');
                        this.setState({isLoading: false})
                    });
        } else if (this.state.api === 'likeDisease') {
            let formData = new FormData();
            formData.append("diseaseName", text);
            formData.append("deptId", this.state.deptId);
            formData.append("pageNo", '1');
            formData.append("pageSize", this.state.pageSize);
            console.log(formData);
            fetch(requestUrl.likeDisease, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((responseData) => {
                    this.setState({isLoading: false});
                    if (responseData.status === '0') {
                        this.setState({
                            searchArr: responseData.lists,
                            dataFlag: true,
                        })
                    } else {
                        this.setState({
                            searchArr: [],
                            dataFlag: false,
                        })
                    }
                    console.log(responseData);
                })
                .catch(
                    (error) => {
                        // this.refs.toast.show('未搜到相关内容');
                        this.setState({isLoading: false});
                    });
        } else if (this.state.api === 'medicalRecordSearch') {
            let formData = new FormData();
            formData.append("str", text);
            fetch(requestUrl.medicalRecordSearch, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((responseData) => {
                    this.setState({isLoading: false});
                    if (responseData.status === '0') {
                        this.setState({
                            searchArr: responseData.medicalRecordBaseBeanList,
                            dataFlag: true,
                        })
                    } else {
                        // this.refs.toast.show('未搜到相关内容');
                    }
                    console.log(responseData);
                })
                .catch(
                    (error) => {
                        // this.refs.toast.show('未搜到相关内容');
                        this.setState({isLoading: false});
                    });
        } else if (this.state.api === 'search') {
            let formData = new FormData();
            formData.append("departmentId", this.state.departmentId);
            formData.append("str", text);
            console.log(formData)
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
        } else if (this.state.api === 'homeSearch') {
            this.setState({isLoading: true});
            let formData = new FormData();
            formData.append("fuzzyName", text);
            console.log(formData);
            fetch(requestUrl.homeSearch, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((responseData) => {
                    this.setState({isLoading: false});
                    this.setState({
                        thisCityId: responseData.thisCityId,
                        doctorBeans: responseData.doctorBeans,
                        medicalRecordBaseBeanList: responseData.medicalRecordBaseBeanList,
                        medicalPoolBeanList: responseData.medicalPoolBeanList,
                    });
                    console.log(responseData);
                })
                .catch(
                    (error) => {
                        console.log(error);
                        // this.refs.toast.show('未搜到相关内容');
                        this.setState({isLoading: false});
                    });
        } else if (this.state.api === 'searchMedicalPool') {
            let formData = new FormData();
            formData.append("str", text);
            fetch(requestUrl.searchMedicalPool, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((responseData) => {
                    console.log(responseData);
                    this.setState({
                        searchArr: responseData.medicalPoolBeanList,
                    });
                })
                .catch(
                    (error) => {
                        console.log(error);
                        this.setState({isLoading: false});
                    });
        }

    }

    // 模糊搜索 医院
    fetchDataMore(pageNo) {
        if (this.state.api === 'likeFindHospital') {
            let formData = new FormData();
            formData.append("hospitalName", this.state.searchText);
            formData.append("pageNo", pageNo);
            formData.append("pageSize", this.state.pageSize);
            fetch(requestUrl.likeFindHospital, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.status === '0') {
                        if (responseData.beanList.length >= this.state.pageSize) {
                            let temp = this.state.searchArr;
                            temp = temp.concat(responseData.beanList);
                            this.setState({
                                searchArr: temp,
                                dataFlag: true,
                                isRefresh: false,
                            })
                        } else {
                            let temp = this.state.searchArr;
                            temp = temp.concat(responseData.beanList);
                            this.setState({
                                searchArr: temp,
                                dataFlag: false,
                                isRefresh: false,
                            })
                        }

                    } else {
                        // this.refs.toast.show('没有更多内容');
                    }
                    console.log('responseData', responseData);
                })
                .catch(
                    (error) => {
                        console.log('error', error);
                    });
        } else if (this.state.api === 'likeDisease') {
            let formData = new FormData();
            formData.append("diseaseName", this.state.searchText);
            formData.append("deptId", this.state.deptId);
            formData.append("pageNo", pageNo);
            formData.append("pageSize", this.state.pageSize);
            fetch(requestUrl.likeDisease, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.lists.length >= this.state.pageSize) {
                        let temp = this.state.searchArr;
                        temp = temp.concat(responseData.lists);
                        this.setState({
                            searchArr: temp,
                            dataFlag: true,
                            isRefresh: false,
                        })
                    } else {
                        let temp = this.state.searchArr;
                        temp = temp.concat(responseData.lists);
                        this.setState({
                            searchArr: temp,
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
    }


    // searchTextReg() {
    //     if (this.state.searchText === '') {
    //         this.refs.toast.show('请输入内容');
    //     } else {
    //         this.setState({isLoading: true,});
    //         this.fetchData();
    //     }
    // }
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
        height: IOS ? px2dp(64) : px2dp(64 - StatusBarHeight),
        paddingTop: IOS ? 20 : 0,
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
    FlatListStyle: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    //医院列表
    itemClick: {
        width: SCREEN_WIDTH,
        height: px2dp(44),
        backgroundColor: '#fff',
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        justifyContent: 'center',
        marginTop: Pixel,
    },
    itemText: {
        fontSize: FONT_SIZE(15),
        color: '#333'
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

    // 首页搜索
    searchContainer: {},
    searchContent: {
        marginTop: px2dp(9),
        backgroundColor: '#fff',
    },
    moreBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: Pixel,
        borderBottomColor: '#E6E6E6',
        paddingLeft: px2dp(25),
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
        paddingLeft: px2dp(5),
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
    // 找医生

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

    // 医院item
    hospitalContent: {
        marginBottom: px2dp(6),
        backgroundColor: '#fff',
    },
    topBox: {
        // paddingTop: px2dp(20),
        paddingRight: px2dp(20),
        paddingLeft: px2dp(5),
        paddingBottom: px2dp(9),
        borderBottomWidth: Pixel,
        borderBottomColor: '#efefef',
    },
    titleBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(20),
    },
    title: {
        marginRight: px2dp(7),
        fontSize: FONT_SIZE(19),
        color: '#333333',
    },
    hospitalDetailText: {
        marginTop: px2dp(6),
        fontSize: FONT_SIZE(14),
        color: '#333',
        lineHeight: px2dp(23),
    },
    bottomBoxLable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: px2dp(50),
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
    },
    // 选择按钮
    selectBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(85),
        height: px2dp(31),
        borderWidth: Pixel,
        borderColor: '#898989',
        borderRadius: px2dp(5),
    },
    slecetBtnText: {
        fontSize: FONT_SIZE(16),
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
