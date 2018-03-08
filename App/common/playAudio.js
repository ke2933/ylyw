import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    PermissionsAndroid,
    Image,
} from 'react-native';

import Sound from 'react-native-sound';
import {Global} from './Global';
import px2dp from "./Tool";


let sound = {};
let timer = null;
let loaded = null;
let timer1 = null;
export default class playAudio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0,
            playTime: 0,
            audioPath: '',
            status: 'play',// play 播放 pause 暂停 resume 继续
        }
    };


    componentWillMount() {
        timer1 = setInterval(() => {
            if (this.props.data !== '') {
                clearInterval(timer1);
            }
            sound = new Sound(this.props.data, '', (error) => {
                if (error) {
                    console.log(error);
                    this.props.isLoad(false);
                }
            });
            this.setState({
                status: 'play',
            });
            loaded = setInterval(() => {
                if (sound.isLoaded()) {
                    this.setState({
                        currentTime: Math.floor(sound.getDuration()),
                    });
                    this.props.isLoad(false);
                    clearInterval(loaded);
                }
            }, 500);
        }, 500);
    }


    _Time(number) {
        let minute = parseInt(number / 60);
        number %= 60;
        if (number >= 10) {
            return minute + ':' + number;
        } else {
            return minute + ':0' + number;
        }
    }

    // 播放
    async _play() {
        if (this.state.recording) {
            await this._stop();
        }
        clearInterval(timer);
        timer = setInterval(() => {
            this.setState({
                playTime: this.state.playTime += 1,
            });
            if (this.state.playTime >= this.state.currentTime) {
                clearInterval(timer);
            }
        }, 1000);
        sound.play((success) => {
            if (success) {
                console.log('success');
                this.setState({
                    status: 'play',
                })
            } else {
                console.log('errors');
            }
        });

    }

    async _pause() {
        clearInterval(timer);
        sound.pause();
    }

    renderButton() {
        // record录制 stop停止 play播放 pause暂停 resume继续
        if (this.state.status === 'play') {
            return (
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity
                        onPress={() => {

                            this._play();
                            this.setState({
                                status: 'pause',
                                playTime: 0,
                                currentTime: Math.floor(sound.getDuration()),
                            });
                            console.log(sound.isLoaded())
                        }}
                        activeOpacity={.8}
                        style={styles.click}
                    >
                        <View style={[styles.audioBox, styles.leftBox, styles.rightBox]}>
                            <Image source={require('../images/tape_false.png')}/>
                            <Text style={styles.audioText}>点击播放</Text>
                            <Text style={styles.time}>{this._Time(this.state.currentTime)}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            )
        } else if (this.state.status === 'pause') {
            return (
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity
                        onPress={() => {
                            sound.stop();
                            sound.setCurrentTime(0);
                            this._play();
                            this.setState({
                                status: 'pause',
                                playTime: 0,
                            });

                        }}
                        activeOpacity={.8}
                    >
                        <View style={[styles.replayBox, styles.leftBox]}>
                            <Text style={styles.replayText}>
                                重播
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this._pause();
                            this.setState({
                                status: 'resume',
                            })
                        }}
                        activeOpacity={.8}
                        style={styles.click}
                    >
                        <View style={styles.audioBox}>
                            <Image source={require('../images/tape_true.png')}/>
                            <Text style={styles.audioText}>暂停播放</Text>
                            <Text
                                style={styles.time}>{this._Time(this.state.playTime)}/{this._Time(this.state.currentTime)}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            sound.stop();
                            sound.setCurrentTime(0);
                            this.setState({
                                status: 'play',
                                playTime: 0,
                            })
                        }}
                        activeOpacity={.8}
                    >
                        <View style={[styles.delBox, styles.rightBox]}>
                            <Text style={styles.delText}>
                                停止
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        } else if (this.state.status === 'resume') {
            return (
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity
                        onPress={() => {
                            sound.stop();
                            sound.setCurrentTime(0);
                            this._play();
                            this.setState({
                                status: 'pause',
                                playTime: 0,
                            });
                        }}
                        activeOpacity={.8}
                    >
                        <View style={[styles.replayBox, styles.leftBox]}>
                            <Text style={styles.replayText}>
                                重播
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this._pause();
                            this._play();
                            this.setState({
                                status: 'pause',
                            });
                        }}
                        activeOpacity={.8}
                        style={styles.click}
                    >
                        <View style={styles.audioBox}>
                            <Image source={require('../images/tape_false.png')}/>
                            <Text style={styles.audioText}>继续播放</Text>
                            <Text
                                style={styles.time}>{this._Time(this.state.playTime)}/{this._Time(this.state.currentTime)}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            sound.stop();
                            sound.setCurrentTime(0);
                            this.setState({
                                status: 'play',
                                playTime: 0,
                            })
                        }}
                        activeOpacity={.8}
                    >
                        <View style={[styles.delBox, styles.rightBox]}>
                            <Text style={styles.delText}>
                                停止
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    render() {

        return (
            <View style={styles.container}>
                {this.renderButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: px2dp(35),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    click: {
        flex: 1,
    },
    audioBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e2e9ff",
    },
    audioText: {
        marginLeft: px2dp(10),
        color: '#566cb7',
        fontSize: FONT_SIZE(14),
    },

    time: {
        marginLeft: px2dp(6),
        fontSize: FONT_SIZE(14),
        color: '#566cb7',
    },
// 删除box
    delBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        marginLeft: px2dp(10),
        backgroundColor: 'pink'
    },
    delText: {
        fontSize: FONT_SIZE(14),
        color: '#ff4b4b',
    },
    // 重播

    replayBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        marginRight: Pixel,
        backgroundColor: '#e2e9ff',
    },
    replayText: {
        fontSize: FONT_SIZE(14),
        color: '#7388d0',
    },
    leftBox: {
        borderTopLeftRadius: px2dp(17.5),
        borderBottomLeftRadius: px2dp(17.5),
        marginRight: Pixel,
    },
    rightBox: {
        borderTopRightRadius: px2dp(17.5),
        borderBottomRightRadius: px2dp(17.5),
        marginLeft: Pixel,
    },
});

