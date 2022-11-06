import React from 'react';
import { TouchableOpacity, View, findNodeHandle, Image } from 'react-native';
import { Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import SimiComponent from '@base/components/SimiComponent';
import Events from '@helper/config/events';
import { styles } from './styles'

class ShippingMethod extends SimiComponent {

    constructor(props) {
        super(props);
        this.data = {};
        if (this.props.isPpexpress) {
            this.data = this.props.data;
        } else {
            this.data = this.props.parent.props.data.order.shipping;
        }
        this.extraFee = this.props.parent.props.data.order.extra_fee;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isPpexpress) {
            this.data = nextProps.data;
        } else {
            this.data = nextProps.parent.props.data.order.shipping;
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    scrollToShipping() {
        this.view.measureLayout(
            findNodeHandle(this.props.parent.scrollViewRef),
            (x, y) => {
                this.props.parent.scrollViewRef.scrollTo({ x: 0, y: y, animated: true });
            }
        );
    }

    renderSelectIcon(selected) {
        if (selected) {
            return (
                <View style={{
                    width: 24,
                    height: 24,
                    borderWidth: 1,
                    borderColor: '#E4531A',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={{ width: 14, height: 14, backgroundColor: '#E4531A', borderRadius: 7 }} />
                </View>
            );
        }
        return (
            <View style={{
                width: 24,
                height: 24,
                borderWidth: 1,
                borderColor: '#BABABA',
                backgroundColor: '#FAFAFA',
                borderRadius: 12,
            }} />
        );
    }

    renderExtraFee() {
        const extraFee = this.props.parent.props.data.order.extra_fee;
        if (!extraFee || !extraFee.shipping_method || extraFee.shipping_method == 0) {
            return null;
        }
        let extraFeeOption = undefined;
        let extraFeeSelectedLabel = undefined;
        let extraFeeLabel = Identify.__('Shipping Fee');

        const storeId = Identify.getMerchantConfig().storeview.base.store_id;
        const { shipping_method, selected_options } = extraFee;
        extraFeeOption = shipping_method[0];
        const selectedArray = JSON.parse(selected_options);
        const options = JSON.parse(extraFeeOption.options);
        const labels = JSON.parse(extraFeeOption.labels);
        if (storeId && labels[storeId]) {
            extraFeeLabel = labels[storeId];
        }

        let views = [];
        Object.keys(options.option.value).forEach((key, index) => {
            const item = options.option.value[key];
            let label = item['0'];
            if (item[storeId]) {
                label = item[storeId];
            }
            const isSelected = selectedArray[extraFeeOption.rule_id] && selectedArray[extraFeeOption.rule_id] == key;
            views.push(
                <TouchableOpacity
                    key={key}
                    onPress={() => {
                        this.props.parent.onSaveMethod({
                            extra_fee: `rule[${extraFeeOption.rule_id}]=${key}`
                        });
                    }}>
                    <View style={{ borderBottomWidth: (index < Object.keys(options.option.value).length - 1) ? 0.5 : 0, borderBottomColor: '#D8D8D8', flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 15 }}>
                        {this.renderSelectIcon(isSelected)}
                        <Text style={{ textAlign: 'left', marginLeft: 10, flex: 1 }}>
                            {Identify.__(label)} <Text style={{ fontFamily: material.fontBold }}>{Identify.formatPrice(item.calculated_amount_incl_tax)}</Text>
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        })

        return (
            <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 20, fontFamily: material.fontBold, textAlign: 'left', padding: 10, paddingLeft: 0 }}>{extraFeeLabel}</Text>
                {views}
            </View>
        );
    }

    onSelectShippingMethod(shippingMethod) {
        let data = {};
        data['event'] = 'checkout_action';
        data['action'] = 'saved_shipping_method';
        Events.dispatchEventAction(data, this);
        this.props.parent.onSaveMethod({
            s_method: {
                method: shippingMethod.s_method_code
            }
        });
    }
    renderShippingItem(shippingMethod, index) {
        return (
            <TouchableOpacity key={shippingMethod.s_method_code} onPress={() => {
                this.onSelectShippingMethod(shippingMethod)
            }}>
                <View style={{ borderBottomWidth: (index < this.data.length - 1) ? 0.5 : 0, borderBottomColor: '#D8D8D8', flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 15 }}>
                    {this.renderSelectIcon(shippingMethod.s_method_selected)}
                    <Text
                        style={{ marginLeft: 10, textAlign: 'left' }}>
                        {Identify.__(shippingMethod.s_method_title)} {shippingMethod.s_method_fee > 0 && <Text style={{ fontFamily: material.fontBold }}>{Identify.formatPrice(shippingMethod.s_method_fee)}</Text>}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
    createItems() {
        let items = [];
        for (let i in this.data) {
            let shippingMethod = this.data[i];
            items.push(
                this.renderShippingItem(shippingMethod, i)
            );
        }
        return items;
    }

    renderPhoneLayout() {
        let selectedMode = this.props.parent.state.selectedMode ? this.props.parent.state.selectedMode : 0
        let selectedStore = this.props.parent.store

        if (this.data.length == 0) {
            return null;
        }
        return (
            <View ref={ref => this.view = ref} style={{ marginHorizontal: 12 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 16 }}>
                    <Text style={{ fontSize: 18, color: 'white', backgroundColor: 'black', width: 32, height: 32, textAlign: 'center', fontFamily: material.fontBold, paddingTop: 6, borderRadius: 16 }}>{Identify.__('2')}</Text>
                    <Text style={{ fontFamily: material.fontBold, flex: 1, textAlign: 'left', fontSize: 18, marginLeft: 20 }}>{Identify.__('Delivery Method')}</Text>
                </View>
                <View style={{ borderWidth: 1, borderRadius: 8, borderColor: '#D8D8D8', paddingHorizontal: 15, paddingVertical: 5 }}>
                    {selectedMode === 0 ?
                        <>
                            {this.createItems()}
                            {this.renderExtraFee()}
                        </> :
                        <>
                            <View style={styles.deliveryHeader}>
                                <Text>{Identify.__('Click & Collect - Click & Collect')}</Text>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: '#E4531A', paddingRight: 4, fontWeight: '500' }}>
                                        {Identify.__('EDIT')}
                                    </Text>
                                    <Image source={require('../../../customer/components/myaccount/icon-edit.png')} style={{ width: 20, height: 21 }} />
                                </TouchableOpacity>
                            </View>
                            {selectedStore ?
                                <Text style={{ fontWeight: '500', paddingBottom: 15 }}>{Identify.__(selectedStore.name)}</Text>
                                : null
                            }
                        </>
                    }
                </View>
            </View>
        );
    }
}

export default ShippingMethod;
