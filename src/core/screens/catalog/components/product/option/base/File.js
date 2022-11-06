import React from 'react';
import Identify from "@helper/Identify";
import Abstract from './Abstract';
import material from '@theme/variables/material';
import { View, Text, Button } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import Connection from '@base/network/Connection';
import { connect } from 'react-redux';
import Simicart from '@helper/simicart'

const options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

class File extends Abstract {

    constructor(props) {
        super(props);
        this.state = {
            uploadFile: null
        }

        this.fullUrl = Simicart.merchant_url;
        if (this.fullUrl.lastIndexOf('/') !== this.fullUrl.length - 1) {
            this.fullUrl += '/'
        }
    }

    _handleChooseImage = () => {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            } else {
                this.props.storeData('showLoading', { type: 'dialog' });
                const data = new FormData();
                data.append('file', {
                    uri: response.uri,
                    type: 'image/jpeg', // or photo.type
                    name: 'image_name.png'
                });
                fetch(this.fullUrl + 'simiconnector/rest/v2/uploadfiles', {
                    method: 'post',
                    body: data
                }).then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson)
                        this.setState({
                            uploadFile: responseJson.uploadfile
                        })
                        this.props.storeData('actions', [
                            { type: 'showLoading', data: { type: 'none' } },
                        ]);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    };

    getValues() {
        if (this.state.uploadFile != null) {
            return this.state.uploadFile;
        }
    }

    renderUpload() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button style={{ paddingTop: 8, paddingBottom: 8, height: null, shadowOpacity: 0 }}
                    onPress={this._handleChooseImage}>
                    <Text style={{ paddingLeft: 8, paddingRight: 8 }}>{Identify.__('Upload file')}</Text>
                </Button>

                <Text style={{ marginLeft: 10 }}>{this.state.uploadFile === null ? Identify.__('No file chosen') : 'image_name.png'}</Text>
            </View>
        );
    }

    renderContent() {
        return (
            <View>
                {this.props.obj.file_extension && <Text>{Identify.__('Compatible file extensions to upload') + ": " + this.props.obj.file_extension}</Text>}
                {this.props.obj.image_size_x && <Text>{Identify.__('Maximum image width') + ": " + this.props.obj.image_size_x}</Text>}
                {this.props.obj.image_size_y && <Text>{Identify.__('Maximum image height') + ": " + this.props.obj.image_size_y}</Text>}
            </View>
        );
    }

    render() {
        return (
            <View style={{ padding: 10 }}>
                {this.renderUpload()}
                {this.renderContent()}
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(null, mapDispatchToProps)(File);