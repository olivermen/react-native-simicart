import React from 'react';
import Abstract from "../base/Abstract";
import { View, Text } from 'native-base';
import { RadioButton, RadioGroup } from 'react-native-flexi-radio-button';
import Identify from "../../../../../../helper/Identify";

class Options extends Abstract {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        };
        this.attribute_id = this.props.attribute_id;
        this.defaultValue = this.parent.selected_options[this.attribute_id] ? this.parent.selected_options[this.attribute_id] : null;
        this.defaultIndex = null;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    updateCheck = (index, val) => {
        this.parent.updateSelectedOptions(this.attribute_id, val);
        //this.updateSelected(this.key,val);
    };

    renderOptions(data) {
        let values = data.options;
        let canValues = this.parent.can_select[this.attribute_id];
        // if (this.parent.can_select.length > 0) {
        //     for (let j in this.parent.can_select) {
        //         let selected = this.parent.can_select[j];
        //         if (this.attribute_id == selected.id) {
        //             canValues = selected.products;
        //         }
        //     }
        // }
        let conunt = 0;
        let items = values.map(item => {
            if (item.id == this.defaultValue) this.defaultIndex = conunt;
            conunt++;
            let prices = 0;
            if (item.price) {
                prices = item.price;
            } else if (item.price_including_tax) {
                prices = item.price_including_tax.price;
            }
            if (canValues.length > 0) {
                if (canValues.indexOf(item.id) >= 0) {
                    //can select
                    return (
                        <RadioButton
                            key={Identify.makeid()}
                            value={item.id}
                            color='#039BE5'
                            iconStyle={{
                                marginRight: Identify.isRtl() ? 0 : 16,
                                marginLeft: Identify.isRtl() ? 16 : 0
                            }}>
                            {this.renderLableItem(item.label, prices, {})}
                        </RadioButton>
                    )
                } else {
                    if (this.parent.selected_options[this.attribute_id] && this.parent.selected_options[this.attribute_id] == item.id) {
                        //remove selected
                        this.parent.selected_options[this.attribute_id] = null;
                        this.defaultIndex = null;
                        this.parent.done = false;
                    }
                    return (
                        <RadioButton
                            key={Identify.makeid()}
                            value={item.id}
                            color='#039BE5'
                            disabled={true}
                            iconStyle={{
                                marginRight: Identify.isRtl() ? 0 : 16,
                                marginLeft: Identify.isRtl() ? 16 : 0
                            }}>
                            {this.renderLableItem(item.label, prices, { color: '#dedede' })}
                        </RadioButton>
                    )
                }
            }
            return (
                <RadioButton
                    key={Identify.makeid()}
                    value={item.id}
                    iconStyle={{
                        marginRight: Identify.isRtl() ? 0 : 16,
                        marginLeft: Identify.isRtl() ? 16 : 0
                    }}>
                    {this.renderLableItem(item.label, prices, {})}
                </RadioButton>
            )
        })
        return items;
    };

    render() {
        let { data } = this.props;
        let items = null;
        items = this.renderOptions(data);
        return (
            <View>
                <RadioGroup style={{ marginLeft: 10 }}
                    color='#039BE5'
                    thickness={2}
                    selectedIndex={this.defaultIndex}
                    onSelect={(index, val) => { this.updateCheck(index, val) }}
                    name="radioOptions">
                    {items}
                </RadioGroup>
            </View>

        );
    }
}

export default Options;
