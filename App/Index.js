import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    BackHandler,
} from 'react-native';

import {
    TabNavigator,
    StackNavigator
} from 'react-navigation';

import IndexTab from './components/home/home';//首页
import OrderTab from './components/order/order';//订单
    import FirstPay from './components/order/firstPay'// 待支付
    import FirstReply from './components/order/firstReply';// 待回复
        import DoctorList from './components/order/doctorList';// 推荐医院
    import FirstPool from './components/order/firstPool';// 病历池
    import OrderInfo from './components/order/orderInfo';// 首诊订单-会诊中
    import OrderPerfect from './components/order/orderPerfect';// 首诊订单－完善病历
    import FirstEnd from './components/order/firstEnd';// 首诊订单－会诊结束
    import GroupEnd from './components/order/groupEnd';// 会诊订单－会诊结束
    import OrderRefund from './components/order/orderRefund';// 会诊订单－退款／退款中
// --------
    import GroupOrderInfo from './components/order/groupOrderInfo';// 会诊订单详情
    import GroupReply from './components/order/groupReply';// 会诊－回复
    import GroupOverTimeInfo from './components/order/groupOverTimeInfo';// 会诊超时
        import InviteDoctorInfo from './components/order/inviteDoctorInfo';// 已邀请医生详情
        import EditResult from './components/order/editResult';// 编辑会诊结论
            import EditSuccess from './components/order/editSuccess';// 编辑成功页面

import MyTab from './components/my/my';//我的
    import Collection from './components/my/collection';//收藏
        import CollectionInfo from './components/my/collectionInfo';//收藏病历详情
    import Earnings from './components/my/earnings';//收益
import PayPass from './components/my/payPass';// 支付密码
import WithdrawCash from './components/my/withdrawCash';// 提现
import IncomeList from './components/my/incomeList';//收益明细列表
import IncomeDetails from './components/my/incomeDetails';// 收益详情
import Manage from './components/my/manage';// 提现管理
import CheckPayPass from './components/my/checkPayPass';// 修改支付密码
import Validate from './components/my/validate';// 身份验证
import ResetPayPass from './components/my/resetPayPass';// 重置支付密码
        import Problem from './components/my/problem';//常见问题
    import UserInfo from './components/my/userInfo';//个人信息
        import AmendUserImg from './components/my/amendUserImg';//修改头像
        import Accomplished from './components/my/accomplished';//个人简介(获得荣誉)
        import AccomplishedIOS from './components/my/accomplishedIOS';//个人简介(获得荣誉)-IOS
        import Nominate from './components/my/nominate';//擅长
        import NominateIOS from './components/my/nominateIOS';//擅长-IOS
    import Approve from './components/my/approve';//认证信息
        import Protocol from './components/my/protocol';//协议页面
    import SetUp from './components/my/setUp';//设置
        import RevisePassword from './components/my/revisePassword';//修改密码
        import FeedBack from './components/my/feedBack';//意见反馈
        import FeedBackIOS from './components/my/feedBackIOS';//意见反馈-IOS
        import About from './components/my/about';//关于


import Search from './components/search';//搜索
import SearchMore from './components/searchMore';//搜索更多
import SearchDoctor from './components/searchDoctor';// 搜医院医生
import SearchDoctorMore from './components/searchDoctorMore'; // 搜索医院医生更多
import ChatHistory from './components/chatHistory';// 聊天历史
import Chat from './components/chat';// 聊天页面
import FoundSuccess from './components/foundSuccess';// 创建订单成功


import Login from './Login';//密码登录
import SmsLogin from './SmsLogin';//验证码登录
import Register from './Register';//注册
import RetrievePassword from './RetrievePassword';// 找回密码

import AttestationOne from './components/attestation/attestation_one';//认证第一步
    import AttestationTwo from './components/attestation/attestation_two';//认证第二步
    import Autograph from './components/attestation/autograph';//电子签名页面
        import AttestationThree from './components/attestation/attestation_three';//认证第三步


import Expert from './components/expert/expert';//会诊专家－医院列表
    import SelectExperts from './components/expert/selectExperts';//选专家
        import Synopsis from './components/expert/synopsis';// 医院简介
        import ExpertsInfo from './components/expert/expertsInfo';//专家信息
            import ExpertLaunch from './components/expert/expertLaunch';//专家发起会诊

import Library from './components/library/library';//病历库
    import LibraryInfo from './components/library/libraryInfo';//病历详情


import Pool from './components/pool/pool';//病历池
    import CaseHistoryInfo from './components/pool/poolInfo';//病历详情


import Launch from './components/launch/launch';//发起会诊
    import SelectHospital from './components/launch/selectHospital';//选医院
    import InPool from './components/launch/inPool';//放入病历池
        import SelectDoctor from './components/launch/selectDoctor';//选医生
            import DoctorInfo from './components/launch/doctorInfo';//医生信息


