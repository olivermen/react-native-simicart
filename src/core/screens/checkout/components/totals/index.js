import React from 'react';
import { View, Text } from 'native-base';
import { connect } from 'react-redux';
import Identify from '../../../../helper/Identify';
import Format from '../../../catalog/components/product/price/format';
import Language from '../../../../base/components/language/index';
import material from '../../../../../../native-base-theme/variables/material';
import PropTypes from 'prop-types';

class Totals extends React.Component {
    constructor(props) {
        super(props);
        this.merchant_configs = Identify.isEmpty(this.props.data.merchant_configs) ? null : this.props.data.merchant_configs;

        if (this.merchant_configs !== null) {
            this.tax_cart_display_price = parseInt(this.merchant_configs.storeview.tax.tax_cart_display_price);
            this.tax_cart_display_subtotal = parseInt(this.merchant_configs.storeview.tax.tax_cart_display_subtotal);
            this.tax_cart_display_shipping = parseInt(this.merchant_configs.storeview.tax.tax_cart_display_shipping);
            this.tax_cart_display_grandtotal = parseInt(this.merchant_configs.storeview.tax.tax_cart_display_grandtotal);
            this.currency_symbol = this.merchant_configs.storeview.base.currency_symbol || this.merchant_configs.storeview.base.currency_code;
        }
        if (this.props.currency_symbol) this.currency_symbol = this.props.currency_symbol
    }

