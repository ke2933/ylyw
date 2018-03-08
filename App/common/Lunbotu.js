import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
} from 'react-native';


import {requestUrl} from '../Network/url';//接口url
import {RegExp} from '../Network/RegExp';//正则
import {Global} from './Global';
import px2dp from "./Tool";

class Lunbotu extends Component {
    static defaultProps = {
        duration: 3000,
    };

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
            imgArr: [],
        }
    }

    componentDidMount() {
        this._startTimer();

        // banner数据获取
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
        console.log(formData);
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
                    })
                }
            })
            .catch(
                (error) => {
                    console.log('error', error);
                });

    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    //ref={(scrollView) => { _scrollView = scrollView; }} //此方法不用获取 _scrollView直接使用
                    ref="scrollView" // this.refs.name 获取
                    style={styles.scrollView}
                    horizontal={true} // 水平排列
                    showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                    showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                    //onMomentumScrollStart={()=>{this.moveStart()}}
                    pagingEnabled={true} //分页
                    onScrollBeginDrag={() => {
                        this._onScrollBeginDrag()
                    }}//开始拖拽
                    onScrollEndDrag={() => {
                        this._onScrollEndDrag()
                    }}//结束拖拽
                    onMomentumScrollEnd={(e) => {
                        this._onAnimationEnd(e)
                    }}// 滑动完一帧
                >
                    {this.renderImg()}
                </ScrollView>
                <View style={styles.iconContent}>
                    {this._renderAllIndicator()}
                </View>
                {this._renderRadian()}
            </View>
        );

    }

    //开始拖拽
    _onScrollBeginDrag() {
        this.timer && clearTimeout(this.timer);
    }

    //结束拖拽
    _onScrollEndDrag() {
        this.timer && this._startTimer();
    }

    _onAnimationEnd(e) {
        let offsetX = e.nativeEvent.contentOffset.x;
        //求出当前页数
        let pageIndex = Math.floor(offsetX / SCREEN_WIDTH);
        //更改状态机
        this.setState({currentPage: pageIndex});
    }

    _startTimer() {
        let _scrollView = this.refs.scrollView;
        this.timer = setInterval(() => {
            let imgCount = this.state.imgArr.length;
            let activePage = 0;
            if (this.state.currentPage + 1 >= imgCount) {
                activePage = 0;
            } else {
                activePage = this.state.currentPage + 1;
            }
            this.setState({currentPage: activePage});
            let offsetX = activePage * SCREEN_WIDTH;
            _scrollView.scrollResponderScrollTo({x: offsetX, y: 0, animated: true});
        }, this.props.duration);

    }

    // 图片模块
    renderImg() {
        let itemImg = [];
        let imgAry = this.state.imgArr;
        let count = imgAry.length;
        for (let i = 0; i < count; i++) {
            itemImg.push(
                <Image key={i} source={{uri: requestUrl.ImgIp + this.state.imgArr[i].picturePath}}
                       style={{
                           width: SCREEN_WIDTH,
                           height: IOS ? px2dp(240) : SCREEN_HEIGHT / SCREEN_WIDTH >= 2 ? px2dp(240) : px2dp(165)
                       }}/>
            )
        }
        return itemImg;
    }

    //焦点模块
    _renderAllIndicator() {
        let indicatorArr = [];
        let count = this.state.imgArr.length;
        let style;
        for (let i = 0; i < count; i++) {
            //判断
            style = (i === this.state.currentPage) ? {color: '#7082be'} : {color: 'white'};
            indicatorArr.push(
                <Text key={i} style={[{fontSize: FONT_SIZE(20)}, style]}>
                    •
                </Text>
            );
        }
        return indicatorArr;
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
export default Lunbotu;