import Tidings from './components/tidings/tidings';//消息
import ZoomImg from './common/ZoomImg';// 查看大图
import PhotoView from './common/PhotoView';// 查看大图


const HomeIcon = require('./images/index_tab.png');
const HomeEleIcon = require('./images/index_ele_tab.png');
const OrderIcon = require('./images/order_tab.png');
const OrderEleIcon = require('./images/order_ele_tab.png');
const MyIcon = require('./images/my_tab.png');
const MyEleIcon = require('./images/my_ele_tab.png');
import Start from './components/home/start';
const HomeStack = StackNavigator({
    TabHomePage: {
        screen: IndexTab,
        navigationOptions: () => TabOptions('首页', HomeIcon, HomeEleIcon),
    },
}, {
    mode: 'modal',
});

const MyStack = StackNavigator({
    TabMyPage: {
        screen: MyTab,
        navigationOptions: () => TabOptions('我的', MyIcon, MyEleIcon),
    },

}, {
    mode: 'modal',
});

const OrderStack = StackNavigator({
    TabOrderPage: {
        screen: OrderTab,
        navigationOptions: () => TabOptions('订单', OrderIcon, OrderEleIcon),
    },
}, {
    mode: 'modal',
});

const MainView = TabNavigator({
    TabHomePage: {
        screen: HomeStack,
        navigationOptions: {
        }
    },
    TabOrderPage: {
        screen: OrderStack,
        navigationOptions: {
        }
    },
    TabMyPage: {
        screen: MyStack,
        navigationOptions: {
        },
    },
}, {
    tabBarPosition: 'bottom',
    swipeEnabled: false,//滑动切换
    animationEnabled: false,//点击切换是否有滑动效果
    // backBehavior : 'none',//返回键是否回到第一个tab
    lazy: true,
    tabBarOptions: {
        labelStyle: {
            padding: 0,
            margin: 0,
        },
        iconStyle: {
            marginTop: -12,
            height: 50,
        },
        style: {
            height: 50,
            backgroundColor: "#fbfbfb",
        },
        activeBackgroundColor: 'white',
        activeTintColor: '#566cb7',
        inactiveBackgroundColor: 'white',
        inactiveTintColor: '#aaa',
        showIcon: true,
        showLabel: false,
        pressOpacity: 0.8,
        indicatorStyle: {
            height: 0,
        }
    },
});




