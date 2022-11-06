import React from 'react';
import { TouchableOpacity } from 'react-native';
import Abstract from "@screens/catalog/components/product/option/base/Abstract";
import { View, Text, Icon } from 'native-base';
import { RadioButton } from 'react-native-flexi-radio-button';
import Identify from "@helper/Identify";

class Options extends Abstract {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            extend: false
        };
        this.attribute_id = this.props.attribute_id;
        this.defaultValue = this.parent.selected_options[this.attribute_id] ? this.parent.selected_options[this.attribute_id] : null;
        this.defaultIndex = null;
    }

    componentDidMount() {
        if (!this.parent.selected_options[this.attribute_id]) {
            this.parent.updateSelectedOptions(this.attribute_id, this.props.data.options[0].id);
        }
    }

    componentWillUnmount() {
    }

    updateCheck = (index, val) => {
        this.parent.updateSelectedOptions(this.attribute_id, val);
        //this.updateSelected(this.key,val);
    };

    openOptions = () => {
        this.setState({ extend: !this.state.extend })
    }

    hideOptions = () => {
        this.setState({ extend: false })
    }

    handleSelect = (id) => {
        this.parent.updateSelectedOptions(this.attribute_id, id)
        this.hideOptions()
    }

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
        const { extend } = this.state
        // let items = null;
        // items = this.renderOptions(data);
        let selectedValue = this.parent.selected_options[this.attribute_id] ? this.parent.selected_options[this.attribute_id] : null;
        let selectedOption = null;
        if (selectedValue) {
            selectedOption = data.options.find(item => item.id == selectedValue);
        }
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={this.openOptions}
                    style={{ backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#D8D8D8', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 8 }}
                >
                    <Text>{selectedOption ? selectedOption.label : ''}</Text>
                    <Icon style={{ fontSize: 20 }} name={extend ? "ios-arrow-up" : "ios-arrow-down"} />
                </TouchableOpacity>
                {extend ?
                    <View style={{ borderRadius: 8, borderWidth: 1, borderColor: '#E4531A', position: 'absolute', top: 0, width: '100%', backgroundColor: 'white' }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={this.hideOptions}
                            style={{ backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#D8D8D8', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderTopRightRadius: 8, borderTopLeftRadius: 8 }}
                        >
                            <Text>{selectedOption ? selectedOption.label : ''}</Text>
                            <Icon style={{ fontSize: 20 }} name={"ios-arrow-up"} />
                        </TouchableOpacity>
                        {data.options.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    activeOpacity={1}
                                    onPress={() => this.handleSelect(item.id)}
                                    style={{ backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#D8D8D8', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomRightRadius: index === data.options.length - 1 ? 8 : 0, borderBottomLeftRadius: index === data.options.length - 1 ? 8 : 0 }}
                                >
                                    <Text>{item.label}</Text>
                                    {selectedOption.id === item.id ? <Icon style={{ fontSize: 20 }} name={"md-checkmark"} /> : null}
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    : null}
            </View>

        );
    }
}

export default Options;
