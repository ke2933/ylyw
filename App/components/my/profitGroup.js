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
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import {Global} from '../../common/Global';
import px2dp from "../../common/Tool";

export default class profitAll extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isRefresh: false,
            profitArr: [],
            dataFlag: false,
            pageSize: '10',
            pageNo: '1',
        }
    }

    componentDidMount() {
        this.incomeList();
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar//状态栏
                    animated={true}//是否动画
                    hidden={false}//是否隐藏
                    backgroundColor={'#000'}//android 设置状态栏背景颜色
                    translucent={false}//android 设置状态栏是否为透明
                    showHideTransition="fade"//IOS状态栏改变时动画 fade:默认 slide
                    //networkActivityIndicatorVisible={ true }//IOS设定网络活动指示器(就是那个菊花)是否显示在状态栏。
                    statusBarStyle={"default"}//ios:白底黑字  android:黑底白字
                />
                <FlatList
                    style={styles.profitFlatList}
                    data={this.state.profitArr}
                    initialNumToRender={10}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => this.renderItem(item)}
                    onRefresh={() => {
                        this.incomeList();
                    }}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{
                                height: Pixel,
                                backgroundColor: '#dbdbdb',
                            }}></View>
                        )
                    }}
                    refreshing={this.state.isRefresh}
                    onEndReached={() => this.onEndReached()}
                    onEndReachedThreshold={.3}
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
        const {navigate, goBack} = Obj.this.props.navigation;
        return (
            <TouchableOpacity
                key={item.id}
                activeOpacity={.8}
                onPress={() => {
                    navigate('IncomeDetails', {'id': item.id});
                }}
            >
                <View style={styles.EarningsItemBox}>
                    <View style={styles.itemLeft}>
                        <Text style={styles.itemName}>{item.illnessName}</Text>
                        <Text style={styles.itemDate}>{item.createTime}</Text>
                    </View>
                    <View style={styles.itemRight}>
                        <Text
                            style={[styles.itemPrice, {color: item.price > 0 ? '#2ecd32' : '#212121'}]}>{item.price > 0 ? '+' + item.price : item.price}元</Text>
                        <Image source={require('../../images/arrow_gray_right.png')}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    onEndReached() {
        if (this.state.dataFlag) {
            let tempNo = this.state.pageNo * 1 + 1;
            this.setState({
                pageNo: tempNo
            });
            this.incomeListMore(tempNo);
        }
    }

    incomeList() {
        this.setState({pageNo: '1'});
        fetch(requestUrl.detailList + `?pageSize=${this.state.pageSize}&pageNo=1&type=1`)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '10') {
                    this.props.navigation.navigate('Login');
                } else if (responseData.status === '0') {
                    if (responseData.purseDetailList.length >= this.state.pageSize) {
                        this.setState({
                            profitArr: responseData.purseDetailList,
                            dataFlag: true,
                        })
                    } else {
                        this.setState({
                            profitArr: responseData.purseDetailList,
                            dataFlag: false,
                        })
                    }
                } else {
                    this.setState({
                        profitArr: [],
                        dataFlag: false,
                    })
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                    console.log('error', error);
                });
    }

    incomeListMore(pageNo) {
        fetch(requestUrl.detailList + `?pageSize=${this.state.pageSize}&pageNo=${pageNo}&type=2`)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '0') {
                    if (responseData.purseDetailList.length >= this.state.pageSize) {
                        let temp = this.state.profitArr;
                        temp = temp.concat(responseData.purseDetailList);
                        console.log(temp);
                        this.setState({
                            profitArr: temp,
                            dataFlag: true,
                        })
                    } else {
                        let temp = this.state.profitArr;
                        temp = temp.concat(responseData.purseDetailList);
                        this.setState({
                            profitArr: temp,
                            dataFlag: false,
                        })
                    }
                }
            })
            .catch(
                (error) => {
                    this.setState({isLoading: false,});
                    console.log('error', error);
                });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    profitFlatList: {
        marginTop: px2dp(10),
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    // FlatList item CSS
    EarningsItemBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: px2dp(64),
        marginBottom: Pixel,
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        backgroundColor: '#fff',
    },
    itemLeft: {
        // height: px2dp(41),
        justifyContent: 'center',
    },
    itemName: {
        fontSize: FONT_SIZE(16),
        color: '#212121',
        fontWeight: '500',
    },
    itemDate: {
        marginTop: px2dp(10),
        fontSize: FONT_SIZE(12),
        color: '#9e9e9e',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemPrice: {
        marginRight: px2dp(15),
        fontSize: FONT_SIZE(16),
        fontWeight: '500',
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
