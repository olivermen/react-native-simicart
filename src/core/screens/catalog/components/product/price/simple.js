import React from 'react';
import { View, Text } from 'native-base';
import Identify from '../../../../../helper/Identify';
import Format from './format';
import Language from '../../../../../base/components/language/index';
import material from '@theme/variables/material';

class Simple extends React.Component {
    constructor(props) {
        super(props);
        this.showOneRowPrice = Identify.getMerchantConfig().storeview.base.is_show_in_row_price ? Identify.getMerchantConfig().storeview.base.is_show_in_row_price : '0';
    }

    renderSpecialPriceWithTax() {
        let price_excluding_tax = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.price_excluding_tax.label) + ': '}</Text>
                <Format style={this.parent.style.styleSpecialPrice} price={this.prices.price_excluding_tax.price} />
            </View>
        );
        let price_including_tax = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.price_including_tax.label) + ': '}</Text>
                <Format style={this.parent.style.styleSpecialPrice} price={this.prices.price_including_tax.price} />
            </View>
        );
        let sale_off = 100 - (this.prices.price_including_tax.price / this.prices.regular_price) * 100;
        sale_off = parseFloat(sale_off).toFixed(0);
        let price_label = (
            // <Text style={this.parent.style.styleLabel}>
            <Format price={this.prices.regular_price} style={this.parent.style.stylePriceLine} />
            //     <Text style={this.parent.style.styleDiscount}>-{sale_off}%</Text>
            // </Text>
        );
        return (
            <View style={{ flexWrap: 'wrap' }}>
                {price_excluding_tax}
                {price_including_tax}
                {price_label}
            </View>
        )
    }

    renderSpecialPriceWithoutTax() {
        let price = (
            <View style={ this.parent.style.styleOneRowPrice }>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.special_price_label) + ':'}</Text>
                <Format price={this.prices.price} style={this.parent.style.styleSpecialPrice} />
            </View>
        );

        let sale_off = 100 - (this.prices.price / this.prices.regular_price) * 100;
        sale_off = sale_off.toFixed(0);

        let price_label = (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.price_label) + ':'}</Text>
                <Format price={this.prices.regular_price} style={[this.parent.style.stylePrice, { marginLeft: 5 }]} />
            </View>
        );
        if (this.showOneRowPrice == '1') {
            price = (<Format price={this.prices.price} style={[this.parent.style.styleSpecialPrice, { fontSize: material.isTablet ? 20 : 16 }]} />);
            price_label = (
                <Format price={this.prices.regular_price} style={this.parent.style.stylePriceLine} />
            );
        }
        return (
            <View style={this.showOneRowPrice == '1' ? this.parent.style.styleOneRowPrice : this.parent.style.styleTwoRowPrice}>
                {price_label}
                {price}
            </View>
        );
    }

    renderFromToPriceTax() {
        let from_to_tax_price = (
            <View>
                <Text>{Identify.__('From')}</Text>
                <View style={this.parent.style.styleOneRowPrice}>
                    <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.from_price_excluding_tax.label) + ': '}</Text>
                    <Format price={this.prices.from_price_excluding_tax.price} style={this.parent.style.stylePrice} />
                </View>
                <View style={this.parent.style.styleOneRowPrice}>
                    <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.from_price_including_tax.label) + ': '}</Text>
                    <Format price={this.prices.from_price_including_tax.price} style={this.parent.style.stylePrice} />
                </View>
                <Text>{Identify.__('To')}</Text>
                <View style={this.parent.style.styleOneRowPrice}>
                    <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.to_price_excluding_tax.label) + ': '}</Text>
                    <Format price={this.prices.to_price_excluding_tax.price} style={this.parent.style.stylePrice} />
                </View>
                <View style={this.parent.style.styleOneRowPrice}>
                    <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.to_price_including_tax.label) + ': '}</Text>
                    <Format price={this.prices.to_price_including_tax.price} style={this.parent.style.stylePrice} />
                </View>
            </View>
        )
        return from_to_tax_price;
    }

    renderPriceWithTax() {
        let price_excluding_tax = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.price_excluding_tax.label) + ': '}</Text>
                <Format price={this.prices.price_excluding_tax.price} style={this.parent.style.stylePrice} />
            </View>
        );
        let price_including_tax = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.price_including_tax.label) + ': '}</Text>
                <Format style={this.parent.style.stylePrice} price={this.prices.price_including_tax.price} />
            </View>
        );
        return (
            <View style={this.parent.style.styleTwoRowPrice}>
                {price_excluding_tax}
                {price_including_tax}
            </View>
        );
    }

    renderPriceWithoutTax() {
        let weee = null;
        if (this.prices.show_weee_price != null && this.prices.show_weee_price == 1) {
            weee = <View>{this.prices.weee}</View>
        }

        price = (<View><Format price={this.prices.price} style={this.parent.style.stylePrice} /></View>);
        if (this.prices.show_weee_price != null && this.prices.show_weee_price == 2) {
            weee = <View>{this.prices.weee}</View>
        }
        return (
            <View>
                {price}
                {weee}
            </View>
        );
    }

    renderLowPrice(){
        priceLow = (<View style={this.parent.style.styleOneRowPrice}>
            <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.low_price_label) + ': '}</Text>
            <Format price={this.prices.low_price} style={this.parent.style.stylePrice} />
        </View>);
        return (
            <View>
                {priceLow}
            </View>
        )
    }

    renderView() {
        if (this.prices.has_special_price !== null && this.prices.has_special_price === 1) {
            if (this.prices.show_ex_in_price != null && this.prices.show_ex_in_price == 1) {
                return (this.renderSpecialPriceWithTax());
            }else {
                return (this.renderSpecialPriceWithoutTax());
            }
        } else {
            if (this.prices.show_ex_in_price != null && this.prices.show_ex_in_price == 1) {
                if (this.prices.show_from_to_tax_price == 1) {
                    return (this.renderFromToPriceTax());
                }
                return (this.renderPriceWithTax());
            } else {
                return (this.renderPriceWithoutTax());
            }
        }
    }

    render() {
        this.initValues();
        let lowPrice = null;
        if(this.prices.is_low_price != null && this.prices.is_low_price == 1 && Identify.isMagento2()){
            lowPrice = this.renderLowPrice()
        }
        let views = null;
        if(this.prices.tierPrices != null  && Identify.isMagento2()){
            views = [];
            this.prices.tierPrices.forEach(element => {
                views.push(
                    <Text key={Identify.makeid()} style={{ fontSize: 12 }}>
                        {'Buy' + ' ' + element.qty + ' for ' + Identify.formatPrice(element.price) + ' each and save ' + element.percentage + '%'}
                    </Text>
                );
            });
        }
        return (
            <View>
                {this.renderView()}
                {lowPrice}
                {views}
            </View>
        );
    }

    initValues() {
        this.type = this.props.type;
        this.configure = null;
        this.configurePrice = this.props.configure_price ? this.props.configure_price : null;
        this.prices = this.props.prices;
        this.parent = this.props.parent;
        this.config = this.parent.props.config;
    }

}
export default Simple;
