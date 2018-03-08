import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Alert,
    Image,
    Dimensions,
    Platform,
    PixelRatio,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ScrollView,
    BackHandler,
} from 'react-native';

import {requestUrl} from '../../Network/url';//接口url
import {RegExp} from '../../Network/RegExp';//正则
import Nav from '../../common/Nav';//导航
import {Global} from '../../common/Global';
import px2dp from "../../common/Tool";

export default class protocol extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            protocolBtn: false,
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

        if (this.props.navigation.state.params) {
            this.setState({
                protocolBtn: true,
            })
        }
    }

    render() {
        const {navigate, goBack, state} = this.props.navigation;
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

                         goBack()
                     }}
                     data={{
                         'leftBtn': true,
                         'title': '协议',
                         rightBtn: {type: false}
                     }}/>

                <ScrollView
                    style={styles.protocolContent}
                >
                    <Text style={styles.protocolTitle}>“医来医往”服务协议</Text>
                    <Text style={styles.protocolHead}>【一般声明】</Text>
                    <Text style={styles.protocolText}>1. 本声明适用于注册或使用“医来医往”旗下的“医来医往”网站、“医来医往”微信公众号、“医来医往”APP（医生端）以及“医来医往”将来开发的互联网及自媒体等系列电子数据平台（下称本平台）的一切用户。“医来医往“的商标所有人为医来医往（北京）科技有限公司（下称本公司）。</Text>
                    <Text style={styles.protocolText}>2. 当您注册或使用“医来医往”旗下网站、APP、微信公众号等提供的服务时，表明您已知晓并同意本声明的内容，这些内容自动成为您与本公司协议的一部分。</Text>
                    <Text
                        style={styles.protocolText}>3.任何使用“医来医往”的用户均应仔细阅读本服务条款，用户可选择不使用“医来医往”，用户使用“医来医往”的行为将被视为对本声明全部内容的认可。</Text>
                    <Text
                        style={styles.protocolText}>4.本服务条款内容包括本服务条款正文及所有“医来医往”发布或将来可能发布的各类管理规定。所有管理规定为本条款不可分割的一部分，与本条款正文具有同等法律效力。</Text>


                    <Text style={styles.protocolHead}>【服务协议】</Text>
                    <Text style={styles.protocolHead}>一、服务协议内容：</Text>
                    <Text
                        style={styles.protocolText}>1.1
                        “医来医往”的具体服务内容由医来医往（北京）科技有限公司在提供，“医来医往”保留随时变更、中断或终止部分或全部网络服务的权利。</Text>
                    <Text
                        style={styles.protocolText}>1.2
                        “医来医往”作为医生、患者间咨询及交流的平台，用户通过“医来医往”发表的所有医学相关内容，用户发表各种言论，并不代表“医来医往”赞同其观点或证实其内容的真实性，也不能作为临床诊断及医疗的依据，不能替代医生与病人面对面的诊疗。</Text>
                    <Text style={styles.protocolText}>1.3
                        “医来医往”仅提供相关的网络平台服务，除此之外与相关网络服务有关的设备（如电脑、调制解调器及其他与接入互联网有关的装置）及所需的费用（如为接入互联
                        网而支付的电话费及上网费）均应由用户自行负担。</Text>
                    <Text
                        style={styles.protocolText}>1.4
                        “医来医往”不承担因用户自身过错、网络状况、通讯线路等任何技术原因或其他不可控原因而导致不能正常使用“医来医往”以及因此引起的损失，亦不承担任何法律责任。</Text>
                    <Text style={styles.protocolHead}>二、用户及注册：</Text>
                    <Text style={styles.protocolText}>“医来医往”提供用户注册，该用户负责保管其帐号和密码；用户应当对以其用户帐号进行的所有活动和事件负法律责任。</Text>
                    <Text
                        style={styles.protocolText}>2.1
                        “医来医往”对于已收录下的医生页面，此医生本人可以进行实名注册认证，进行此操作需医生本人，应填写真实姓名、办公电话等信息，注册成功后，“医来医往”将对其进行身份认证，认证通过者，将给予其认证标志，允许其以医生的名义更改其基本信息、咨询信息、交流需求、发表文章等相关活动。如其提供信息不能证明医生本人注册，“医来医往”有权将网页认证关联信息删除。</Text>
                    <Text style={styles.protocolHead}>三、用户的权利和责任：</Text>
                    <Text style={styles.protocolText}>3.1
                        用户有权利拥有自己在“医来医往”的用户名及密码，并有权利使用自己的用户名及密码随时登陆“医来医往”服务。用户不得以任何形式擅自转让或授权他人使用
                        自己的“医来医往”用户名，亦不得盗用他人帐号，由以上行为造成的后果自负。</Text>
                    <Text
                        style={styles.protocolText}>3.2
                        用户名和昵称的注册与使用应符合网络道德，遵守中华人民共和国的相关法律法规。用户名和昵称中不能含有威胁、淫秽、漫骂、非法、侵害他人权益等有争议性的文字。</Text>
                    <Text style={styles.protocolText}>3.3 用户有权根据本服务条款的规定以及“医来医往”上发布的相关规则在“医来医往”发布、获取信息，进行医患互通交流等；</Text>
                    <Text
                        style={styles.protocolText}>3.4
                        用户对其在“医来医往”上发布的信息承担责任，用户不得发布各类违法或违规信息，不得恶意评价其他用户。用户承诺自己在使用“医来医往”时实施的所有行为均遵守国家法律、法规和“医来医往”的相关规定以及各种社会公共利益或公共道德。如有违反导致任何法律后果的发生，用户将以自己的名义独立承担所有相应的法律责任；</Text>
                    <Text style={styles.protocolText}>3.5
                        所有用户必须遵守国家卫计委《互联网医疗卫生信息服务管理办法》及国家食品药品监督管理局的有关法规，认证医生间及医生患者之间只能提供医疗卫生信息建议，不得从事网上诊断和治疗活动，不得进行网上售药，亦不能进行广告性质宣传活动。本平台提供所有医学信息以及认证医生回答，都只能作为参考，不作为诊断和治疗的依据,
                        不能替代医生与病人面对面的诊疗,如果要就诊，建议病人本人去正规医疗机构；</Text>
                    <Text style={styles.protocolText}>3.6
                        用户不得将涉及医疗纠纷的问题或其它有责任争议的问题在“医来医往”发布，关于医疗纠纷的问题，本站不具备鉴定资格，请另行咨询律师或相关主管部门寻求援助，“医来医往”有权将此类信息删除。</Text>
                    <Text
                        style={styles.protocolText}>3.7
                        用户如发现其他用户有违法或违反本服务条款的行为，可以向“医来医往”进行反映要求处理。如用户因网上与其他用户产生纠纷而诉讼的，用户有权通过司法部门要求“医来医往”提供相关资料。</Text>
                    <Text style={styles.protocolHead}>四、“医来医往”的权利和责任：</Text>
                    <Text
                        style={styles.protocolText}> 4.1
                        “医来医往”作为医生间学术交流、咨询、会诊及医患信息咨询等服务的平台，不对用户发布的信息来源和正确性负责，不参与医医及医患交流，亦不对其结果承担任何责任；</Text>
                    <Text style={styles.protocolText}>4.2 “医来医往”有义务在本公司拥有之技术上维护整个网络平台的正常运行，使用户网上咨询、互助得以顺利进行；</Text>
                    <Text style={styles.protocolText}>4.3 “医来医往”将协助医生、医患之间进行合法的咨询、交流，并提供一定的帮助；</Text>
                    <Text
                        style={styles.protocolText}> 4.4
                        对于用户在“医来医往”上的不当行为或其它任何“医来医往”认为应当终止服务的情况，“医来医往”有权无需征得用户的同意随时作出删除相关信息、终止服务提供等处理。</Text>
                    <Text style={styles.protocolText}>4.5 “医来医往”没有义务对所有用户的注册数据、所有的活动行为以及与之有关的其它事项进行事先审查，但如存在下列情况：</Text>

                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①用户或其它第三方通知“医来医往”，认为某个具体用户或事项可能存在重大问题；</Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②用户或其它第三方向“医来医往”告知网络平台上有违法或不当行为的，“医来医往”可以明显认为这些内容或行为具有违法或不当性质的；“医来医往”有权根据不同情况选择保留或删除相关信息或继续、停止对该用户提供服务，并追究相关法律责任；</Text>
                    <Text style={styles.protocolText}>4.6
                        用户在“医来医往”上如与其它用户产生纠纷，请求“医来医往”从中予以调处，经“医来医往”审核后，“医来医往”有权向纠纷双方了解情况，并将所了解的情况互相通知对方；
                    </Text>
                    <Text style={styles.protocolText}>4.7
                        用户因在“医来医往”上与其它用户产生诉讼的，用户通过司法部门或行政部门依照法定程序要求“医来医往”提供相关数据，“医来医往”应积极配合并提供有关资料；
                    </Text>
                    <Text style={styles.protocolText}>4.8
                        “医来医往”有权对用户的注册数据及活动行为进行查阅，发现注册数据或活动行为中存在任何问题或怀疑，均有权向用户发出询问及要求改正的通知或者直接作出删除等处理；
                    </Text>
                    <Text style={styles.protocolText}>4.9
                        经国家生效法律文书或行政处罚决定确认用户存在违法行为，或者“医来医往”有足够事实依据可以认定用户存在违法或违反服务协议行为的，“医来医往”有权在“医来医往”平台上以网络发布形式公布用户的违法行为；
                    </Text>
                    <Text style={styles.protocolText}>4.10
                        因发生如火灾、水灾、暴动、骚乱、战争、自然灾害等不可抗事故，导致“医来医往”的服务中断或者用户数据损坏、丢失等，“医来医往”无须承担任何责任；
                    </Text>
                    <Text style={styles.protocolText}>4.11 许可使用权：用户以此授予“医来医往”独家的、全球通用的、永久的、免费的许可使用权利，使“医来医往”有权(全部或部分)
                        使用、复制、修订、改写、发布、翻译、分发、执行和展示用户公示于网站的各类信息或制作其派生作品，和/或以现在已知或日后开发的任何形式、媒体或技术，将上述信息纳入其它作品内。
                    </Text>
                    <Text style={styles.protocolHead}>五、服务变更、中断或终止：</Text>
                    <Text style={styles.protocolText}>5.1 如因系统维护或升级的需要而需暂停网络服务，“医来医往”将尽可能事先进行通告。</Text>
                    <Text style={styles.protocolText}>5.2 如发生下列任何一种情形，“医来医往”有权随时中断或终止向用户提供本服务条款项下的网络服务而无需通知用户：</Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.2.1用户自愿注销；
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.2.2用户违反本服务条款或国家有关法律法规，“医来医往”有权随时删除用户；
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.2.3用户被行政或司法机构拘留或起诉；
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.2.4医生认证用户被有关部门吊销执业医师证书；
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.2.5用户提供的个人资料不真实；
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.2.6其它，“医来医往”认为需要终止的情况。
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除前款所述情形外，“医来医往”同时保留在不事先通知用户的情况下随时中断或终止部分或全部网络服务的权利，对于所有服务的中断或终止而造成的任何损失，“医来医往”无需对用户或任何第三方承担任何责任。
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.3用户服务终止后，“医来医往”仍有以下权利：
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.3.1户注销后，“医来医往”有权保留该用户的注册数据及以前的行为记录；
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.3.2用户注销后，如用户在注销前在“医来医往”平台上存在违法行为或违反条款的行为，“医来医往”仍可行使本服务条款所规定的权利；
                    </Text>
                    <Text style={styles.protocolHead}>六、隐私声明：
                    </Text>
                    <Text style={styles.protocolText}>6.1 适用范围</Text>

                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.1.1注册“医来医往网站”“医来医往APP”、“医来医往微信公众号”等本公司旗下产品用户时，用户跟据网站要求提供的个人信息；
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.1.2用户使用“医来医往”服务、参加网站活动、或访问网站网页时，网站自动接收并记录用户浏览器上的服务器数据，包括但不限于IP地址、网站Cookie中的资料及用户要求取用的网页记录；
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.1.3“医来医往”通过合法途径从商业伙伴处取得的用户个人资料。
                    </Text>
                    <Text style={styles.protocolText}>6.2 信息使用
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.2.1医来医往（北京）科技有限公司网站不会向任何人出售或出借用户的个人信息，除非事先得到用户的许可。
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.2.2为服务用户的目的，“医来医往”可能通过使用用户的个人信息，向用户提供服务，包括但不限于向用户发出活动和服务信息等。
                    </Text>
                    <Text
                        style={styles.protocolText}>6.3
                        信息披露：“医来医往”将对用户资料实行保密，承诺一定不会公开、编辑或透露其注册资料及保存在“医来医往”中的非公开内容，除非出现以下任一情况：
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.3.1用户同意，向第三方披露；
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.3.2如用户是符合资格的知识产权投诉人并已提起投诉，应被投诉人要求，向被投诉人披露，以便双方处理可能的权利纠纷；
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.3.3根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.3.4如果用户出现违反中国有关法律或者网站政策的情况，需要向第三方披露；
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.3.5为提供你所要求的服务，而必须和第三方分享用户的个人信息；
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.3.6医生、医患之间的交流、咨询问题内容在隐去用户的姓名、电话、单位、地址等隐私信息后，视为同意“医来医往”对其全部内容的展示及使用，“医来医往”有权在未征得用户同意的情况下对本平台之全部咨询、交流、回复等信息进行使用，包括但不限于公开、分享、编辑、整理、分析、出版、发行等；
                    </Text>
                    <Text
                        style={styles.protocolText}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.3.7其它，“医来医往”根据法律或者网站政策认为合适的披露。
                    </Text>
                    <Text style={styles.protocolHead}>七、免责声明：</Text>
                    <Text style={styles.protocolText}>7.1
                        用户使用“医来医往”服务所存在的风险将完全由其自己承担；因其使用“医来医往”服务而产生的一切后果也由其自己承担，“医来医往”对用户不承担任何责任。
                    </Text>
                    <Text style={styles.protocolText}>7.2 “医来医往”不担保网络服务一定能满足用户的要求，也不担保网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作担保。
                    </Text>
                    <Text
                        style={styles.protocolText}>7.3
                        “医来医往”不保证为向用户提供便利而设置的外部链接的准确性和完整性，同时，对于该等外部链接指向的不由“医来医往”实际控制的任何网页上的内容，医来医往（北京）科技有限公司不承担任何责任。
                    </Text>
                    <Text style={styles.protocolText}>7.4
                        对于因不可抗力或“医来医往”不能控制的原因造成的网络服务中断或其它缺陷，“医来医往”不承担任何责任，但将尽力减少因此而给用户造成的损失和影响。
                    </Text>
                    <Text style={styles.protocolHead}>八、违约赔偿：
                    </Text>
                    <Text style={styles.protocolText}>8.1
                        用户同意保障和维护“医来医往”及其他用户的利益，如因用户违反有关法律、法规或本条款项下的任何条款而给“医来医往”或任何其他第三人造成损失，用户同意承担由此造成的损害赔偿责任
                    </Text>
                    <Text style={styles.protocolHead}>九、服务条款修改：
                    </Text>
                    <Text style={styles.protocolText}>9.1 “医来医往”将有权随时修改本条款的有关条款，一旦本条款的内容发生变动，“医来医往”将会通过适当方式向用户提示修改内容。
                    </Text>
                    <Text
                        style={styles.protocolText}> 9.2
                        如果不同意“医来医往”对本服务条款相关条款所做的修改，用户有权停止使用网络服务。如果用户继续使用网络服务，则视为用户接受“医来医往”对服务条款相关条款所做的修改。
                    </Text>
                    <Text style={styles.protocolHead}>十、法律管辖：
                    </Text>
                    <Text style={styles.protocolText}>10.1 本服务条款的订立、执行和解释及争议的解决均应适用中国法律。
                    </Text>
                    <Text style={styles.protocolText}>10.2
                        如双方就本服务条款内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均可向“医来医往”所在地的人民法院提起诉。
                    </Text>
                    <Text style={styles.protocolText}>十一、其他规定
                    </Text>
                    <Text style={styles.protocolText}>11.1 本服务条款构成双方对服务条款之约定事项及其他有关事宜的完整协议，除服务条款规定的之外，未赋予服务条款各方其他权利。
                    </Text>
                    <Text style={styles.protocolText}>11.2 如本服务条款中的任何条款无论因何种原因完全或部分无效或不具有执行力，本条款的其余条款仍应有效并且有约束力。
                    </Text>
                    <View style={{height: px2dp(20)}}></View>
                </ScrollView>
                {this.state.protocolBtn ? <TouchableOpacity
                    onPress={() => {
                        state.params.callback('1');
                        goBack();
                    }}
                    activeOpacity={.8}
                >
                    <View style={styles.agreeBox}>
                        <Text style={styles.agreeText}>同意协议</Text>
                    </View>
                </TouchableOpacity> : null}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EFEFEF',
        flex: 1,
    },
    protocolContent: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
    },
    protocolTitle: {
        marginTop: px2dp(33),
        textAlign: 'center',
        fontSize: FONT_SIZE(18),
        color: '#212121',
        fontWeight: '500',
    },
    protocolHead: {
        marginTop: px2dp(24),
        lineHeight: px2dp(24),
        fontSize: FONT_SIZE(14),
        fontWeight: '500',
        color: '#212121',
    },
    protocolText: {
        lineHeight: px2dp(24),
        fontSize: FONT_SIZE(14),
        color: '#212121',
    },
    // 同意按钮
    agreeBox: {
        justifyContent: 'center',
        alignItems: 'center',
        height: px2dp(44),
        backgroundColor: Colors.color,
    },
    agreeText: {
        fontSize: FONT_SIZE(16),
        color: '#FFF'
    },
});
