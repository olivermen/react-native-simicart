import React from 'react';
import OptionAbstract from '../OptionAbstract';
import Identify from '../../../../../../helper/Identify';
import { ListItem, Body, Toast, View, Text } from 'native-base';
import Radio from './options';
import material from '../../../../../../../../native-base-theme/variables/material';

class ConfigurableAbstract extends OptionAbstract {
    constructor(props) {
        super(props);
        this.exclT = 0;
        this.inclT = 0;
        this.selected_options = {};
        this.can_select = {};
        this.current_selected = {};
        this.state = { is_checked: true };
        this.shouldInitCanSelect = true;
    }
    updateSelectedOptions(id, value, reset_other_options) {
        if (this.can_select[id].indexOf(value) >= 0) {
            let options = this.selected_options;
            options[id] = value;
            this.selected_options = options;
            this.current_selected[id] = value;
            this.refreshOptionWhenSelected(id, value);
            this.updatePrices();
            this.setState(previousState => {
                return { is_checked: !previousState.is_checked };
            });
        }
    }
    updateCanSelect(id, value) {
        this.can_select[id] = value;
    }
    refreshOptionWhenSelected(id, value) {
        let attributes = this.data.configurable_options.attributes;
        let currentProducts = this.getCurrentProducts(id, value);
        // this.can_select = [];
        for (let i in attributes) {
            if (id != i) {
                let options = attributes[i].options;
                let canSelect = [];
                for (let op in options) {
                    let option = options[op];
                    let products = option.products;
                    if (currentProducts.filter(v => -1 !== products.indexOf(v)).length) {
                        //can select
                        canSelect.push(option.id);
                    }
                }
                this.updateCanSelect(i, canSelect);
            }
        }
    }
    getCurrentProducts(id, value) {
        let attributes = this.data.configurable_options.attributes;
        for (let i in attributes) {
            if (id == i) {
                let options = attributes[i].options;
                for (let op in options) {
                    let option = options[op];
                    if (option.id == value) {
                        return option.products;
                    }
                }
            }
        }
        return [-1];
    }
    getSelectedOptions() {
        return this.selected_options;
    }
    sortOptions(attributes) {
        let attArr = [];
        for (let i in attributes) {
            let attribute = attributes[i];
            attArr.push(attribute);
        }
        attArr.sort(function (a, b) {
            return parseInt(a.position) - parseInt(b.position);
        });
        return attArr;
    }
    renderOptions = () => {
        let attributes = this.data.configurable_options.attributes;
        let objOptions = this.sortOptions(attributes);
        let optionViews = [];
        let labelRequired = this.renderLabelRequired();
        let taxConfig = this.data.configurable_options.taxConfig;
        objOptions.forEach(attribute => {
            if (!this.selected_options[attribute.id]) {
                this.selected_options[attribute.id] = null;
            }
            this.required.push(attribute.id);

            if (this.shouldInitCanSelect) {
                let canSelect = [];
                attribute.options.forEach(element => {
                    canSelect.push(element.id);
                });
                this.updateCanSelect(attribute.id, canSelect);
            }

            let element = (
                <View key={Identify.makeid()}>
                    <View>
                        <Text style={{ fontFamily: material.fontBold, marginLeft: 10, marginTop: 10 }}>{Identify.__(attribute.label)} {labelRequired}</Text>
                    </View>
                    <View className="option-content">
                        <View>
                            {this.renderAttribute(attribute, attribute.id)}
                        </View>
                    </View>
                </View>
            );
            optionViews.push(element);
        });
        this.shouldInitCanSelect = false;
        return (<View>{optionViews}</View>);
    }

    renderAttribute = (attribute, id) => {
        let objs = <Radio data={attribute} parent={this} attribute_id={id} />;
        return objs;
    }

    getParams = () => {
        let params = {};
        if (this.checkOptionRequired(this.selected_options)) {
            return {
                super_attribute: this.selected_options
            };
        }
        return false;
    }

