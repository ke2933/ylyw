import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    BackHandler,
} from 'react-native';

import {Global} from '../common/Global';
import Loading from '../common/Loading';
import ImageViewer from 'seer-react-native-image-zoom-viewer';

export default class demo extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            imgArr: [],
            index: 0,
        }
    }

    componentWillMount() {
       NetWork ? null : Alert.alert('网络似乎断掉了'), this.setState({isLoading: false});RouteName.push(this.props.navigation.state);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }
        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params;
            let temp = [];
            data.data.map((item, index) => {
                temp.push({'url': item})
            });
            this.setState({
                imgArr: temp,
                index: data.index,
            });
        }
    }


    render() {
        const {navigate, goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar//状态栏
                    hidden={IOS ? true : false}//是否隐藏
                    animated={true}//是否动画
                />
                    <ImageViewer
                        imageUrls={this.state.imgArr}
                        // imageWidth={SCREEN_WIDTH}
                        // cropWidth={SCREEN_WIDTH}
                        // cropHeight={IOS ? SCREEN_HEIGHT : SCREEN_HEIGHT - StatusBarHeight}
                        // imageHeight={IOS ? SCREEN_HEIGHT : SCREEN_HEIGHT - StatusBarHeight}
                        enableImageZoom={true}
                        flipThreshold={SCREEN_WIDTH * .2}
                        maxOverflow={SCREEN_WIDTH}
                        loadingRender={() => {
                            return (
                                <View style={{
                                    width: SCREEN_WIDTH,
                                    height: IOS ? SCREEN_HEIGHT : SCREEN_HEIGHT - StatusBarHeight,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <ActivityIndicator
                                        animating={true}
                                        size="large"//small 20  large 36
                                        color={'#bdbdbd'}
                                    />
                                </View>
                            )
                            // console.log('1')
                        }}
                        saveToLocalByLongPress={false}
                        // faillmageSource={() => {
                        // 加载失败
                        // }}
                        onClick={() => {
                            RouteName.pop();
                            goBack();
                        }}
                        index={this.state.index}
                    />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: IOS ? SCREEN_HEIGHT : SCREEN_HEIGHT - StatusBarHeight,
        backgroundColor: Colors.bgColor,
    },

});
