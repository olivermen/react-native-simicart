import React, { useState } from 'react';
import SimiComponent from "@base/components/SimiComponent";
import { Card, H3, Icon, Text } from 'native-base';
import { TouchableOpacity, View } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import Events from '@helper/config/events';
import material from '../../../../../native-base-theme/variables/material';

const ProductTechSpecsComponent = (props) => {

    const [extend, setExtend] = useState(false);

    function tracking() {
        let params = {};
        params['event'] = 'product_action';
        params['action'] = 'selected_product_tech_specs';
        params['product_name'] = props.product.name;
        params['product_id'] = props.product.entity_id;
        params['sku'] = props.product.sku;
        Events.dispatchEventAction(params, this);
    }

    function openTeachSpecs() {
        NavigationManager.openPage(props.navigation, 'TechSpecs', {
            additional: props.product.additional,
        });
    }

    if (!Identify.isEmpty(props.product.additional)) {
        const techspecs = Object.keys(props.product.additional).map((key, index) => {
            const item = props.product.additional[key];
            const isEven = index % 2 == 0;
            return (
                <View key={key} style={{ backgroundColor: isEven ? '#EFF2F2' : 'white', flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderColor: '#E2E7E8', borderTopWidth: index == 0 ? 1 : 0 }}>
                    <Text style={{ flex: 1, textAlign: 'left' }}>{item.label}</Text>
                    <Text style={{ flex: 1, textAlign: 'right' }}>{item.value}</Text>
                </View>
            );
        })
        return (
            <View style={{ paddingHorizontal: 12, zIndex: -1 }}>
                <TouchableOpacity
                    style={{ marginTop: 15, padding: 15, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderRadius: 5, borderColor: '#979797' }}
                    onPress={() => setExtend(!extend)}
                >
                    <Text style={{ fontSize: 16, fontFamily: material.fontBold }}>{Identify.__('Product Specification')}</Text>
                    <Icon style={{ fontSize: 20 }} name={extend ? "ios-arrow-up" : "ios-arrow-down"} />
                </TouchableOpacity>
                {extend && <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 16, fontFamily: material.fontBold, textAlign: 'center', paddingBottom: 8 }}>{Identify.__('Techspec')}</Text>
                    {techspecs}
                </View>}
            </View>
        );
    } else {
        return (null);
    }
}
export default ProductTechSpecsComponent;