import React from 'react';
import OptionAbstract from '../OptionAbstract';
import Identify from '../../../../../../helper/Identify';
import { View, Text } from 'native-base';
import Radio from '../base/radio';
import Checkbox from '../base/checkbox';
import Select from '../base/select';
import MultiCheckbox from '../base/multicheckbox';
import material from '../../../../../../../../native-base-theme/variables/material';

class BundleAbstract extends OptionAbstract {

    constructor(props) {
        super(props);
        this.options = {};
    }

    sortAttributes(attributes) {
        let list = [];
        for (let i in attributes) {
            let obj = attributes[i];
            obj['key'] = i;
            list.push(obj);
        }
        list.sort(function (a, b) {
            return a.position - b.position;
        });
        return list;
    }

    renderOptions = () => {
        let attributes = this.data.bundle_options.options;
        let sortedAttributes = this.sortAttributes(attributes);

        let objOptions = [];
        this.selected = this.data.bundle_options.selected;
        let selected = this.props.selected ? this.props.selected : null;
        sortedAttributes.forEach(obj => {
            let labelRequried = this.renderLabelRequired(parseInt(obj.isRequired, 10));
            if (obj.isRequired === "1") {
                labelRequried = "*";
                this.required.push(obj.key);
            }
            if (selected) {
                let values = selected[obj.key];
                if (values && values.length) {
                    obj.values = values;
                }
            }
            let type = 'single';
            if (obj.isMulti) {
                type = 'multi';
            }
            // if(Identify.connectorVersion()){
            //     type = obj.type ? obj.type : type;
            // }
            let element = this.renderAttribute(type, obj, obj.key, labelRequried);
            objOptions.push(element);
        });
        return (
            <View>
                {objOptions}
            </View>
        );
    };

    renderAttribute = (type, obj, id, labelRequired) => {
        return (
            <View key={Identify.makeid()}>
                <Text style={{ fontFamily: material.fontBold, marginLeft: 10, marginTop: 10 }}>{obj.title} {labelRequired}</Text>
                {this.renderContentAttribute(obj, type, id)}
            </View>
        )
    }

    renderContentAttribute = (ObjOptions, type = 'single', id = '0') => {
        let key = id;
        if (type === 'select') {
            return <Select data={ObjOptions} id={key} parent={this} onRef={ref => (this.options[id] = ref)} />
        }
        if (type === 'single' || type === 'radio') {
            return <Radio data={ObjOptions} id={key} parent={this} onRef={ref => (this.options[id] = ref)} />
        }
        if (type === 'multi' || type === 'checkbox') {
            return <MultiCheckbox selections={ObjOptions.selections}
                values={ObjOptions.values}
                id={key}
                parent={this}
                showType={type}
                onRef={ref => (this.options[id] = ref)} />
        }
    };

    renderLabelOption = (title, price, qty, app_tier_prices = null) => {
        let symbol = price > 0 ? <Text style={{ marginLeft: 5 }}>+</Text> : null;
        price = price > 0 ? this.renderOptionPrice(price) : null;
        let label =
            <View>
                <Text style={{ marginLeft: 10 }}>{qty} x {title} {symbol} {price}</Text>
                {app_tier_prices ? <Text style={{ marginLeft: 10, marginTop: 4 }}>{app_tier_prices}</Text> : null}
            </View>
        return label;
    };

    renderLabelOptionText = (title, price, qty) => {
        let symbol = price > 0 ? ' +' : '';
        price = price > 0 ? ' ' + this.renderOptionPriceText(price) : '';
        let label = qty + ' x ' + title + symbol + price;
        return label;
    };

    updatePrices = () => {
        let originalPrices = JSON.parse(JSON.stringify(this.props.prices));

        let selected = {};
        for (let key in this.options) {
            let optionContent = this.options[key];
            let values = optionContent.getValues();
            if (values != '') {
                selected[key] = values.split(',');
            }
        }

        let attributes = this.data.bundle_options.options;
        let showIncludeTax = this.data.bundle_options.showIncludeTax;
        let showBoth = false;
        if (originalPrices.configure.show_ex_in_price && originalPrices.configure.show_ex_in_price === 1) {
            showBoth = true;
            if (originalPrices.configure.price_excluding_tax) {
                originalPrices.configure.price_excluding_tax.price = 0;
            }
            if (originalPrices.configure.price_including_tax) {
                originalPrices.configure.price_including_tax.price = 0;
            }

        } else {
            originalPrices.configure.price = 0;
        }
        for (let i in selected) {
            let values = selected[i];
            let option = attributes[i];
            let selections = option.selections;

            if (values) {
                for (let j in values) {
                    let element = selections[values];
                    if (values instanceof Array) {
                        element = selections[values[j]];
                    }

                    if (element) {
                        let qty = element.qty;

                        if (element.tierPrice.length > 0) {
                            for (let t in element.tierPrice) {
                                let item = element.tierPrice[t];
                                if (qty === parseInt(item.price_qty, 10)) {
                                    element = item;
                                    break;
                                }
                            }
                        }
                        if (showBoth) {
                            if (originalPrices.configure.price_excluding_tax && originalPrices.configure.price_including_tax) {
                                if (Identify.isMagento2()) {
                                    originalPrices.configure.price_excluding_tax.price += element.prices.finalPrice.amount * qty;
                                    originalPrices.configure.price_including_tax.price += element.prices.finalPrice.amount * qty;
                                } else {
                                    originalPrices.configure.price_excluding_tax.price += element.priceExclTax * qty;
                                    originalPrices.configure.price_including_tax.price += element.priceInclTax * qty;
                                }
                            }
                        } else {
                            if (Identify.isMagento2()) {
                                originalPrices.configure.price += element.prices.finalPrice.amount * qty;
                            } else {
                                if (showIncludeTax) {
                                    originalPrices.configure.price += element.priceInclTax * qty;
                                } else {
                                    originalPrices.configure.price += element.priceExclTax * qty;
                                }
                            }
                        }
                    }
                }
            }
        }
        this.parentObj.updatePrices(originalPrices);
    };

    getParams = () => {
        let params = {};
        let selected = {};
        for (let key in this.options) {
            let optionContent = this.options[key];
            let values = optionContent.getValues();
            if (values != '') {
                params[key] = values.split(',');
                selected[key] = values;
            }
        }

        if (!this.checkOptionRequired(selected)) {
            return false;
        }

        return {
            bundle_option: params,
            bundle_option_qty: {}
        };
    };

}
export default BundleAbstract;
