import React from 'react';
import { View, Image, Platform, Dimensions } from 'react-native';
import Device from '@helper/device';
import simicart from '@helper/simicart';

const platform = Platform.OS;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const ImageSplash = () => {
    if (platform === "ios") {
        if (Platform.isPad) {
            if (deviceHeight > deviceWidth) {
                return (
                    <Image source={require('@media/Images/Default-Portrait~ipad.png')} />
                )
            } else {
                return (
                    <Image source={require('@media/Images/Default-Landscape~ipad.png')} />
                )
            }
        } else {
            if (deviceHeight == 568) {
                return (
                    <Image source={require('@media/Images/Default-568h.png')} />
                )
            } else if (deviceHeight == 667) {
                return (
                    <Image source={require('@media/Images/Default-667h.png')} />
                )
            } else if (deviceHeight == 736) {
                return (
                    <Image source={require('@media/Images/Default-736h.png')} />
                )
            } else if (deviceHeight == 812) {
                return (
                    <Image source={require('@media/Images/Default-812h.png')} />
                )
            } else
                return (
                    <Image source={require('@media/Images/Default.png')} />
                )
        }
    } else {
        //android
        if (simicart.fullSplash == '1') {
            let source = null;
            if (Device.isTablet()) {
                source = require('../../../../../media/splash_tablet.png');
            } else {
                source = require('../../../../../media/splash.png');
            }
            return (
                <Image source={source} style={{ width: deviceWidth, height: deviceHeight }} />
            )
        } else {
            return (<Image source={require('../../../../../media/splash.png')} style={{ width: 300, height: 300, resizeMode: "contain" }} />)
        }
    }
    return null;
}

export default ImageSplash;
