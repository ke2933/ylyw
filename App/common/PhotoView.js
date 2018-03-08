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
    WebView,
} from 'react-native';

import {Global} from '../common/Global';
import ImageZoom from 'react-native-image-pan-zoom';
import Swiper from 'react-native-swiper';

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
                <WebView
                    ref={(webview) => this.webview = webview}
                    source={{uri: 'file:///android_asset/web/index.html'}}
                    onMessage={(event) => {
                        RouteName.pop();
                        goBack();
                    }}
                    onLoad={() => {
                        this.webview.postMessage(JSON.stringify(this.state));
                    }}
                    startInLoadingState={true}
                    domStorageEnabled={true}//开启dom存贮
                    javaScriptEnabled={true}//开启js
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
