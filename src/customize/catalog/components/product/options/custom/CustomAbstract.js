import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'native-base';
import Radio from '../base/radio';
import Identify from '@helper/Identify';
import Select from '@screens/catalog/components/product/option/base/select';
import TextField from '@screens/catalog/components/product/option/base/text';
import DatePicker from '@screens/catalog/components/product/option/base/date';
import TimePicker from '@screens/catalog/components/product/option/base/time';
import DateTime from '@screens/catalog/components/product/option/base/datetime';
import OptionAbstract from '@screens/catalog/components/product/option/OptionAbstract';
import MultiCheckbox from '@screens/catalog/components/product/option/base/multicheckbox';
import File from '@screens/catalog/components/product/option/base/File';
import material from '@theme/variables/material';

class CustomAbstract extends OptionAbstract {

    constructor(props) {
        super(props);
        this.state = {
            activeOption: 'none'
        }
        this.options = {};
    }

    renderOptions = () => {
        let options = this.data.custom_options;
        if (!options) return <View />;
        let objOptions = null;
        let optionLabels = [];
        optionLabels.push(
            <View key={'none'} style={{ width: '32%' }}>
                <TouchableOpacity
                    style={[styles.labelCtn, this.state.activeOption == 'none' ? { borderWidth: 2, borderColor: '#E4531A' } : null]}
                    onPress={() => this.selectLabel('none')}>
                    <Text style={{ fontSize: Identify.isRtl() ? 12 : null }}>{Identify.__('None')}</Text>
                </TouchableOpacity>
            </View>
        );
        for (let i in options) {
            let item = options[i];
            optionLabels.push(
                <View key={item.id} style={{ width: '32%' }}>
                    <TouchableOpacity
                        style={[styles.labelCtn, this.state.activeOption == item.id ? styles.labelActive : null]}
                        onPress={() => this.selectLabel(item.id)}>
                        <Text style={{ fontSize: Identify.isRtl() ? 12 : null }}>{item.title}</Text>
                    </TouchableOpacity>
                    {this.state.activeOption == item.id && <View key={item.id + "extra"} style={{ width: '100%', height: 5, backgroundColor: 'white' }} />}
                </View>
            );

            if (this.state.activeOption == item.id) {
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

                objOptions = (
                    <View key={Identify.makeid()} style={{ marginTop: Identify.isRtl() ? (Platform.OS === 'ios' ? 51 : 50) : 42, borderWidth: 2, borderRadius: 8, borderColor: '#E4531A', paddingVertical: 20 }}>
                        {this.renderContentOption(item, item.type, showType, maxLength)}
                        {item.hasOwnProperty('max_characters') &&
                            <Text style={{ fontSize: 12, marginLeft: 10, color: material.contentColor, marginTop: 5 }}>{Identify.__('Maximum Number of Characters') + ': '}
                                <Text style={{ fontFamily: material.fontBold, fontSize: 12 }}>{item.max_characters}</Text>
                            </Text>
                        }
                    </View>
                );
            }
        }
        return (
            <View style={{ position: 'relative', minHeight: 39 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', top: 0, zIndex: 999 }}>
                    {optionLabels}
                </View>
                {objOptions}
            </View>
        );
    }

    renderContentOption = (ObjOptions, type, showType, maxLength = 0) => {
        let id = ObjOptions.id;
        this.options = {};

        if (type === 'multiple' || type === 'checkbox') {
            return <MultiCheckbox values={ObjOptions.values} parent={this} showType={showType} onRef={ref => (this.options[id] = ref)} />
        }
        if (type === 'radio') {
            return <Radio data={ObjOptions} id={id} parent={this} warranty={this.data.custom_options ? true : false} onRef={ref => (this.options[id] = ref)} />
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

    selectLabel = (id) => {
        this.setState({ activeOption: id });
        this.updatePrices(null, true);
    }

    updatePrices = (originalPrices = null, clear = false) => {
        if (originalPrices == null) {
            if (this.props.current_parent && this.props.current_parent.option_configurable) {
                this.props.current_parent.option_configurable.updatePrices();
                return;
            } else {
                originalPrices = JSON.parse(JSON.stringify(this.props.prices));
            }
        }

        let selected = {};
        if (!clear) {
            for (let key in this.options) {
                let optionContent = this.options[key];
                if (optionContent) {
                    let values = optionContent.getValues();
                    if (values != '') {
                        selected[key] = values;
                    }
                }
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
                    || option.type === "field" || option.type === "file") {
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
            if (originalPrices.price_after_discount_display < originalPrices.regular_price_display) {
                originalPrices.regular_price_display += exclTax
                originalPrices.price_after_discount_display += exclTax
            } else if (originalPrices.price_after_discount_display > originalPrices.regular_price_display) {
                originalPrices.price = originalPrices.price_after_discount_display
            }
            originalPrices.price += exclTax;
        }

        if (this.data.download_options) {
            this.parentObj.dispatchMergePrice(originalPrices);
        } else if (this.props.productType === 'bundle') {
            this.props.updateCustomPrices({ inclTax, exclTax })
        } else {
            this.parentObj.updatePrices(originalPrices);
        }
    }

    getParams = () => {
        let params = {};
        let selected = {};
        for (let key in this.options) {
            let optionContent = this.options[key];
            if (optionContent) {
                let values = optionContent.getValues();
                if (values != '') {
                    params[key] = values;
                    selected[key] = values;
                }
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

const styles = StyleSheet.create({
    labelCtn: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D8D8D8',
        paddingVertical: 10,
        position: 'relative',
        backgroundColor: 'white'
    },
    labelActive: {
        borderColor: '#E4531A',
        borderWidth: 2,
        borderBottomWidth: 10,
        borderBottomColor: '#FFFFFF'
        // borderBottomLeftRadius: 0,
        // borderBottomRightRadius: 0
    }
});

export default CustomAbstract;
