import React, {Component} from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';

import BackgroundTimer from 'react-native-background-timer';

export default class SmsLogin extends Component {
    static defaultProps = {
        codeTime: 60,
        click: function(){}
    };
    constructor(props) {
        super(props);
        this.state = {
            codeFlag: true,
            timerCount: 60,
            timerTitle: '发送',
        }
    }
    componentWillUnmount() {
        // BackgroundTimer.clearInterval(this.timer);
        BackgroundTimer.stopBackgroundTimer();
    }


    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.state.codeFlag ? this.prpos.click() : null
                }}
                activeOpacity={.8}
            >
                <View style={styles.codeBtn}>

                    <Text style={styles.codeBtnText}>
                        {this.state.flag ? this.state.timerTitle : this.state.timerCount + '秒'}
                    </Text>

                </View>
            </TouchableOpacity>
        )
    }

    _setInterval() {
        // this.timer = BackgroundTimer.setInterval(() => {
        BackgroundTimer.runBackgroundTimer(() => {
            this.setState({flag: false});
            let timer = this.state.timerCount - 1;
            if (timer <= 0) {
                // this.timer && BackgroundTimer.clearInterval(this.timer);
                BackgroundTimer.stopBackgroundTimer();
                this.setState({
                    timerCount: this.props.codeTime,
                    timerTitle: '重新发送',
                    flag: true,
                })
            } else {
                this.setState({
                    timerCount: timer,
                    timerTitle: '重新发送',
                })
            }
        }, 1000);
    }
};
const styles = StyleSheet.create({
    codeBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 34,
        borderRadius: 7,
        backgroundColor: '#566cb7',
    },
    codeBtnText: {
        fontSize: 16,
        color: '#fffefe',
    },

});