    renderView() {
        let data = this.props.totals ? this.props.totals : this.props.parent.totals;
        if (data) {
            let subtotal = null;
            if (this.tax_cart_display_subtotal === 1 && data.subtotal_excl_tax) {
                subtotal = (
                    <View style={this.props.styleOneRowPrice}>
                        <Language text={'Subtotal'} style={this.props.styleLabel} />
                        <Format price={data.subtotal_excl_tax} style={this.props.stylePrice} type={this.type} currency_symbol={this.currency_symbol} />
                    </View>);
            } else if (this.tax_cart_display_subtotal === 2 && data.subtotal_incl_tax) {
                subtotal = (
                    <View style={this.props.styleOneRowPrice}>
                        <Language text={'Subtotal'} style={this.props.styleLabel} />
                        <Format price={data.subtotal_incl_tax} style={this.props.stylePrice} type={this.type} currency_symbol={this.currency_symbol} />
                    </View>);
            } else if (this.tax_cart_display_subtotal === 3) {
                subtotal = (<View style={this.props.styleTwoRowPrice}>
                    {data.subtotal_excl_tax ?
                        <View style={this.props.styleOneRowPrice}>
                            <Text style={this.props.styleLabel}>{Identify.__('Subtotal')} ({Identify.__('Excl. Tax')})</Text>
                            <Format price={data.subtotal_excl_tax} style={this.props.stylePrice} type={this.type} currency_symbol={this.currency_symbol} />
                        </View> : null
                    }
                    {data.subtotal_incl_tax ?
                        <View style={this.props.styleOneRowPrice}>
                            <Text style={this.props.styleLabel}>{Identify.__('Subtotal')} ({Identify.__('Incl. Tax')})</Text>
                            <Format price={data.subtotal_incl_tax} style={this.props.stylePrice} type={this.type} currency_symbol={this.currency_symbol} />
                        </View> : null
                    }</View>);
            }
            let shipping = null;
            if (this.tax_cart_display_shipping === 1 && data.shipping_hand_excl_tax) {
                if (data.shipping_hand_excl_tax) {
                    //let shipping_hand_excl_tax = Identify.__('Shipping') + ` (${Identify.__('Excl. Tax')}):`;
                    shipping = (
                        <View style={this.props.styleOneRowPrice}>
                            <Text style={this.props.styleLabel}>{Identify.__('Shipping')} ({Identify.__('Excl. Tax')})</Text>
                            <Format price={data.shipping_hand_excl_tax} style={this.props.stylePrice} type={this.type} currency_symbol={this.currency_symbol} />
                        </View>
                    );
                }
            } else if (this.tax_cart_display_shipping === 2 && data.shipping_hand_incl_tax) {
                if (data.shipping_hand_incl_tax) {
                    //let shipping_hand_incl_tax = Identify.__('Shipping (Incl. Tax)') + Identify.__(':');
                    shipping = (
                        <View style={this.props.styleOneRowPrice}>
                            <Text style={this.props.styleLabel}>{Identify.__('Shipping')} ({Identify.__('Incl. Tax')})</Text>
                            <Format price={data.shipping_hand_incl_tax} style={this.props.stylePrice} type={this.type} currency_symbol={this.currency_symbol} />
                        </View>
                    );
                }
            } else if (this.tax_cart_display_shipping === 3) {
                shipping = (<View style={this.props.styleTwoRowPrice}>
                    {data.shipping_hand_excl_tax || data.shipping_hand_excl_tax >= 0 ?
                        <View style={this.props.styleOneRowPrice}>
                            <Text style={this.props.styleLabel}>{Identify.__('Shipping')} ({Identify.__('Excl. Tax')})</Text>
                            <Format price={data.shipping_hand_excl_tax} style={this.props.stylePrice} type={this.type} currency_symbol={this.currency_symbol} />
                        </View> : null
                    }
                    {data.shipping_hand_incl_tax || data.shipping_hand_incl_tax >= 0 ?
                        <View style={this.props.styleOneRowPrice}>
                            <Text style={this.props.styleLabel}>{Identify.__('Shipping')} ({Identify.__('Incl. Tax')})</Text>
                            <Format price={data.shipping_hand_incl_tax} style={this.props.stylePrice} type={this.type} currency_symbol={this.currency_symbol} />
                        </View> : null
                    }
                </View>);
            }
            let discount = null;
            if (data.discount) {
                discount = (
                    <View style={this.props.styleOneRowPrice}>
                        <Language text={Identify.__('Discount')} style={this.props.styleLabelDiscount} />
                        <Format price={data.discount} style={this.props.stylePriceDiscount} type={this.type} currency_symbol={this.currency_symbol} />
                    </View>
                );
            }
            let tax = null;
            if (data.tax) {
                tax = (
                    <View style={this.props.styleOneRowPrice}>
                        <Language text={Identify.__('Tax')} style={this.props.styleLabel} />
                        <Format price={data.tax} style={this.props.stylePrice} type={this.type} currency_symbol={this.currency_symbol} />
                    </View>
                );
            }
            let grand_total = null
            if (this.tax_cart_display_grandtotal === 1) {
                grand_total = (<View style={this.props.styleTwoRowPrice}>
                    {data.grand_total_excl_tax ?
                        <View style={this.props.styleOneRowPrice}>
                            <Text style={[this.props.styleLabelTotal, { color: Identify.theme.price_color }]}>{Identify.__('Grand Total')} ({Identify.__('Excl. Tax')})</Text>
                            <Format price={data.grand_total_excl_tax} style={[this.props.stylePriceTotal, { color: Identify.theme.price_color }]} type={this.type} currency_symbol={this.currency_symbol} />
                        </View> : null
                    }
                    {data.grand_total_incl_tax ?
                        <View style={this.props.styleOneRowPrice}>
                            <Text style={[this.props.styleLabelTotal, { color: Identify.theme.price_color }]}>{Identify.__('Grand Total')} ({Identify.__('Incl. Tax')})</Text>
                            <Format price={data.grand_total_incl_tax} style={[this.props.stylePriceTotal, { color: Identify.theme.price_color }]} type={this.type} currency_symbol={this.currency_symbol} />
                        </View> : null
                    }
                </View>);
            } else if (data.grand_total_incl_tax) {
                grand_total = (
                    <View style={this.props.styleOneRowPrice}>
                        <Text style={[this.props.styleLabelTotal, { color: Identify.theme.price_color }]}>{Identify.__('Grand Total')}</Text>
                        <Format price={data.grand_total_incl_tax} style={[this.props.stylePriceTotal, { color: Identify.theme.price_color }]} type={this.type} currency_symbol={this.currency_symbol} />
                    </View>
                );
            }
            let custom = null;
            if (data.custom_rows) {
                let custom_rows = data.custom_rows;
                let rows = [];
                for (let i in custom_rows) {
                    let row = custom_rows[i];
                    let title = row.title;
                    let value = <Format price={row.value} style={this.props.stylePrice} type={this.type} currency_symbol={this.currency_symbol} />;
                    if (row.hasOwnProperty('value_string') && row.value_string) {
                        value = <Language text={row.value_string} style={this.props.stylePrice} />;
                    }
                    let el = (<View key={Identify.makeid()} style={this.props.styleOneRowPrice}>
                        <Language text={title} style={this.props.styleLabel} />
                        {value}
                    </View>
                    );
                    rows.push(el);
                }
                custom = <View key={Identify.makeid()}>{rows}</View>;
            }
            return (
                <View>
                    {custom}
                    {subtotal}
                    {shipping}
                    {discount}
                    {tax}
                    {grand_total}
                </View>
            );
        } else {
            return <View></View>
        }
    }
    render() {
        if (this.merchant_configs) {
            return (
                <View style={this.props.styleMargin}>
                    {this.renderView()}
                </View>
            )
        }
        return (
            <View></View>
        );
    }
}
Totals.defaultProps = {
    totals: null,
    styleLabel: {},
    stylePrice: {},
    styleLabelTotal: { fontSize: material.textSizeLabel, color: material.priceColor, flex: 1, textAlign: 'left' },
    stylePriceTotal: { fontSize: material.textSizeLabel, color: material.priceColor, flex: 1, textAlign: 'right' },
    styleLabelDiscount: { color: material.priceColor, flex: 1, textAlign: 'left' },
    stylePriceDiscount: { color: material.priceColor, flex: 1, textAlign: 'right' },
    //one row.
    styleOneRowPrice: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
    styleTwoRowPrice: { flex: 1, flexDirection: 'column', justifyContent: 'space-between' },
    styleMargin: { marginLeft: 20, marginRight: 10, marginBottom: 20, marginTop: 20 },
    type: 0,
    currency_symbol: null
};
// export default Totals;
const mapStateToProps = (state) => {
    return { data: state.redux_data };
}
export default connect(mapStateToProps)(Totals);
