import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import BackgroundTimer from 'react-native-background-timer';//锁屏倒计时

class CountDown extends Component {
    static defaultProps = {
        // countDown: 0,
    };

    constructor(props) {
        super(props);
        this.state = {
            timerText: '00:00:00',
            surplus: 0,
            // duration: '',
            // beginTime:'',
        }
    }

    componentWillMount() {
        // this.timer && BackgroundTimer.stopBackgroundTimer();
        // this.timer && clearInterval(this.timer);
        this.timer && BackgroundTimer.clearInterval(this.timer);// 0.14
        if (this.props.duration !== '' && this.props.beginTime !== '') {
            let beginTime = this.props.beginTime;// 开始时间
            let total = this.props.duration * 1;// 持续时间
            let mydate = new Date();
            let newTime = mydate.getTime();//当前毫秒数
            let yyyy = beginTime.split(" ")[0];
            let dddd = beginTime.split(" ")[1];
            let year = yyyy.split('-')[0];
            let month = yyyy.split('-')[1] - 1;
            let day = yyyy.split('-')[2];
            let hours = dddd.split(':')[0];
            let minutes = dddd.split(':')[1];
            let seconds = dddd.split(':')[2];
            mydate.setFullYear(year * 1);
            mydate.setMonth(month * 1);
            mydate.setDate(day * 1);
            mydate.setHours(hours * 1);
            mydate.setMinutes(minutes * 1);
            mydate.setSeconds(seconds * 1);
            let oldTime = mydate.getTime();//初始毫秒数
            if (newTime - oldTime > total) {
                this.setState({
                    timerText: '00:00:00',
                });
                // this.timer && BackgroundTimer.stopBackgroundTimer();
                // this.timer && clearInterval(this.timer);
                this.timer && BackgroundTimer.clearInterval(this.timer);// 0.14
            } else {
                let surplus = Number(total) - Number(newTime) + Number(oldTime);
                surplus = parseInt(surplus / 1000);
                this.setState({
                    surplus: surplus,
                });
            }
        }
    }

    componentDidMount() {
        this._startTimer();
    }

    componentWillUnmount() {
        // this.timer && BackgroundTimer.stopBackgroundTimer();
        // this.timer && clearInterval(this.timer);
        this.timer && BackgroundTimer.clearInterval(this.timer);// 0.14
    }


    render() {
        return (
            <Text style={this.props.style}>{this.state.timerText}</Text>
        )
    }

    _addPreZero(e) {
        if (e < 10) {
            return '0' + e;
        } else {
            return e;
        }
    }

    _timeOperation() {
        let timer = this.state.surplus - 1;
        let time = this.state.surplus;
        let hour = parseInt(time / 3600);
        time %= 3600;
        let minute = parseInt(time / 60);
        time %= 60;
        if (timer <= 0) {
            this.setState({
                timerText: '00:00:00',
            });
            // this.timer && BackgroundTimer.stopBackgroundTimer();
            // this.timer && clearInterval(this.timer);
            this.timer && BackgroundTimer.clearInterval(this.timer);// 0.14
        } else {
            this.setState({
                surplus: timer,
                timerText: this._addPreZero(hour) + ':' + this._addPreZero(minute) + ':' + this._addPreZero(time),
            })
        }
    }

    //开启定时器
    _startTimer() {
        // this.timer = BackgroundTimer.runBackgroundTimer(() => {
        // this.timer = setInterval(() => {
        this.timer = BackgroundTimer.setInterval(() => {
            this._timeOperation();
        }, 1000);
    }
}

module.exports = CountDown;



