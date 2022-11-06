import React from 'react';
import { View } from 'native-base';
import { RadioButton, RadioGroup } from 'react-native-flexi-radio-button';
import Identify from "@helper/Identify";
import Abstract from "./Abstract";

class RadioField extends Abstract {
    constructor(props) {
        super(props);
        this.state = {
            selected: ''
        };
        this.showTier = false;
        this.type = ''
    }

    getValues() {
        return this.state.selected;
    }

    onSelect = (index, value) => {
        this.state.selected = value;
        this.parent.updatePrices();
    };

    renderWithBundle = (data) => {
        this.type = data.type;
        let options = data.selections;
        let values = data.values;;
        let items = [];
        let addFirstItem = false;
        for (let i in options) {
            let item = options[i];
            if (!addFirstItem) {
                this.onSelect(i, i)
                addFirstItem = true;
            }

            let selected = false;
            if (values && values.indexOf(i.toString()) >= 0) {
                selected = true;
            }
            let price = 0;
            if (item.price) {
                price = item.price;
            }
            if (item.priceInclTax) {
                price = item.priceInclTax;
            }
            if (item.tierPrice && item.tierPrice.length > 0) {
                this.showTier = true;
            }
            let app_tier_prices = null;
            if (item.app_tier_prices && item.app_tier_prices.length > 0) {
                app_tier_prices = item.app_tier_prices[0];
            }
            if (item.prices?.basePrice?.amount) {
                price = item.prices.basePrice.amount;
            }
            let label = this.parent.renderLabelOption(item.name, price, item.qty, app_tier_prices);
            let element = (
                <RadioButton
                    key={Identify.makeid()}
                    value={i}
                    color='#E4531A'>
                    {label}
                </RadioButton>
            );
            items.push(element);
        }
        return items;
    };

    renderWithCustom = (data) => {
        let values = data.values;
        let items = values.map((item, index) => {
            let prices = 0;
            if (item.price) {
                prices = item.price;
            } else if (item.price_including_tax) {
                prices = item.price_including_tax.price;
            }
            if (item.prices?.basePrice?.amount) {
                prices = item.prices.basePrice.amount
            }
            return (
                <RadioButton
                    key={Identify.makeid()}
                    value={item.id}
                    color='#E4531A'
                    style={{ backgroundColor: '#F8F9FA', padding: 0, paddingHorizontal: 15, paddingVertical: 12 }}
                >
                    {this.renderLableItem(item.title, prices)}
                </RadioButton>
            )
        })
        return items;
    };

    render = () => {
        let { parent, data, warranty } = this.props;
        let type_id = parent.getProductType();
        let items = null;
        if (type_id === 'bundle') {
            items = this.renderWithBundle(data);
            if (warranty) {
                items = this.renderWithCustom(data);
            }
        } else {
            items = this.renderWithCustom(data);
        }

        return (
            <View>
                <RadioGroup
                    color='#E4531A'
                    ref={(radio) => this.Radio = radio}
                    selectedIndex={this.type === 'radio' && !warranty ? 0 : -1}
                    onSelect={(index, value) => this.onSelect(index, value)}
                >
                    {items}
                </RadioGroup>
            </View>

        );
    }
}
RadioField.defaultProps = {
    type: 1
};
export default RadioField;
