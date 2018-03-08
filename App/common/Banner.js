import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';


import {requestUrl} from '../Network/url';//接口url
import {RegExp} from '../Network/RegExp';//正则
import {Global} from './Global';
import px2dp from "./Tool";
import Carousel from 'react-native-banner-carousel';
import Communications from 'react-native-communications';

class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgArr: [{id: "124444", linkPath: "www.qq.com", picturePath: ""},],
            dataFlag: false,
        }
    }

    componentDidMount() {
        let formData = new FormData();
        if (IOS) {
            formData.append("type", 'IOS');
        } else if (Android) {
            if (SCREEN_HEIGHT / SCREEN_WIDTH >= 1.8) {
                formData.append("type", 'Android2');
            } else {
                formData.append("type", 'Android1');
            }
        }
        console.log(formData)
        fetch(requestUrl.bannerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.status === '0') {
                    this.setState({
                        imgArr: responseData.lists,

                    });
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });

    }


    render() {
        return (
            <View style={{height: IOS ? px2dp(240) : SCREEN_HEIGHT / SCREEN_WIDTH >= 1.8 ? px2dp(220) : px2dp(165)}}>
                <Carousel
                    autoplay
                    autoplayTimeout={2500}
                    loop
                    index={0}
                    pageSize={SCREEN_WIDTH}
                    pageIndicatorContainerStyle={{marginBottom: 5}}// 分页器 的位置
                    pageIndicatorStyle={{backgroundColor: '#fff'}}// 非焦点样式
                    activePageIndicatorStyle={{backgroundColor: '#7082be'}}// 焦点样式
                >
                    {this.state.imgArr.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={1}
                                // onPress={() => Communications.web('http://'+item.linkPath)}
                            >
                                <Image source={{uri: requestUrl.ImgIp + item.picturePath}}
                                       onLoad={() => {
                                           this.setState({
                                               dataFlag: true,
                                           })
                                       }}
                                       onLoadEnd={() => {
                                           this.setState({
                                               dataFlag: true,
                                           })
                                       }}
                                       style={{
                                           width: SCREEN_WIDTH,
                                           height: IOS ? px2dp(240) : SCREEN_HEIGHT / SCREEN_WIDTH >= 1.8 ? px2dp(220) : px2dp(165)
                                       }}/>
                            </TouchableOpacity>
                        )
                    })}
                </Carousel>

                {this.state.dataFlag ? null : <Image
                    source={IOS ? require('../images/banner_ios.png') : require('../images/banner_android.png')}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: SCREEN_WIDTH,
                        height: IOS ? px2dp(240) : SCREEN_HEIGHT / SCREEN_WIDTH >= 1.8 ? px2dp(220) : px2dp(165)
                    }}
                />}


                {this._renderRadian()}
            </View>
        );
    }

    //banner弧度
    _renderRadian() {
        if (IOS) {
            return (
                <View style={styles.box}>
                    <View style={styles.boxView}></View>
                </View>
            )
        } else {
            return (
                <Image style={styles.radian} source={require('../images/radian.png')}/>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#efefef',
    },
    iconContent: {
        position: 'absolute',
        bottom: px2dp(7),
        left: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        width: SCREEN_WIDTH,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radian: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: px2dp(10),
    },
    box: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: px2dp(10),
        overflow: "hidden",
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    boxView: {
        width: 3840,
        height: 3840,
        backgroundColor: '#efefef',
        borderTopLeftRadius: 1920,
        borderTopRightRadius: 1920,
    }
});
export default Banner;