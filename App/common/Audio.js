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
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import {Global} from './Global';
import px2dp from "./Tool";
import {requestUrl} from "../Network/url";

// AVAudioQualityMin    最小的质量
// AVAudioQualityLow    比较低的质量
// AVAudioQualityMedium 中间的质量
// AVAudioQualityHigh   高的质量
// AVAudioQualityMax    最好的质量

let sound = {};
let timer = null;
let loaded = null;
let timer1 = null;
export default class Audio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0,
            playTime: 0,
            recording: false,
            stoppedRecording: false,
            finished: false,
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
            hasPermission: undefined,
            status: 'record',// record 录制 stop 停止 play 播放 pause 暂停 resume 继续
            consultationId: '',// 订单id
            delFile: '',// 文件路径
        }
    };

    prepareRecordingPath(audioPath) {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "High",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    componentWillMount() {
        timer1 = setInterval(() => {
            if (this.props.data) {
                let data = this.props.data;
                this.setState({
                    consultationId: data.consultationId,
                    delFile: data.delFile,
                });
            }
            if (this.props.data.videoUrl !== '') {
                clearInterval(timer1);
                sound = new Sound(this.props.data.videoUrl, '', (error) => {
                    if (error) {
                        this.props.isLoad(false);
                        clearInterval(loaded);
                        this.setState({
                            status: 'record',
                        })
                    }
                });
                loaded = setInterval(() => {
                    if (sound.isLoaded()) {
                        this.setState({
                            currentTime: Math.floor(sound.getDuration()),
                        });
                        this.props.isLoad(false);
                        this.setState({
                            status: 'play',
                        });
                        clearInterval(loaded);
                    }
                }, 500)
            }
        }, 500);

    }

    componentDidMount() {
        this._checkPermission().then((hasPermission) => {
            this.setState({hasPermission});

            if (!hasPermission) return;

            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                if (Math.floor(data.currentTime) >= 300) {
                    this._stop();
                    this.setState({
                        status: 'play',
                    })
                }
                this.setState({
                    currentTime: Math.floor(data.currentTime),
                });
            };
        });
    }

    _checkPermission() {
        if (IOS) {
            return Promise.resolve(true);
        }

        const rationale = {
            'title': 'Microphone Permission',
            'message': 'AudioExample needs access to your microphone so you can record audio.'
        };

        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
            .then((result) => {
                console.log('Permission result:', result);
                return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
            });
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

    // 录音停止
    async _stop() {
        if (!this.state.recording) {
            console.log('没有权限');
            return;
        }
        AudioRecorder.stopRecording();
        this.setState({stoppedRecording: true, recording: false});

        sound = new Sound(this.state.audioPath, '', (error) => {
            if (error) {
                console.log('failed to load the sound', error);
            }
        });
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

    // 录制
    async _record() {
        if (this.state.recording) {
            console.log('录制中...');
            return;
        }

        if (!this.state.hasPermission) {
            console.log('不能录制');
            return;
        }

        if (this.state.stoppedRecording) {
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({recording: true});

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }


    renderButton() {
        // record录制 stop停止 play播放 pause暂停 resume继续
        if (this.state.status === 'record') {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this._record();
                        this.setState({
                            status: 'stop',
                        })
                    }}
                    activeOpacity={.8}
                    style={styles.click}
                >
                    <View style={styles.audioBox}>
                        <Image source={require('../images/tape_false.png')}/>
                        <Text style={styles.audioText}>点击录音</Text>
                    </View>
                </TouchableOpacity>
            )
        } else if (this.state.status === 'stop') {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this._stop();
                        this.setState({
                            status: 'play',
                        });
                        this.props.callback(this.state.audioPath);
                        this.props.callbackTime(this.state.currentTime);

                    }}
                    activeOpacity={.8}
                    style={styles.click}
                >
                    <View style={styles.audioBox}>
                        <Image source={require('../images/tape_true.png')}/>
                        <Text style={styles.audioText}>点击停止</Text>
                        <Text style={styles.time}>{this._Time(this.state.currentTime)}/5:00</Text>
                    </View>
                </TouchableOpacity>
            )
        } else if (this.state.status === 'play') {
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
                        }}
                        activeOpacity={.8}
                        style={styles.click}
                    >
                        <View style={styles.audioBox}>
                            <Image source={require('../images/tape_false.png')}/>
                            <Text style={styles.audioText}>点击播放</Text>
                            <Text style={styles.time}>{this._Time(this.state.currentTime)}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert('', '确定要删除？', [
                                {
                                    text: '取消', onPress: () => {
                                }
                                },
                                {
                                    text: '确认', onPress: () => {
                                    sound.release();
                                    this.setState({
                                        status: 'record',
                                    });
                                    this.deleteFile();
                                    this.props.callback('');
                                }
                                },
                            ]);
                        }}
                        activeOpacity={.8}
                    >
                        <View style={styles.delBox}>
                            <Text style={styles.delText}>
                                删除录音
                            </Text>
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
                            this._play();
                            sound.setCurrentTime(0);
                            this.setState({
                                status: 'pause',
                                playTime: 0,
                            });

                        }}
                        activeOpacity={.8}
                    >
                        <View style={styles.replayBox}>
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
                            Alert.alert('', '确定要删除？', [
                                {
                                    text: '取消', onPress: () => {
                                }
                                },
                                {
                                    text: '确认', onPress: () => {
                                    sound.release();
                                    this.setState({
                                        status: 'record',
                                    });
                                    this.deleteFile();
                                    this.props.callback('');
                                }
                                },
                            ]);
                        }}
                        activeOpacity={.8}
                    >
                        <View style={styles.delBox}>
                            <Text style={styles.delText}>
                                删除
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
                        <View style={styles.replayBox}>
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
                            Alert.alert('', '确定要删除？', [
                                {
                                    text: '取消', onPress: () => {
                                }
                                },
                                {
                                    text: '确认', onPress: () => {
                                    sound.release();
                                    this.setState({
                                        status: 'record',
                                    });
                                    this.deleteFile();
                                    this.props.callback('');
                                }
                                },
                            ]);
                        }}
                        activeOpacity={.8}
                    >
                        <View style={styles.delBox}>
                            <Text style={styles.delText}>
                                删除
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

    deleteFile() {
        let formData = new FormData();
        formData.append("consultationId", this.state.consultationId);//
        formData.append("filePath", this.state.delFile);//
        console.log(formData);
        fetch(requestUrl.deleteFile, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
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
        borderWidth: Pixel,
        borderColor: '#7388d0',
        borderRadius: px2dp(5),
        backgroundColor: "#FFF",
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
        borderWidth: Pixel,
        borderColor: '#ff4b4b',
        borderRadius: px2dp(5),
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
        marginRight: px2dp(10),
        borderWidth: Pixel,
        borderColor: '#7388d0',
        borderRadius: px2dp(5),
    },
    replayText: {
        fontSize: FONT_SIZE(14),
        color: '#7388d0',
    }
});

