import React from 'react';
import variable from '@theme/variables/material';
import { View, TouchableOpacity } from 'react-native';
import { Icon, Text, ListItem, Thumbnail, Right } from 'native-base';
import Language from '../language/index';
import Events from '@helper/config/events';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import material from '../../../../../native-base-theme/variables/material';

const MenuLeftItem = (props) => {
    function getConfigData(keyBase) {
        let config = Identify.getMerchantConfig().storeview.base;
        return config[keyBase]
    }
    function tracking() {
        let params = {};
        params['event'] = 'menu_action';
        params['action'] = 'clicked_menu_item';
        params['menu_item_name'] = props.data.key;
        Events.dispatchEventAction(params);
    }

    function onSelectItem() {
        tracking();
        if (props.data.hasOwnProperty('onClick')) {
            props.data.onClick();
        } else {
            if (props.data.key == 'item_home') {
                NavigationManager.openRootPage(props.navigation, 'Home');
            } else {
                NavigationManager.openPage(props.navigation, props.data.route_name, props.data.params ? props.data.params : {});
            }
        }
    }

    function renderItem() {
        const textColor = variable.menuLeftTextColor;
        return (
            <TouchableOpacity
                onPress={() => { onSelectItem() }}
                style={{ borderBottomColor: variable.menuLeftLineColor, borderBottomWidth: 0.5, flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row', marginRight: 30, alignItems: 'center' }}>
                    {props.data.icon && <Icon name={props.data.icon} style={{ color: variable.menuLeftIconColor, fontSize: 22, width: 22 }} />}
                    {props.data.hasOwnProperty('image') && <Thumbnail
                        square
                        source={props.data.image}
                        style={{ width: 22, height: 22 }} />}
                    <Text style={{ marginLeft: 15, color: textColor, paddingBottom: 0 }}>{Identify.__(props.data.label)}{props.data.hasDescrible && <Text style={{ color: textColor }}>: {getConfigData(props.data.keyConfig)}</Text>}</Text>
                </View>
                {props.data.is_extend && <Icon style={{ color: variable.menuLeftTextColor, fontSize: 14, position: 'absolute', right: 10 }} name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} />}
            </TouchableOpacity>
        );
    }

    function renderMore() {
        return (
            <View style={{ backgroundColor: variable.listBorderColor }}>
                <Language text="More" style={{ fontSize: variable.textSizeSmall, padding: 10, textAlign: 'left' }} />
            </View>
        );
    }

    if (props.data.hasOwnProperty('is_separator') && props.data.is_separator) {
        return (
            <View>
                {renderMore()}
            </View>
        );
    } else {
        return (
            <View>
                {renderItem()}
            </View>
        );
    }
}

export default MenuLeftItem;