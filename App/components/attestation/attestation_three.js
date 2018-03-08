import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    BackHandler,
} from 'react-native';

import Nav from '../../common/Nav';
import Button from '../../common/Button';
import {Global} from '../../common/Global';

export default class AttestationThree extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {}
    }
    componentWillMount() {
       NetWork ? null : Alert.alert('网络似乎断掉了'), this.setState({isLoading: false});RouteName.push(this.props.navigation.state);
        if (Android) {
            BackHandler.addEventListener('hardwareBackPress', () => {
                backAndroid();
                return true;
            });
        }
    }

    render() {
        const {navigate, goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
                <Nav navigation={this.props.navigation}
                    leftClick={() => {
                        RouteName.pop();
                        goBack();
                    }}
                    data={{
                        'leftBtn': true,
                        'title': '医师认证',
                        'rightBtn': {type: 'false'}
                    }}/>
                <View style={styles.content}>
                    <Image style={styles.successImg} source={require('../../images/success.png')}/>
                    <Text style={styles.successTitle}>医师认证提交成功</Text>
                    <Text style={styles.successText}>审核将在1-3个工作日内完成</Text>
                    <Text style={styles.successText}>请耐心等待</Text>
                </View>
                <Button text={'完成'} click={this.success.bind(this)}/>
            </View>
        );
    }

    success() {
        RouteName.splice(0, RouteName.length);
        this.props.navigation.navigate('Home');
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: IOS ? SCREEN_HEIGHT : SCREEN_HEIGHT - StatusBarHeight,
    },
    content: {
        alignItems: 'center',
    },
    successImg: {
        marginTop: px2dp(104),
    },
    successTitle: {
        color: '#333333',
        fontSize: FONT_SIZE(19),
        marginTop: px2dp(18),
        marginBottom: px2dp(6),
    },
    successText: {
        color: '#333333',
        fontSize: FONT_SIZE(16),
        marginTop: px2dp(15),
    }


});
