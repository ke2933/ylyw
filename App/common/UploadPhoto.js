import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
    TouchableOpacity
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {Global} from './Global';
import px2dp from "./Tool";

const photoOptions = {
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    quality: .75,
    allowsEditing: false,// ios图片裁剪
    mediaType: 'photo',//photo照片 或 video视频
    noData: false,
    maxWidth: 720,
    maxHeight: 1280,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
};

class UploadPhoto extends Component {
    static defaultProps = {
        url: require('../images/add_btn.png'),
    };

    constructor(props) {
        super(props);
        this.state = {
            uri: ''
        }
    }

    render() {
        let type = this.props.type;
        let temp = [];
        if (type === 'small') {
            temp.push(
                <Image
                    key={'small'}
                    style={{width: px2dp(60), height: px2dp(60), borderRadius: px2dp(5),}}
                    source={this.props.url}
                />
            )
        } else if (type === 'big') {
            temp.push(
                <View key={'big'} style={{
                    width: px2dp(60),
                    height: px2dp(60),
                    borderRadius: px2dp(4),
                    marginBottom: px2dp(20),
                }}>
                    <Image

                        style={{width: px2dp(60), height: px2dp(60)}}
                        source={require('../images/add_btn.png')}
                    />
                </View>
            )
        } else if (type === 'add') {
            temp.push(
                <View key={'add'} style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: px2dp(13),
                    paddingRight: px2dp(12),
                    height: px2dp(45),
                }}>
                    <Image
                        style={this.props.style}
                        source={require('../images/camera.png')}
                    />
                </View>
            )
        } else {
            return;
        }
        return (
            <TouchableOpacity
                onPress={this.openMycamera.bind(this)}
                style={{marginRight: px2dp(7),}}
            >
                {temp}
            </TouchableOpacity>
        );
    }

    openMycamera = () => {
        ImagePicker.showImagePicker(photoOptions, (response) => {
            if (response.didCancel) {
                return null;
            } else if (response.error) {
                console.log('ImagePicker Error:', response.error)
            } else if (response.customButton) {
                console.log('Usr tapped custom button:', response.customButton)
            } else {
                let tu = {uri: response.uri};
                this.setState({
                    uri: tu,
                });
                this.props.changeImg(response.uri);
            }
        })
    }
}

module.exports = UploadPhoto;
