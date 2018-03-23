import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Alert,
    Image,
    Dimensions,
    PixelRatio,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ScrollView,
    BackHandler,
    FlatList,
} from 'react-native';

let {width, height} = Dimensions.get('window');
import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import Button from '../../common/Button';//按钮

export default class problem extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            problemList: [],
        }

    }

    componentDidMount() {
        fetch(requestUrl.problem)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '0') {
                    this.setState({
                        problemList: responseData.commonProblems,
                    })
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });
    }

    componentWillMount() {
       NetWork ? null : Alert.alert('网络似乎断掉了'), this.setState({isLoading: false});RouteName.push(this.props.navigation.state);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }
    }

    render() {
        const {goBack} = this.props.navigation;
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
                <Nav navigation={this.props.navigation}
                     leftClick={() => {
                         RouteName.pop();
                         goBack();
                     }}
                     data={{
                         'leftBtn': true,
                         'title': '常见问题',
                         rightBtn: {type: 'false',}
                     }}/>
                {/*<ScrollView style={{flex: 1}}>*/}
                {/*<View style={styles.ProblemBox}>*/}
                {/*<View style={styles.signBox}></View>*/}
                {/*<Text style={styles.title}>提现收取手续费吗？</Text>*/}
                {/*<Text style={styles.text}>详询请致电客服</Text>*/}
                {/*</View>*/}
                {/*<View style={styles.ProblemBox}>*/}
                {/*<View style={styles.signBox}></View>*/}
                {/*<Text style={styles.title}>提现有限额吗？</Text>*/}
                {/*<Text style={styles.text}>详询请致电客服</Text>*/}
                {/*</View>*/}
                {/*<View style={styles.ProblemBox}>*/}
                {/*<View style={styles.signBox}></View>*/}
                {/*<Text style={styles.title}>提现多久可以到账？</Text>*/}
                {/*<Text style={styles.text}>一般申请提现后，经过医来医往后台审核无误，1-3个工作日内会转到您的支付宝账号。</Text>*/}
                {/*</View>*/}
                {/*<View style={styles.ProblemBox}>*/}
                {/*<View style={styles.signBox}></View>*/}
                {/*<Text style={styles.title}>为什么支付宝提现后收不到账？</Text>*/}
                {/*<Text style={styles.text}>1.首先请确保您的支付宝账号输入无误</Text>*/}
                {/*<Text*/}
                {/*style={styles.text}>2.检查您的平台认证姓名与支付宝账号的姓名是否一致，如果不一致，经过医来医往后台审核，提现金额会原路返还至您的医来医往账号，请注意查看您的收益余额首先请确保您的支付宝账号输入无误</Text>*/}
                {/*<Text style={styles.text}>3.信息全部正确但还是逾期未到账，请及时致电医来医往官方客服寻求帮助</Text>*/}
                {/*</View>*/}
                {/*<View style={styles.ProblemBox}>*/}
                {/*<View style={styles.signBox}></View>*/}
                {/*<Text style={styles.title}>怎样更改我的认证信息？</Text>*/}
                {/*<Text style={styles.text}>请致电医来医往官方客服 010-63786220，在客服的帮助下完成信息更改。</Text>*/}
                {/*</View>*/}
                {/*<View style={styles.ProblemBox}>*/}
                {/*<View style={styles.signBox}></View>*/}
                {/*<Text style={styles.title}>这些都没有解决我的问题怎么办？</Text>*/}
                {/*<Text style={styles.text}>可致电医来医往官方客服 010-63786220</Text>*/}
                {/*<Text style={styles.text}>客服在线时间为：周一至周日</Text>*/}
                {/*<Text style={styles.text}>上午09:00-11:30</Text>*/}
                {/*<Text style={styles.text}>下午13:00-18:00</Text>*/}
                {/*</View>*/}
                {/*</ScrollView>*/}
                <FlatList
                    style={{flex: 1}}
                    data={this.state.problemList}
                    initialNumToRender={20}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => this.renderItem(item)}
                    ListFooterComponent={() => {
                        if (IPhoneX) {
                            return (
                                <View style={{height: 34,}}></View>
                            )
                        } else {
                            return null;
                        }
                    }}
                />
            </View>
        );
    }

    renderItem = (item) => {
        let problemContext = item.problemContext;
        let contentArr = problemContext.split('%split');

        return (
            <View style={styles.ProblemBox}>
                <View style={styles.signBox}></View>
                <Text style={styles.title}>{item.problemTitle}</Text>
                {
                    contentArr.map((item, i) => {
                        return (
                            <Text key={i} style={styles.text}>{item}</Text>
                        )
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
        // height: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        // borderWidth: 1 / PixelRatio.get(),
    },
    ProblemBox: {
        paddingLeft: 41,
        paddingRight: 27,
        paddingTop: 24,
        paddingBottom: 24,
        backgroundColor: '#fff',
    },
    signBox: {
        position: 'absolute',
        top: 30,
        left: 19,
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#adc0ff',
    },
    title: {
        marginBottom: 14,
        fontSize: 19,
        color: '#333333',
    },
    text: {
        fontSize: 14,
        color: '#676767',
        lineHeight: 25,
    },
});
