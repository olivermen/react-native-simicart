import React from 'react';
import SimiComponent from '../../../../base/components/SimiComponent';
import { Button, Text } from 'native-base';
import Identify from '@helper/Identify';

    const ReorderButton = (props) => {

    function onClickReOrder() {
         props.parent.onReorder();
    }

        if (Identify.getMerchantConfig().storeview.sales.sales_reorder_allow == '1') {
            return (
                <Button style={{ position: 'absolute', bottom: 0, width: '100%', height: 56 }}
                    full
                    onPress={() => {  onClickReOrder() }}>
                    <Text> {Identify.__('Reorder')} </Text>
                </Button>
            );
        } else {
            return (null);
        }
}

export default ReorderButton;