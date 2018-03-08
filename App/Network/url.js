// const IP = 'http://120.78.76.72/FDC';// 云


// const IP = "http://192.168.0.110";//
// const IP = "http://192.168.0.222";// 马
// const IP = 'http://192.168.0.123';//薛
const IP = 'http://120.78.76.72/FDC';//云
// const WS = 'ws://192.168.0.222';//马
// const WS = 'ws://192.168.0.123';//薛
const WS = 'ws://120.78.76.72/FDC';//云

export let requestUrl = {
    "IP": IP,
    "WS": WS,
    "ImgIp": "http://120.78.76.72",
// 登录医生信息
    "baseInfo": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/baseInfo",//登录医生信息
    "getId": IP + "/f/0.0.1-SNAPSHOT/fdc/check/getId",//登录医生id
    "initDeviceToken": IP + "/f/0.0.1-SNAPSHOT/im/deviceToken/initDeviceToken",//IOS token

// 首页
    "bannerUrl": IP + "/f/0.0.1-SNAPSHOT/fdc/banner/bannerList",//banner图片接口
    "homeSearch": IP + "/f/0.0.1-SNAPSHOT/fdc/banner/homeSearch",//首页搜索
    "viewMore": IP + "/f/0.0.1-SNAPSHOT/fdc/banner/viewMore",//首页搜索更多

// 聊天
    "getChatRoom": IP + "/f/0.0.1-SNAPSHOT/im/chatRoomDoctor/getChatRoom",//获取聊天室id
    "getChatRoomById": IP + "/f/0.0.1-SNAPSHOT/im/chatRoomDoctor/getChatRoomById",//获取已结束订单的聊天室
    "selectDoctorDetailIdByDoctorId": IP + "/f/0.0.1-SNAPSHOT/fdc/doctorDetail/selectDoctorDetailIdByDoctorId",
    "getChatRecord": IP + "/f/0.0.1-SNAPSHOT/im/doctorInform/getChatRecord?chatRoomId=",// 未读记录
    "getAllChatRecord": IP + "/f/0.0.1-SNAPSHOT/im/doctorInform/getAllChatRecord?chatRoomId=",// 未读记录
    "getChatRecordHistory": IP + "/f/0.0.1-SNAPSHOT/im/doctorInform/getChatRecordHistory",// 未读记录

// 消息
//     "getUnReadCount": IP + "/f/0.0.1-SNAPSHOT/im/doctorInform/getUnReadCount",//查询未读消息记录数
//     "getSysInform": IP + "/f/0.0.1-SNAPSHOT/im/doctorInform/getSysInform",//查询未读系统消息
//     "getSysInformHistory": IP + "/f/0.0.1-SNAPSHOT/im/doctorInform/getSysInformHistory",//查系统消息记录分页
//     "getOrderInform": IP + "/f/0.0.1-SNAPSHOT/im/doctorInform/getOrderInform",//查询未读订单消息
//     "getOrderInformHistory": IP + "/f/0.0.1-SNAPSHOT/im/doctorInform/getOrderInformHistory",//查订单消息分页


    "responsibleArea": IP + "/f/0.0.1-SNAPSHOT/fdc/doctorDetail/responsibleArea",//通过登录医生获取医生责任区域id


// 登录注册
    "registerSend": IP + "/f/0.0.1-SNAPSHOT/fdc/fdcSmsInterface/registerSend", // 注册短信接口
    "register": IP + "/f/0.0.1-SNAPSHOT/fdc/doctor/register",//注册接口
    "loginSend": IP + "/f/0.0.1-SNAPSHOT/fdc/fdcSmsInterface/loginSend",//登录短信接口
    "smsLogin": IP + "/f/0.0.1-SNAPSHOT/fdc/doctor/smsLogin",//短信登录接口
    "login": IP + "/f/0.0.1-SNAPSHOT/fdc/doctor/login",// 密码登录接口
    "logout": IP + "/f/0.0.1-SNAPSHOT/fdc/doctor/logout",//退出登录
    "findPassword": IP + "/f/0.0.1-SNAPSHOT/fdc/doctor/findPassword",//6.找回密码
    "updatePassword": IP + "/f/0.0.1-SNAPSHOT/fdc/doctor/updatePassword",//修改密码
    "passwordRetrieval": IP + "/f/0.0.1-SNAPSHOT/fdc/fdcSmsInterface/passwordRetrieval",//找回密码短信验证码

    "againSend": IP + "/f/0.0.1-SNAPSHOT/fdc/fdcSmsInterface/againSend",//phone 0:请求成功2:手机号不能为空3:手机号格式不正确4:帐号不存在

// 认证
    "department": IP + "/f/0.0.1-SNAPSHOT/fdc/oauth/findList",//1.科室选择列表接口
    "title": IP + "/f/0.0.1-SNAPSHOT/fdc/title/findList",//职称选择列表接口
    "likeFindHospital": IP + "/f/0.0.1-SNAPSHOT/fdc/like/likeFindHospital",//3.医院选择列表接口
    "addDoctorTwo": IP + "/f/0.0.1-SNAPSHOT/fdc/oauth/firstOauth",//4.医师认证第一步
    "addOauth": IP + "/f/0.0.1-SNAPSHOT/fdc/oauth/addOauth",//5.医师认证第二步
    "selectOauth": IP + "/f/0.0.1-SNAPSHOT/fdc/oauth/selectOauth",//6.认证信息查询
    "firstOauthQuery": IP + "/f/0.0.1-SNAPSHOT/fdc/oauth/firstOauthQuery",//7.认证第一步信息查询
    "oauthStatus": IP + "/f/0.0.1-SNAPSHOT/fdc/oauth/oauthStatus",//8.查询认证状态


// 我的
    "myCenter": IP + "/f/0.0.1-SNAPSHOT/fdc/doctorDetail/myCenter",//1.个人中心首页接口
    "selectDetail": IP + "/f/0.0.1-SNAPSHOT/fdc/doctorDetail/selectDetail",//2.个人信息查询
    "addDetail": IP + "/f/0.0.1-SNAPSHOT/fdc/doctorDetail/addDetail",//3.医生详细信息补全/修改
    "updateHead": IP + "/f/0.0.1-SNAPSHOT/fdc/doctorDetail/updateHead",//4.医生头像修改
    "myCollection": IP + "/f/0.0.1-SNAPSHOT/fdc/medicalRecordBase/myCollection",//4.我的收藏
    "myCollectionInfo": IP + "/f/0.0.1-SNAPSHOT/fdc/medicalRecordBase/myCollectionInfo",//收藏病历详情
    "feedback": IP + "/f/0.0.1-SNAPSHOT/fdc/banner/feedback",//意见反馈
    "problem": IP + "/f/0.0.1-SNAPSHOT/fdc/commonProblems/problem",//常见问题
// 收益

    "getPurse": IP + "/f/0.0.1-SNAPSHOT/purse/purse/getPurse",//1.收益首页
    "detailList": IP + "/f/0.0.1-SNAPSHOT/purse/detail/detailList",//1.GET收益明细列表
    "getDetail": IP + "/f/0.0.1-SNAPSHOT/purse/detail/getDetail",//GET查询收益明细详情
    "getAccount": IP + "/f/0.0.1-SNAPSHOT/purse/account/getAccount",//1.GET提现页面获取提现方式接口
    "cash": IP + "/f/0.0.1-SNAPSHOT/purse/purse/cash",//POST提现接口(type price)
    "setPassword": IP + "/f/0.0.1-SNAPSHOT/purse/purse/setPassword",//POST设置支付密码 (修改支付密码)(找回密码)
    "checkPaymentPassword": IP + "/f/0.0.1-SNAPSHOT/purse/purse/checkPaymentPassword",//修改支付密码 校验旧密码
    "bindAccount": IP + "/f/0.0.1-SNAPSHOT/purse/account/bindAccount",//绑定提现账户接口(accountType accountNumber)
    "removeAccount": IP + "/f/0.0.1-SNAPSHOT/purse/account/removeAccount",//删除绑定的提现账户(accoundId)
    "getSmsCode": IP + "/f/0.0.1-SNAPSHOT/purse/purse/getSmsCode",//找回密码获取短信验证码
    "checkPaymentPasswordInform": IP + "/f/0.0.1-SNAPSHOT/purse/purse/checkPaymentPasswordInform",//找回密码 信息认证
    "getLoginPhone": IP + "/f/0.0.1-SNAPSHOT/purse/purse/getLoginPhone",//获取当前登陆手机号 隐藏的

    // 提现
    "addBankCard": IP + "/f/0.0.1-SNAPSHOT/fdc/doctorBankCard/addBankCard",//绑定银行卡
    "unbundlingBankCard": IP + "/f/0.0.1-SNAPSHOT/fdc/doctorBankCard/unbundlingBankCard",//解绑银行卡
    "findBankCard": IP + "/f/0.0.1-SNAPSHOT/fdc/doctorBankCard/findBankCard",//查询银行卡信息
    "appEncashment": IP + "/f/0.0.1-SNAPSHOT/fdc/encashment/appEncashment",//申请提现借口
    "compareDate": IP + "/f/0.0.1-SNAPSHOT/fdc/encashment/compareDate",// 当月提现次数

// 发起会诊
    "selectCountry": IP + "/f/0.0.1-SNAPSHOT/fdc/like/selectCountry",// 获取全国的id
    "selectCityByHospital": IP + "/f/0.0.1-SNAPSHOT/fdc/like/selectCityByHospital",// 获取有医院的省份
    "medicalRecordDept": IP + "/f/0.0.1-SNAPSHOT/fdc/medicalRecordBase/medicalRecordDept",// 两级科室
    "getUseTwoDept": IP + "/f/0.0.1-SNAPSHOT/fdc/like/getUseTwoDept",// 通过地区查询有医生的科室
    "selectDepartment": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/selectDepartment",//获取当前登录医生科室
    "queryProvince": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/queryProvince",//获取本省接口,
    "likeDisease": IP + "/f/0.0.1-SNAPSHOT/fdc/like/likeDisease",//疾病模糊搜索
    "findList": IP + "/f/0.0.1-SNAPSHOT/fdc/department/findList",//科室选择列表接口
    "findHospital": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/findHospital",//首诊医生通过地区,科室找医院
    "getBaseCity": IP + "/f/0.0.1-SNAPSHOT/fdc/like/getBaseCity",//获取所有省份
    "findDoctor": IP + "/f/0.0.1-SNAPSHOT/fdc/doctorDetail/findDoctor",//找专家 医生列表
    "searchDoctor": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/searchDoctor",//模糊搜索医院科室下的医生

    "findAreaDoctor": IP + "/f/0.0.1-SNAPSHOT/fdc/doctorDetail/findAreaDoctor",//发起会诊 医生列表
    "selectInvitedDoctor": IP + "/f/0.0.1-SNAPSHOT/fdc/doctorDetail/selectInvitedDoctor",//医生信息查询
    "selectHospitalByCity": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/selectHospitalByCity",//通过地区找医院
    "firstScreen": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/firstScreen",//首诊选择筛选
    "search": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/search",//首诊搜索接口
    "searchMore": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/searchMore",//首诊搜索更多
    "addConsultation": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/addConsultation",//发起会诊接口


// 订单

    "partake": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/partake",//订单列表查询
    "orderSize": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/orderSize",//各种订单状态数量
    "queryCase": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/queryCase",//订单详情查询
    "selectConsultationById": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/selectConsultationById",//通过订单id查询订单信息
    "perfectCase": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/perfectCase",//完善电子病历
    "editResult": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/editResult",//编辑会诊结论
    "replyCase": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/replyCase",//会诊医生回复接口(是否接收病历)
    "applyTimeout": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/applyTimeout",//6.	申请延时
    "applyPerfectCase": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/applyPerfectCase",//申请完善病历
    "viewResults": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/viewResults",//草稿信息查询
    "deleteFile": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/deleteFile",//删除已有音频

// 病历库
    "queryMedicalRecord": IP + "/f/0.0.1-SNAPSHOT/fdc/medicalRecordBase/queryMedicalRecord",//查看病历库
    "queryMedicalRecordInfo": IP + "/f/0.0.1-SNAPSHOT/fdc/medicalRecordBase/queryMedicalRecordInfo",//病历库详情
    "collection": IP + "/f/0.0.1-SNAPSHOT/fdc/medicalRecordBase/collection",//收藏/取消收藏病历
    "medicalRecordSearch": IP + "/f/0.0.1-SNAPSHOT/fdc/medicalRecordBase/medicalRecordSearch",//病历库搜索

// 病历池

    "selectCityByPool": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/selectCityByPool",//查询有可接收病历池病历的省份
    "selectPoolHospitalByCity": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/selectPoolHospitalByCity",//查询有可接收病历池病历的医院
    "queryMedicalPool": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/queryMedicalPool",//病历池列表查询
    "screenMedicalPool": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/screenMedicalPool",//病历池筛选
    "findHospitalByCity": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/findHospitalByCity",// 通过地区 科室 找医院
    // 2.	查看病历池信息(调用订单详情查询)
    // 3.	会诊医生接收病历(会诊医生回复接口(是否接收病历))
    "receiveCase": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/receiveCase",//病历池 接收
    "searchMedicalPool": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/searchMedicalPool",//病历池搜索(搜索医生或疾病)

    // 未认证病历池
    "defaultSearchPool": IP + "/f/0.0.1-SNAPSHOT/fdc/consultation/defaultSearchPool",//未认证查病历池
    "defaultSearchMedicalRecord": IP + "/f/0.0.1-SNAPSHOT/fdc/medicalRecordBase/defaultSearchMedicalRecord",//未认证查病历库

};

