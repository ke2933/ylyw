import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Alert,
    Image,
    Dimensions,
    Platform,
    PixelRatio,
    StatusBar,
} from 'react-native';

let {width, height} = Dimensions.get('window');
// import Pad from './pad';

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    _fetch(){
        let formData = new FormData();
        formData.append("idCard","1");
        fetch('url',{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData,
        })
            .then((response) => response.json())
            .then((responseData)=>{

                console.log('responseData',responseData);
            })
            .catch(
                (error)=>{console.log('error',error);
                });
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        // height: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        // borderWidth: 1 / PixelRatio.get(),
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },

});
