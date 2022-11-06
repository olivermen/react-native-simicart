import React, { PixelRatio, Platform, Dimensions } from 'react-native';
import AppStorage from '@helper/storage';
const windowSize = Dimensions.get('window');

export default class Device {
    static is_android_tablet = false

    static isTablet() {
        if (Platform.OS === 'ios') {
            if (Platform.isPad) {
                return true;
            } else {
                return false;
            }
        } else {
            return this.is_android_tablet;
        }
    }
}
