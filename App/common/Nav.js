import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ToastAndroid,
    Platform,
    PixelRatio
} from 'react-native';
import {Global} from './Global';
import px2dp from "./Tool";

class Nav extends React.Component {
    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {}
    }

    _renderLeftBtn() {
        let {goBack, state} = this.props.navigation;
        if (this.props.data.leftBtn) {
            return (<TouchableOpacity
                style={{
                    paddingRight: px2dp(25),
                    paddingLeft: px2dp(19),
                    justifyContent: 'center',
                    height: 45,
                }}
                onPress={() => {
                    this.props.leftClick()
                }}
                activeOpacity={0.8}
            >
                <Image source={require('../images/back.png')} style={styles.back}/>
            </TouchableOpacity>)
        }
    }

    _renderRightBtn() {
        let navigation = this.props.navigation;
        let rightBtn = this.props.data.rightBtn;
        if (rightBtn.type === 'nav') {
            return (
                <TouchableOpacity
                    style={{
                        paddingRight: px2dp(13),
                        paddingLeft: px2dp(13),
                        justifyContent: 'center',
                        height: 45,
                    }}
                    onPress={() => {
                        RouteName.splice(0, RouteName.length);
                        navigation.navigate(rightBtn.btnNav);
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={styles.navText}>{rightBtn.navText}</Text>
                </TouchableOpacity>
            )
        } else if (rightBtn.type === 'btn') {
            return (
                <TouchableOpacity
                    onPress={rightBtn.click}
                    activeOpacity={.8}
                    style={{
                        paddingRight: px2dp(19),
                        paddingLeft: px2dp(13),
                        justifyContent: 'center',
                        height: 45,
                    }}
                >
                    <Text style={[styles.btnText, rightBtn.textStyle]}>{rightBtn.btnText}</Text>
                </TouchableOpacity>
            )
        } else if (rightBtn.type === 'CountDown') {
            return (
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 45,
                    paddingRight: px2dp(15),
                }}>
                    <rightBtn.assemblyName style={{color: '#F08058', fontSize: FONT_SIZE(16),}}
                                           duration={rightBtn.duration}
                                           beginTime={rightBtn.beginTime}/>
                </View>
            )
        } else if (rightBtn.type === 'upLoadImg') {
            return (
                <rightBtn.assemblyName type={'add'} changeImg={rightBtn.changeImg}/>
            )
        } else if (rightBtn.type === 'text') {
            return (
                <View style={{
                    paddingRight: px2dp(19),
                    paddingLeft: px2dp(13),
                    justifyContent: 'center',
                    height: 45,
                }}>
                    <Text style={styles.rightText}>{rightBtn.text}</Text>
                </View>
            )
        } else if (rightBtn.type === 'img') {
            return (
                <TouchableOpacity
                    onPress={rightBtn.click}
                    activeOpacity={.8}
                    style={{
                        height: 45,
                        justifyContent: 'center',
                        paddingRight: px2dp(15),
                        paddingLeft: px2dp(12),
                    }}
                >
                    <Image source={rightBtn.url}/>
                </TouchableOpacity>
            )
        } else if (rightBtn.type === 'select') {
            return (
                <TouchableOpacity
                    onPress={rightBtn.click}
                    activeOpacity={.8}
                    style={{
                        height: 45,
                        justifyContent: 'center',
                        paddingRight: px2dp(15),
                        paddingLeft: px2dp(12),
                    }}
                >
                    <View style={styles.navRightBtn}>
                        <Image source={require('../images/select.png')}/>
                        <Text style={styles.navRightBtnText}>筛选</Text>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.left}>
                    {this._renderLeftBtn()}
                </View>
                <View style={styles.center}>
                    <Text numberOfLines={1} style={styles.title}>{this.props.data.title}</Text>
                </View>
                <View style={styles.right}>
                    {this._renderRightBtn()}
                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: IOS ? 65 : 45,
        paddingTop: IOS ? 20 : 0,
        backgroundColor: "#566CB7",
        justifyContent: 'center',
        alignItems: 'center',
    },
    left: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        minWidth: px2dp(28),
    },
    back: {
        // width: 9,
        // height: 16,
    },
    center: {
        height: 45,
        justifyContent: 'center',
    },
    title: {
        width: SCREEN_WIDTH * .6,
        textAlign: 'center',
        color: '#fff',
        fontSize: FONT_SIZE(20),
    },
    right: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        minWidth: px2dp(28),
    },
    navText: {
        color: '#ADC0FF',
        fontSize: FONT_SIZE(16),
    },
    btnBox: {
        borderWidth: Pixel,
        borderColor: '#adc0ff',
        borderRadius: px2dp(5),
        paddingTop: px2dp(3),
        paddingLeft: px2dp(10),
        paddingBottom: px2dp(3),
        paddingRight: px2dp(10),
    },
    btnText: {
        fontSize: FONT_SIZE(15),
        color: '#7287cd',
    },
    rightText: {
        color: '#ADC0FF',
        fontSize: FONT_SIZE(16),
    },

    navRightBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
    },
    navRightBtnText: {
        marginLeft: px2dp(5),
        fontSize: FONT_SIZE(14),
        color: '#fff',
    },
});

module.exports = Nav;