    updatePrices = (originalPrices = null) => {
        if (originalPrices == null) {
            originalPrices = JSON.parse(JSON.stringify(this.props.prices));
        }
        if (Identify.isMagento2()) {
            this.updatePricesM2(originalPrices);
        } else {
            this.updatePricesM1(originalPrices);
        }
    }

    dispatchMergePrice(originalPrices) {
        this.updatePrices(originalPrices);
    }
    updatePricesM1 = (originalPrices) => {
        let selected = this.selected_options;
        let prices = originalPrices;
        let attributes = this.data.configurable_options.attributes;
        let taxConfig = this.data.configurable_options.taxConfig;
        this.exclT = 0;
        this.inclT = 0;

        for (let i in selected) {
            let value = selected[i];
            let option = attributes[i];
            let selections = option.options;
            if (value) {
                for (let j in selections) {
                    let selection = selections[j];
                    if (selection.id === value) {
                        if (taxConfig.includeTax) {
                            if (selection.price !== 0) {
                                let tax = parseFloat(selection.price / (100 + taxConfig.defaultTax) * taxConfig.defaultTax);
                                let excl = parseFloat(selection.price - tax);
                                let incl = parseFloat(excl * (1 + (taxConfig.currentTax / 100)));
                                this.exclT += excl;
                                this.inclT += incl;
                            }
                        } else {
                            if (selection.price !== 0) {
                                let tax = parseFloat(selection.price * (taxConfig.currentTax / 100));
                                let excl = parseFloat(selection.price);
                                let incl = parseFloat(excl + tax);
                                this.exclT += excl;
                                this.inclT += incl;
                            }
                        }
                    }
                }
            }
        }

        if (taxConfig.showIncludeTax === true) {
            //set price when choosing
            prices.regular_price += this.inclT;
            prices.price += this.inclT;

        } else if (taxConfig.showBothPrices === true) {
            // prices.regural_price += inclT;
            prices.price_excluding_tax.price += this.exclT;
            prices.price_including_tax.price += this.inclT;
        } else {
            prices.regular_price += this.exclT;
            prices.price += this.exclT;
        }
        if (this.props.current_parent.option_custom) {
            this.props.current_parent.option_custom.updatePrices(prices);
            return;
        } else {
            this.parentObj.updatePrices(prices);
        }
    }

    updatePricesM2 = (originalPrices) => {
        let selected = this.selected_options;
        let prices = originalPrices;
        let simpleSelected = 0;
        let indexMap = this.data.configurable_options.index;
        let optionPrices = this.data.configurable_options.optionPrices;

        for (let i in indexMap) {
            let index = JSON.stringify(indexMap[i]);
            if (index === JSON.stringify(selected)) {
                simpleSelected = i;
            }
        }
        let optionPrice = {};
        for (let j in optionPrices) {
            if (simpleSelected === j) {
                optionPrice = optionPrices[j];
            }
        }
        if (optionPrice.oldPrice) {
            prices.regular_price = optionPrice.oldPrice.amount;
            if (prices.show_ex_in_price != null && prices.show_ex_in_price == 1) {
                prices.price_excluding_tax.price = optionPrice.basePrice.amount;
            }
        }
        if (optionPrice.finalPrice) {
            prices.price = parseFloat(optionPrice.finalPrice.amount) + this.inclT;
            if (prices.show_ex_in_price != null && prices.show_ex_in_price == 1) {
                prices.price_including_tax.price = optionPrice.finalPrice.amount;
            }
        }
        if(optionPrice.tierPrices && optionPrice.tierPrices.length > 0){
            prices.tierPrices = optionPrice.tierPrices
        }
        if (optionPrice.oldPrice && parseFloat(optionPrice.oldPrice.amount) > parseFloat(optionPrice.finalPrice.amount)){
            prices.has_special_price = 1;
        }else{
            prices.has_special_price = 0;
        }
        if (this.props.current_parent.option_custom) {
            this.props.current_parent.option_custom.updatePrices(prices);
        } else {
            this.parentObj.updatePrices(prices);
        }
    }
}

export default ConfigurableAbstract;
