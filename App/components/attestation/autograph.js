import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    BackHandler,
} from 'react-native';

import Nav from '../../common/Nav';//导航
import SignatureCapture from 'react-native-signature-capture';
import {Global} from '../../common/Global';
import Orientation from 'react-native-orientation';
import Toast, {DURATION} from 'react-native-easy-toast';//弱提示

class RNSignatureExample extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            autographFlag: false,// 是否签名
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
        const {goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
                <Nav navigation={this.props.navigation}
                     leftClick={() => {
                         Orientation.lockToPortrait();
                         goBack()
                     }}
                     data={{
                         'leftBtn': true,
                         'title': '签名',
                         'rightBtn': {
                             type: 'btn',
                             btnText: '清除',
                             click: this.resetSign.bind(this),
                             textStyle: {color: '#fff'}
                         }
                     }}/>


                <SignatureCapture
                    style={styles.signature}
                    ref="sign"
                    onSaveEvent={this._onSaveEvent.bind(this)}
                    onDragEvent={this._onDragEvent.bind(this)}
                    saveImageFileInExtStorage={false}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    viewMode={"landscape"}/>
                <View style={{flex: 1, flexDirection: "row"}}>
                    <TouchableOpacity style={styles.buttonStyle}
                                      onPress={() => {
                                          this.saveSign()
                                      }}>
                        <Text style={styles.buttonTextStyle}>保存</Text>
                    </TouchableOpacity>
                </View>
                <Toast
                    ref='toast'
                    style={{backgroundColor: '#333333', borderRadius: 10,}}
                    position={'top'}
                    textStyle={{color: '#ffffff', fontSize: 16,}}
                    fadeInDuration={1000}
                    opacity={.8}
                />
            </View>
        );
    }

    saveSign() {
        this.refs["sign"].saveImage();
    }

    resetSign() {
        this.setState({autographFlag: false,});
        this.refs["sign"].resetImage();
    }

    _onSaveEvent(result) {
        if (this.state.autographFlag) {
            this.props.navigation.state.params.callback(`file://${result.pathName}`);
            Orientation.lockToPortrait();
            this.props.navigation.goBack();
        } else {
            this.refs.toast.show('请签名');
        }

    }

    _onDragEvent() {
        this.setState({
            autographFlag: true,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    signature: {
        width: SCREEN_HEIGHT,
        height: IOS ? SCREEN_WIDTH - 125 : SCREEN_WIDTH - StatusBarHeight - px2dp(105),
    },
    buttonStyle: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: px2dp(50),
        backgroundColor: "#eeeeee",
        margin: px2dp(5),

    },
    buttonTextStyle: {
        fontSize: FONT_SIZE(20),
    },
});

export default RNSignatureExample;