const App = StackNavigator({

    Home: {
        screen: MainView,//
        navigationOptions: {
            gesturesEnabled: false,
        }
    },
    Start: {
        screen: Start,
    },
    Order: {
        screen: OrderStack,//订单
    },
    OrderInfo: {
        screen: OrderInfo,
    },
    OrderPerfect: {
        screen: OrderPerfect,
    },// 首诊订单－完善病历
    FirstEnd:{
        screen: FirstEnd,
    },// 首诊订单－会诊结束
    GroupEnd:{
        screen: GroupEnd,
    },// 会诊订单－会诊结束
    OrderRefund:{
        screen: OrderRefund,
    },// 首诊订单－退款／退款中
    GroupOrderInfo: {
        screen: GroupOrderInfo,
    },// 会诊订单－会诊中/完善病历
    EditResult:{
        screen: EditResult,
    },//编辑会诊结论
    EditSuccess:{
        screen: EditSuccess,
        navigationOptions: {
            gesturesEnabled: false,
        }
    },// 编辑结果成功
    FirstPay:{
        screen: FirstPay,
    },// 首诊－待支付
    FirstReply: {
        screen: FirstReply,
    },// 首诊－待回复
    FirstPool:{
        screen: FirstPool,
    },// 首诊－病历池
    DoctorList:{
        screen: DoctorList,
    },// 首诊－待支付 医生列表
    InviteDoctorInfo:{
        screen: InviteDoctorInfo,
    },
    GroupReply: {
        screen: GroupReply,
    },// 会诊－回复
    GroupOverTimeInfo:{
        screen: GroupOverTimeInfo,
    },// 会诊超时
    My: {
        screen: MyStack,//我的
    },
    Collection: {
        screen: Collection,
    },//收藏
    CollectionInfo: {
        screen: CollectionInfo,
    },//收藏病历详情
    Earnings: {
        screen: Earnings,
    },//收益
    PayPass: {
        screen: PayPass,
    },
    WithdrawCash:{
        screen: WithdrawCash,
    },
    IncomeDetails:{
        screen: IncomeDetails,
    },
    Manage:{
        screen: Manage,
    },
    CheckPayPass:{
        screen: CheckPayPass,
    },
    ResetPayPass:{
        screen: ResetPayPass,
    },
    Validate:{
        screen: Validate,
    },
    IncomeList: {
        screen: IncomeList,
    },//收益列表
    Problem: {
        screen: Problem,
    },//常见问题
    UserInfo: {
        screen: UserInfo,
    },//个人信息
    AmendUserImg: {
        screen: AmendUserImg,
    },//修改头像
    Accomplished: {
        screen: Accomplished,
    },//擅长理由-android
    AccomplishedIOS: {
        screen: AccomplishedIOS,
    },//擅长理由-IOS
    Nominate: {
        screen: Nominate,
    },//个人简介-android
    NominateIOS: {
        screen: NominateIOS,
    },//个人简介-IOS
    Approve: {
        screen: Approve,
    },//认证信息
    Protocol: {
        screen: Protocol,
    },//平台协议
    SetUp: {
        screen: SetUp,
    },//设置
    RevisePassword: {
        screen: RevisePassword,
    },//修改密码
    FeedBack: {
        screen: FeedBack,
    },//意见反馈
    FeedBackIOS: {
        screen: FeedBackIOS,
    },//意见反馈-IOS
    About: {
        screen: About,
    },//关于
    Tidings: {
        screen: Tidings,
    },//消息
    Search: {
        screen: Search,
    },//搜索
    SearchMore:{
        screen: SearchMore,
    },//搜索更多
    SearchDoctor:{
        screen: SearchDoctor,
    },// 搜索医生医院
    SearchDoctorMore:{
        screen: SearchDoctorMore,
    },// 搜索医生医院更多
    ChatHistory:{
        screen: ChatHistory,
    },// 聊天记录
    Chat:{
        screen: Chat,
    },// 聊天
    FoundSuccess:{
        screen: FoundSuccess,
        navigationOptions: {
            gesturesEnabled: false,
        }
    },// 创建成功
    Expert: {
        screen: Expert,
    },//会诊专家
    SelectExperts: {
        screen: SelectExperts,
    },//选专家
    Synopsis:{
        screen: Synopsis,
    },// 医院简介
    ExpertsInfo: {
        screen: ExpertsInfo,
    },//专家信息
    ExpertLaunch: {
        screen: ExpertLaunch,
    },//专家发起会诊
    Library: {
        screen: Library,
    },//病历库
    LibraryInfo: {
        screen: LibraryInfo,
    },//病历详情
    Pool: {
        screen: Pool,
    },//病历池
    CaseHistoryInfo: {
        screen: CaseHistoryInfo,
    },//病历详情
    Launch: {
        screen: Launch,
        navigationOptions: {
            gesturesEnabled: false,
        }
    },//发起会诊
    SelectHospital: {
        screen: SelectHospital,
    },//选医院－发起会诊
    SelectDoctor: {
        screen: SelectDoctor,
    },//选医生－发起会诊
    DoctorInfo: {
        screen: DoctorInfo,
    },//医生信息
    InPool: {
        screen: InPool,
    },//投入病历池
    Login: {
        screen: Login,
        navigationOptions: {
            gesturesEnabled: false,
        }
    },//密码登录
    SmsLogin: {
        screen: SmsLogin,
    },//验证码登录
    Register: {
        screen: Register,
    },//注册
    RetrievePassword: {
        screen: RetrievePassword,
    },// 找回密码
    AttestationOne: {
        screen: AttestationOne,
    },//认证第一步
    AttestationTwo: {
        screen: AttestationTwo,
    },//认证第二步
    AttestationThree: {
        screen: AttestationThree,
    },//认证第三步
    Autograph: {
        screen: Autograph,
    },//电子签名页面
    ZoomImg:{
        screen: ZoomImg,
    },
    PhotoView:{
        screen: PhotoView,
    },
}, {
    initialRouteName: 'Start',
});


const TabOptions = (tabBarTitle, normalImage, selectedImage) => {
    const tabBarLabel = tabBarTitle;
    const tabBarIcon = (({tintColor, focused}) => {
        return (
            <View style={styles.tabBox}>
                <Image
                    source={!focused ? normalImage : selectedImage}
                    style={[styles.tabImg, {tintColor: tintColor}]}
                />
                <Text style={[{
                    color: focused ? '#566cb7' : '#676666',
                    paddingTop: Platform.OS === 'ios' ? 4 : 0,
                }, styles.tabText]}>{tabBarTitle}</Text>
            </View>
        )
    });

    const tabBarVisible = true;
    return {tabBarLabel, tabBarIcon, tabBarVisible};
};

const styles = StyleSheet.create({
    tabBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabImg: {
        // width: 22,
        // height: 22,
    },
    tabText: {
        fontSize: 12,
    },
});

export default App;