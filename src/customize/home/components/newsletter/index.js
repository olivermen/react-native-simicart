import React from 'react';
import Identify from '@helper/Identify';
import { Image, ImageBackground, View, TextInput, Platform } from 'react-native';
import { Text, Button, Toast } from 'native-base';
import { connect } from 'react-redux';
import material from '@theme/variables/material';
import NewConnection from '@base/network/NewConnection';

class Newsletter extends React.Component {

    constructor(props) {
        super(props);
        this.emailValue = '';
    }

    registerNewsletter() {
        this.props.storeData('showLoading', { type: 'dialog' });
        new NewConnection()
            .init('simiconnector/rest/v2/newsletters', 'newsletter', this, 'POST')
            .addBodyData({
                email: this.emailValue
            })
            .connect();
    }

    setData(data) {
        this.props.storeData('showLoading', { type: 'none' });
        if (data && data.success) {
            Toast.show({
                text: Identify.__('Thank you for your subcription'),
                type: 'success',
                duration: 3000,
                textStyle: { fontFamily: material.fontFamily }
            });
        }
    }

    render() {
        const styleIOS = {
            flex: 1, backgroundColor: 'white', borderWidth: 0, height: 50, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, paddingHorizontal: 16
        }
        const styleAndroid = {
            flex: 1, backgroundColor: 'white', borderWidth: 0, height: 50, borderTopLeftRadius: Identify.isRtl() ? 0 : 10, borderBottomLeftRadius: Identify.isRtl() ? 0 : 10, paddingHorizontal: 16, borderTopRightRadius: Identify.isRtl() ? 10 : 0, borderBottomRightRadius: Identify.isRtl() ? 10 : 0
        }

        return (
            <ImageBackground source={require('../../../icon/newsletter_mobile.png')} style={{ width: '100%', aspectRatio: 2, marginVertical: 40 }}>
                <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 12, paddingTop: 13, paddingBottom: 30 }}>
                    <Image source={require('../../../icon/icon-mail.png')} style={{ width: 30, height: 30 }} />
                    <Text style={{ fontFamily: material.fontBold, fontSize: 18, marginTop: Identify.isRtl() ? 6 : 8, color: 'white' }}>{Identify.__('Join the newsletter club')}</Text>
                    <Text style={{ fontSize: 13, marginTop: Identify.isRtl() ? 0 : 8, color: 'white' }}>{Identify.__('For offers, competitions and loads more fun stuff.')}</Text>
                    <View style={{ flexDirection: 'row-reverse', marginTop: Identify.isRtl() ? 8 : 16 }}>
                        <Button style={{ height: 50, backgroundColor: '#FFE000', alignItems: 'center', justifyContent: 'center', borderRadius: 0, borderTopRightRadius: 10, borderBottomRightRadius: 10, paddingHorizontal: 16, overflow: 'hidden' }}
                            onPress={() => {
                                this.registerNewsletter()
                            }}>
                            <Text style={{ fontSize: 16, fontFamily: material.fontBold, fontFamily: material.fontBold, color: 'black', paddingLeft: 0, paddingRight: 0 }}>{Identify.__('Sign Up')} </Text>
                        </Button>
                        <TextInput
                            style={Platform.OS === 'ios' ? styleIOS : styleAndroid}
                            placeholder={Identify.__('Enter email address')}
                            placeholderTextColor="#7B7B7B"
                            onChangeText={(text) => {
                                this.emailValue = text;
                            }} />
                    </View>
                </View>
            </ImageBackground>
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

export default connect(null, mapDispatchToProps)(Newsletter);
