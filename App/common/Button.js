import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
export default class Button extends Component {
    static defaultProps = {
        click: function () {},
        text: '',
    };

    render() {
        return (
            <View style={styles.btnContent}>
                <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.props.click}
                >
                    <View
                        style={[styles.btnBox,this.props.style]}
                    >
                        <Text style={styles.btnText}>
                            {this.props.text}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    // 按钮
    btnContent: {
        marginTop: 38,
        marginBottom: 67,
        alignItems: 'center',
    },
    btnBox: {
        width: 200,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 46,
        backgroundColor: '#566cb7',
    },
    btnText: {
        fontSize: 18,
        color: '#fffefe',
        backgroundColor: 'transparent',
    }

});
