import React from 'react';
import { Text, View } from 'react-native'
import { connect } from 'react-redux';
import Identify from '@helper/Identify';
import Format from '../../../catalog/components/product/price/format';
import Language from '@base/components/language/index';
import material from '@theme/variables/material';

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
                    <View style={[this.props.styleOneRowPrice, { paddingBottom: 16 }]}>
                        <Text>{Identify.__('Subtotal')}</Text>
                        <Format price={data.subtotal_excl_tax} style={this.props.stylePriceSubTotal} type={this.type} currency_symbol={this.currency_symbol} />
                    </View>);
            } else if (this.tax_cart_display_subtotal === 2 && data.subtotal_incl_tax) {
                subtotal = (
                    <View style={[this.props.styleOneRowPrice, { paddingBottom: 16 }]}>
                        <Text>{Identify.__('Subtotal')}</Text>
                        <Format price={data.subtotal_incl_tax} style={this.props.stylePriceSubTotal} type={this.type} currency_symbol={this.currency_symbol} />
                    </View>);
            } else if (this.tax_cart_display_subtotal === 3) {
                subtotal = (<View style={this.props.styleTwoRowPrice}>
                    {data.subtotal_excl_tax ?
                        <View style={[this.props.styleOneRowPrice, { paddingBottom: 16 }]}>
                            <Text>{Identify.__('Subtotal')} ({Identify.__('Excl. Tax')})</Text>
                            <Format price={data.subtotal_excl_tax} style={this.props.stylePriceSubTotal} type={this.type} currency_symbol={this.currency_symbol} />
                        </View> : null
                    }
                    {data.subtotal_incl_tax ?
                        <View style={[this.props.styleOneRowPrice, { paddingBottom: 16 }]}>
                            <Text>{Identify.__('Subtotal')} ({Identify.__('Excl. Tax')})</Text>
                            <Format price={data.subtotal_incl_tax} style={this.props.stylePriceSubTotal} type={this.type} currency_symbol={this.currency_symbol} />
                        </View> : null
                    }</View>);
            }
            let discount = null;
            if (data.discount && data.discount != 0) {
                discount = (
                    <View style={[this.props.styleOneRowPrice, { paddingBottom: 16 }]}>
                        <Text>{Identify.__('Discount')}</Text>
                        <Format price={data.discount} style={this.props.stylePrice} type={this.type} currency_symbol={this.currency_symbol} isDiscount />
                    </View>
                );
            }
            let grand_total = null
            if (this.tax_cart_display_grandtotal === 1) {
                grand_total = (<View style={this.props.styleTwoRowPrice}>
                    {data.grand_total_excl_tax ?
                        <View style={this.props.styleOneRowPrice}>
                            <Text style={this.props.styleLabelTotal}>{Identify.__('Grand Total')} ({Identify.__('Excl. Tax')})</Text>
                            <Format price={data.grand_total_excl_tax} style={[this.props.stylePriceTotal, { color: Identify.theme.price_color }]} type={this.type} currency_symbol={this.currency_symbol} />
                        </View> : null
                    }
                    {data.grand_total_incl_tax ?
                        <View style={this.props.styleOneRowPrice}>
                            <Text style={this.props.styleLabelTotal}>{Identify.__('Grand Total')} ({Identify.__('Incl. Tax')})</Text>
                            <Format price={data.grand_total_incl_tax} style={[this.props.stylePriceTotal, { color: Identify.theme.price_color }]} type={this.type} currency_symbol={this.currency_symbol} />
                        </View> : null
                    }
                </View>);
            } else if (data.grand_total_incl_tax) {
                grand_total = (
                    <View style={this.props.styleOneRowPrice}>
                        <Text style={this.props.styleLabelTotal}>{Identify.__('Grand Total')}</Text>
                        <Format price={data.grand_total_incl_tax} style={[this.props.stylePriceTotal, { color: Identify.theme.price_color, marginTop: 6 }]} type={this.type} currency_symbol={this.currency_symbol} />
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
                        <Language text={title} />
                        {value}
                    </View>
                    );
                    rows.push(el);
                }
                custom = <View key={Identify.makeid()}>{rows}</View>;
            }
            return (
                <View>
                    {subtotal}
                    {discount}
                    {/* {custom} */}
                    {grand_total}
                </View>
            );
        } else {
            return <View></View>
        }
    }
    render() {
        const { navigation } = this.props;

        if (this.merchant_configs) {
            return (
                <View style={[this.props.container, { marginHorizontal: navigation && navigation.state && navigation.state.routeName === 'Cart' ? 12 : 0 }]}>
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
    stylePrice: { color: material.priceColor, fontFamily: material.fontBold },
    styleLabelTotal: { fontSize: 20, fontWeight: '500' },
    stylePriceTotal: { fontSize: 20, color: material.priceColor, fontFamily: material.fontBold },
    styleOneRowPrice: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    styleTwoRowPrice: { flex: 1, flexDirection: 'column', justifyContent: 'space-between' },
    container: { borderRadius: 16, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#D8D8D8', paddingHorizontal: 20, paddingVertical: 30, marginTop: 15, marginBottom: 30 },
    stylePriceSubTotal: { color: material.priceColor, fontFamily: material.fontBold, paddingTop: 4 },
    type: 0,
    currency_symbol: null
};
// export default Totals;
const mapStateToProps = (state) => {
    return { data: state.redux_data };
}
export default connect(mapStateToProps)(Totals);
