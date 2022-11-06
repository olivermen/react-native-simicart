import React from 'react';
import { View, Text } from 'native-base';
import Identify from '../../../../../helper/Identify';
import Format from './format';
import Language from '../../../../../base/components/language/index';

class Bundle extends React.Component {
    constructor(props) {
        super(props);
    }

    renderMinimalPriceWithTax() {
        let price_label = <Language style={this.parent.style.styleLabel} text={this.prices.price_label} />;
        let price_excluding_tax = <View style={this.parent.style.styleOneRowPrice}>
            <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.price_excluding_tax.label) + ': '}</Text>
            <Format style={this.parent.style.stylePrice} price={this.prices.price_excluding_tax.price} />
        </View>;
        if (this.prices.show_weee_price && this.prices.show_weee_price == 1) {
            weee = <Language style={this.parent.style.styleLabel} text={this.prices.weee} />;
        }
        let price_including_tax = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.price_including_tax.label) + ': '}</Text>
                <Format style={this.parent.style.stylePrice} price={this.prices.price_including_tax.price} />
            </View>
        );
        return (
            <View>
                {price_label}
                {price_excluding_tax}
                {price_including_tax}
            </View>);
    }

    renderMinimalPriceWithoutTax() {
        let price_label = (<View style={this.parent.style.styleOneRowPrice}>
            <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.price_label) + ': '}</Text>
            <Format style={this.parent.style.stylePrice} price={this.prices.price} />
        </View>);
        let weee = null;
        if (this.prices.show_weee_price && this.prices.show_weee_price == 1) {
            weee = <Language style={this.parent.style.styleLabel} text={this.prices.weee} />
        }
        let price_in = null;
        if (this.prices.price_in && this.prices.price_in != '') {
            price_in = <Text>{this.prices.price_in}</Text>;
        }
        return (
            <View>
                {price_label}
                {price_in}
            </View>);
    }

    renderPriceFromToWithTax() {
        let product_from_label = <Language style={this.parent.style.styleLabel} text={this.prices.product_from_label} />;
        let from_price_excluding_tax = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.from_price_excluding_tax.label) + ': '}</Text>
                <Format price={this.prices.from_price_excluding_tax.price} style={this.parent.style.stylePrice} />
            </View>
        );
        let from_price_including_tax = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.from_price_including_tax.label) + ': '}</Text>
                <Format price={this.prices.from_price_including_tax.price} style={this.parent.style.stylePrice} />
            </View>
        );
        let product_to_label = <Language style={this.parent.style.styleLabel} text={this.prices.product_to_label} />;
        let to_price_excluding_tax = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.to_price_excluding_tax.label) + ': '}</Text>
                <Format price={this.prices.to_price_excluding_tax.price} style={this.parent.style.stylePrice} />
            </View>
        );
        let to_price_including_tax = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.to_price_including_tax.label) + ': '}</Text>
                <Format price={this.prices.to_price_including_tax.price} style={this.parent.style.stylePrice} />
            </View>
        );
        return (
            <View>
                {product_from_label}
                {from_price_excluding_tax}
                {from_price_including_tax}
                {product_to_label}
                {to_price_excluding_tax}
                {to_price_including_tax}
            </View>);
    }

    renderPriceFromToWithoutTax() {
        let product_from_label = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.product_from_label) + ': '}</Text>
                <Format price={this.prices.from_price} style={this.parent.style.stylePrice} />
            </View>
        );
        let product_to_label = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.product_to_label) + ': '}</Text>
                <Format price={this.prices.to_price} style={this.parent.style.stylePrice} />
            </View>
        );
        let weee = null;
        if (this.prices.show_weee_price && this.prices.show_weee_price == 1) {
            weee = <Text style={this.parent.style.stylePrice}>{this.prices.weee}</Text>;
        }
        return (
            <View>
                {product_from_label}
                {product_to_label}
            </View>);
    }

    renderPriceWithTax() {
        let product_from_label = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.product_from_label) + ': '}</Text>
                <Format price={this.prices.from_price} style={this.parent.style.stylePrice} />
            </View>
        );
        if (this.prices.show_weee_price && this.prices.show_weee_price == 1) {
            weee = <Text style={this.parent.style.styleLabel}>{this.prices.weee}</Text>;
        }
        let product_to_label = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.product_to_label) + ': '}</Text>
                <Format price={this.prices.to_price} style={this.parent.style.stylePrice} />
            </View>
        );
        return (
            <View>
                {product_from_label}
                {product_to_label}
            </View>);
    }

    renderPriceWithoutTax() {
        let price = <Format price={this.prices.to_price} style={this.parent.style.stylePrice} />;
        if(Identify.isMagento2()){
            price = <Format price={this.prices.price} style={this.parent.style.stylePrice}/>
        }
        let weee = null;
        if (this.prices.show_weee_price && this.prices.show_weee_price == 1) {
            weee = <Text style={this.parent.style.styleLabel}>{this.prices.weee}</Text>;
        }
        return (
            <View>
                {price}
            </View>);
    }

    renderPriceConfigWithTax() {
        let configured_price_ex = null;
        let configured_price_in = null;
        let configured_label = <Language style={this.parent.style.styleLabel} text={this.prices.configure.product_label} />;
        if (this.prices.configure.price_excluding_tax) {
            configured_price_ex = (
                <View style={this.parent.style.styleOneRowPrice}>
                    <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.configure.price_excluding_tax.label) + ': '}</Text>
                    <Format price={this.prices.configure.price_excluding_tax.price} style={this.parent.style.stylePrice} />
                </View>
            );
        }
        if (this.prices.configure.price_including_tax) {
            configured_price_in = (
                <View style={this.parent.style.styleOneRowPrice}>
                    <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.configure.price_including_tax.label) + ': '}</Text>
                    <Format price={this.prices.configure.price_including_tax.price} style={this.parent.style.stylePrice} />
                </View>
            );
        }
        return (
            <View>
                {configured_label}
                {configured_price_ex}
                {configured_price_in}
            </View>);
    }

    renderPriceConfigWithoutTax() {
        let configured_label = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.configure.product_label) + ': '}</Text>
                <Format price={this.prices.configure.price} style={this.parent.style.stylePrice} />
            </View>
        );
        return (
            <View>
                {configured_label}
            </View>
        );
    }

    renderView() {
        let price = null;
        let priceConfigure = null;

        if (this.prices.minimal_price && this.prices.minimal_price == 1) {
            if (this.prices.show_ex_in_price && this.prices.show_ex_in_price == 1) {
                price = this.renderMinimalPriceWithTax();
            } else {
                price = this.renderMinimalPriceWithoutTax();
            }
        } else {
            if (this.prices.show_from_to_tax_price && this.prices.show_from_to_tax_price == 1) {
                if (this.prices.show_ex_in_price && this.prices.show_ex_in_price == 1) {
                    price = this.renderPriceFromToWithTax();
                } else {
                    price = this.renderPriceFromToWithoutTax();
                }
            } else {
                if (this.prices.show_ex_in_price && this.prices.show_ex_in_price == 1) {
                    price = this.renderPriceWithTax();
                } else {
                    price = this.renderPriceWithoutTax();
                }
            }
        }
        if (this.prices.configure) {
            if (this.prices.configure.show_ex_in_price && this.prices.configure.show_ex_in_price == 1) {
                priceConfigure = this.renderPriceConfigWithTax();
            } else {
                priceConfigure = this.renderPriceConfigWithoutTax();
            }
        }
        return (
            <View>
                {price}
                {priceConfigure}
            </View>);
    }
    render() {
        this.initValues();
        return (
            <View>{this.renderView()}</View>
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
export default Bundle;
