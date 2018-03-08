import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator
} from 'react-native';
import {Global} from './Global';
import px2dp from "./Tool";

export default class Loading extends Component {
    static defaultProps = {
        text: '',
    };
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={true}
                    size={'large'}
                    color={'#fff'}
                />
                <Text style={styles.loadingText}>{this.props.text}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 100,
        alignItems: 'center',
        justifyContent: 'center',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    loadingText:{
        width: SCREEN_WIDTH * .8,
        textAlign: 'center',
        marginTop: px2dp(20),
        lineHeight: px2dp(30),
        fontSize: FONT_SIZE(16),
        color: '#fff',
    },
});
