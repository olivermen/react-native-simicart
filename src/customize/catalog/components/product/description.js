import React, { useState } from 'react';
import SimiComponent from "@base/components/SimiComponent";
import { Card, H3, Icon, Text } from 'native-base';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import styles from '@screens/catalog/components/product/styles';
import Events from '@helper/config/events';
import material from '../../../../../native-base-theme/variables/material';
import RenderHtml from 'react-native-render-html';

const ProductDescriptionComponent = (props) => {

    const [extend, setExtend] = useState(false);

    function openDescription() {
        if (props.product.description) {
            let code = Identify.isRtl() ? "rtl" : "ltr";
            let html = '<html dir="' + code + '" lang=""><meta name="viewport" content="width=device-width, initial-scale=1.0"><body>' + props.product.description + "</body></html>";
            NavigationManager.openPage(props.navigation, 'WebViewPage', {
                html: html,
            });
            let params = {};
            params['event'] = 'product_action';
            params['action'] = 'selected_product_description';
            params['product_name'] = props.product.name;
            params['product_id'] = props.product.entity_id;
            params['sku'] = props.product.sku;
            Events.dispatchEventAction(params, this);
        }
    }

    function renderDescriptionView(showDescription) {
        let code = Identify.isRtl() ? "rtl" : "ltr"
        let html = '<html dir="' + code + '" lang=""><body>' + showDescription + "</body></html>";
        return (
            <View style={{ paddingHorizontal: 12 }}>
                <TouchableOpacity
                    style={{ marginTop: 15, padding: 15, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderRadius: 5, borderColor: '#979797' }}
                    onPress={() => setExtend(!extend)}>
                    <Text style={{ fontSize: 16, fontFamily: material.fontBold }}>{Identify.__('Product Overview')}</Text>
                    <Icon style={{ fontSize: 20 }} name={extend ? "ios-arrow-up" : "ios-arrow-down"} />
                </TouchableOpacity>
                {extend && <RenderHtml
                    contentWidth={Dimensions.get('screen').width - 24}
                    tagsStyles={{ p: { textAlign: 'left' }, span: { textAlign: 'left' } }}
                    source={{ html: html }}
                    baseStyle={{ fontFamily: material.fontFamily, marginTop: 15 }} />}
            </View>
        );
    }

    if (!props.parent.state.reRender) {
        return (
            renderDescriptionView(null)
        );
    }
    let showDescription = props.product.description;
    if (!showDescription) {
        return null;
    }
    return (
        renderDescriptionView(showDescription)
    );

}

export default ProductDescriptionComponent;