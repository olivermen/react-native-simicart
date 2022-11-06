import React from 'react';
import { View, Text } from 'native-base';
import Identify from '../../../../../helper/Identify';
import Format from './format';
import Language from '../../../../../base/components/language/index';

class Grouped extends React.Component {
    constructor(props) {
        super(props);
        this.type = this.props.type;
        this.configure = null;
        this.configurePrice = this.props.configure_price ? this.props.configure_price : null;
        this.prices = this.props.prices;
        this.parent = this.props.parent;
        this.config = this.parent.props.config;
    }

    renderPriceWithTax() {
        let price_label = <Language style={this.parent.style.styleLabel} text={this.prices.price_label} />;
        let price_excl = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.price_excluding_tax.label) + ': '}</Text>
                <Format style={this.parent.style.stylePrice} price={this.prices.price_excluding_tax.price} />
            </View>
        );
        let price_incl = (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.price_including_tax.label) + ': '}</Text>
                <Format style={this.parent.style.stylePrice} price={this.prices.price_including_tax.price} />
            </View>
        );
        return (
            <View style={this.parent.style.styleTwoRowPrice}>
                {price_label}
                {price_excl}
                {price_incl}
            </View>
        )
    }

    renderPriceWithoutTax() {
        let price = this.prices.price;
        let price_label = this.prices.price_label ? this.prices.price_label : "Price";
        return (
            <View style={this.parent.style.styleOneRowPrice}>
                <Text style={this.parent.style.styleLabel}>{Identify.__(price_label) + ': '}</Text>
                <Format style={this.parent.style.stylePrice} price={price} />
            </View>
        );
    }

    renderView() {
        if (this.prices.show_ex_in_price && this.prices.show_ex_in_price === 1) {
            return(this.renderPriceWithTax())
        } else {
            return(this.renderPriceWithoutTax())
        }
    }
    render() {
        return (
            <View>{this.renderView()}</View>
        );
    }
}
export default Grouped;
