import React from 'react';
import SimiComponent from "@base/components/SimiComponent";
import { Card, H3, Icon } from 'native-base';
import { TouchableOpacity, View } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import styles from './styles';
import Events from '@helper/config/events';

const ProductTechSpecsComponent = (props) => {

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
        return (
            <TouchableOpacity onPress={() => {
                openTeachSpecs();
                tracking();
            }}>
                <Card style={styles.card}>
                    <View style={styles.cardContainer}>
                        <H3 style={styles.title}>{Identify.__('Tech Specs')}</H3>
                        <Icon style={styles.extendIcon} name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} />
                    </View>
                </Card>
            </TouchableOpacity>
        );
    } else {
        return (null);
    }
}
export default ProductTechSpecsComponent;