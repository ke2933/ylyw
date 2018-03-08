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
    BackHandler,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import {Global} from '../../common/Global';
import Loading from '../../common/Loading'

export default class collection extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataFlag: false,
            isRefresh: false,
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
        this.myCollection();
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
                         'title': '收藏',
                         'rightBtn': {type: false,}
                     }}/>

                <FlatList
                    style={styles.FlatListStyle}
                    data={this.state.libraryArr}
                    initialNumToRender={20}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => this.renderItem(item)}
                    onRefresh={() => this.myCollection()}
                    refreshing={this.state.isRefresh}
                    ListEmptyComponent={() => {
                        return (
                            <View style={styles.noDataBox}>
                                <Image source={require('../../images/no_data.png')}/>
                                <Text style={styles.noDataText}>暂无信息</Text>
                            </View>
                        )
                    }}
                />
            </View>
        );
    }

    renderItem = (item) => {
        const {navigate} = this.props.navigation;
        // 展示图片
        let imgArr = item.pictureList;
        let temp = [];
        let style = {marginRight: px2dp(6)};
        if (imgArr.length >= 0) {

            for (let i = 0; i < (imgArr.length >= 3 ? 3 : imgArr.length); i++) {
                temp.push(
                    <Image key={i} style={[styles.libraryImg, i < 3 ? style : null]}
                           source={{uri: requestUrl.ImgIp + imgArr[i].pictureUrl}}/>
                );
            }
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    navigate('CollectionInfo', {data: item});
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
                            <Image source={require('../../images/browse_false.png')}/>
                            <Text style={styles.browseText}>{item.lookNo}</Text>
                        </View>
                        <View style={styles.starBox}>
                            <Image source={require('../../images/collection_true.png')}/>
                            <Text style={styles.starText}>{item.collectionNo}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )

    };


    myCollection() {
        fetch(requestUrl.myCollection)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({isLoading: false});
                if (responseData.status === '0') {
                    this.setState({
                        libraryArr: responseData.medicalRecordBaseBeanList,
                        isRefresh: false,
                        dataFlag: true,
                    })
                } else {
                    this.refs.toast.show('未搜到相关内容');
                }
            })
            .catch(
                (error) => {
                    this.refs.toast.show('未搜到相关内容');
                    this.setState({isLoading: false});
                });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
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
        fontWeight: '500',
    },
    libraryImgBox: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
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
