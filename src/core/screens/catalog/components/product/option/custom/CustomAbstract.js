import React from 'react';
import OptionAbstract from '../OptionAbstract';
import Identify from '../../../../../../helper/Identify';
import { ListItem, Body, View, Text } from 'native-base';
import Radio from '../base/radio';
import Checkbox from '../base/checkbox';
import Select from '../base/select';
import DatePicker from '../base/date';
import TimePicker from '../base/time';
import DateTime from '../base/datetime';
import TextField from '../base/text';
import MultiCheckbox from '../base/multicheckbox';
import File from '../base/File';
import material from '../../../../../../../../native-base-theme/variables/material';

class CustomAbstract extends OptionAbstract {

    constructor(props) {
        super(props);
        this.options = {};
    }

    renderOptions = () => {
        let options = this.data.custom_options;
        if (!options) return <View />;
        let objOptions = [];
        for (let i in options) {
            let item = options[i];
            let labelRequired = this.renderLabelRequired(parseInt(item.isRequired, 10));
            if (parseInt(item.isRequired, 10) === 1) {
                this.required.push(item.id);
            }
            let priceLabel = "";
            let showType = 2;
            if (item.type === 'drop_down' || item.type === 'checkbox'
                || item.type === 'multiple' || item.type === 'radio') {
                showType = 1;
            }

            if (showType === 2) {
                let itemPrice = item.values[0];
                let prices = 0;
                if (itemPrice.price) {
                    prices = itemPrice.price;
                } else if (itemPrice.price_including_tax) {
                    prices = itemPrice.price_including_tax.price;
                }
                priceLabel = prices > 0 ?
                    <Text style={{ marginLeft: 10 }}>+ {this.renderOptionPrice(prices)}</Text> : null;
            }
            let maxLength = 255;

            if (item.hasOwnProperty('max_characters')) {
                maxLength = item.max_characters;
            }

            let element =
                <View key={Identify.makeid()}>
                    <Text style={{ fontFamily: material.fontBold, marginLeft: 10, marginTop: 10, textAlign: 'left' }}>{item.title} {labelRequired} {priceLabel}</Text>
                    {this.renderContentOption(item, item.type, showType, maxLength)}
                    {item.hasOwnProperty('max_characters') &&
                        <Text style={{ fontSize: 12, marginLeft: 10, color: material.contentColor, marginTop: 5 }}>{Identify.__('Maximum Number of Characters') + ': '}
                            <Text style={{ fontFamily: material.fontBold, fontSize: 12 }}>{item.max_characters}</Text>
                        </Text>
                    }
                </View>;
            objOptions.push(element);
        }
        return (
            <View>
                {objOptions}
            </View>
        );
    }

    renderContentOption = (ObjOptions, type, showType, maxLength = 0) => {
        let id = ObjOptions.id;

        if (type === 'multiple' || type === 'checkbox') {
            return <MultiCheckbox values={ObjOptions.values} parent={this} showType={showType} onRef={ref => (this.options[id] = ref)} />
        }
        if (type === 'radio') {
            return <Radio data={ObjOptions} id={id} parent={this} onRef={ref => (this.options[id] = ref)} />
        }
        if (type === 'drop_down' || type === 'select') {
            return <Select data={ObjOptions} id={id} parent={this} onRef={ref => (this.options[id] = ref)} />
        }
        if (type === 'date') {
            return <DatePicker id={id} parent={this} onRef={ref => (this.options[id] = ref)} />
        }
        if (type === 'time') {
            return <TimePicker id={id} parent={this} onRef={ref => (this.options[id] = ref)} />
        }
        if (type === 'date_time') {
            return (<DateTime id={id} parent={this} onRef={ref => (this.options[id] = ref)} />)
        }
        if (type === 'field') {
            return <TextField id={id} parent={this} onRef={ref => (this.options[id] = ref)} maxLength={maxLength} />
        }
        if (type === 'area') {
            return <TextField id={id} parent={this} type={type} onRef={ref => (this.options[id] = ref)} maxLength={maxLength} />
        }
        if (type === 'file') {
            return <File id={id} parent={this} type={type} onRef={ref => (this.options[id] = ref)} obj={ObjOptions} />
        }
    };

    updatePrices = (originalPrices = null) => {
        if (originalPrices == null) {
            if (this.props.current_parent && this.props.current_parent.option_configurable) {
                this.props.current_parent.option_configurable.updatePrices();
                return;
            } else {
                originalPrices = JSON.parse(JSON.stringify(this.props.prices));
            }
        }

        let selected = {};
        for (let key in this.options) {
            let optionContent = this.options[key];
            let values = optionContent.getValues();
            if (values != '') {
                selected[key] = values;
            }
        }

        let exclTax = 0;
        let inclTax = 0;

        let customOptions = this.data.custom_options;
        for (let i in customOptions) {
            let option = customOptions[i];
            let selectedId = selected[option.id];
            if (selected.hasOwnProperty(option.id) && selectedId) {
                let values = option.values;
                if (option.type === "date" || option.type === "time"
                    || option.type === "date_time" || option.type === "area"
                    || option.type === "field" || option.type ==="file") {
                    let value = values[0];
                    if (value.price_excluding_tax) {
                        exclTax += parseFloat(value.price_excluding_tax.price);
                        inclTax += parseFloat(value.price_including_tax.price);
                    } else {
                        exclTax += parseFloat(value.price);
                        inclTax += parseFloat(value.price);
                    }
                } else {
                    for (let j in values) {
                        let value = values[j];
                        if (selectedId.includes(',')) {
                            if (selectedId.includes(value.id)) {
                                if (value.price_excluding_tax) {
                                    exclTax += parseFloat(value.price_excluding_tax.price);
                                    inclTax += parseFloat(value.price_including_tax.price);
                                } else {
                                    exclTax += parseFloat(value.price);
                                    inclTax += parseFloat(value.price);
                                }
                            }
                        } else {
                            if (value.id === selectedId) {
                                if (value.price_excluding_tax) {
                                    exclTax += parseFloat(value.price_excluding_tax.price);
                                    inclTax += parseFloat(value.price_including_tax.price);
                                } else {
                                    exclTax += parseFloat(value.price);
                                    inclTax += parseFloat(value.price);
                                }
                            }
                        }
                    }
                }
            }
        }

        if (originalPrices.show_ex_in_price === 1) {
            originalPrices.price_excluding_tax.price += exclTax;
            originalPrices.price_including_tax.price += inclTax;
        } else {
            originalPrices.regural_price += exclTax;
            originalPrices.price += exclTax;
        }

        if (this.data.download_options) {
            this.parentObj.dispatchMergePrice(originalPrices);
        } else {
            this.parentObj.updatePrices(originalPrices);
        }

        // console.log(originalPrices);
    }

    getParams = () => {
        let params = {};
        let selected = {};
        for (let key in this.options) {
            let optionContent = this.options[key];
            let values = optionContent.getValues();
            if (values != '') {
                params[key] = values;
                selected[key] = values;
            }
        }

        if (!this.checkOptionRequired(selected)) {
            return false;
        }

        return {
            options: params
        };
    }

}
export default CustomAbstract;
