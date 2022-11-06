import React from 'react';
import Abstract from "./Abstract";
import Identify from "@helper/Identify";
import { Picker, ListItem, Icon, Header, Title, Body, Left, Right, Button } from 'native-base';
import material from '@theme/variables/material';
import { Platform } from 'react-native';

class Select extends Abstract {

    constructor(props) {
        super(props);
        this.state = {
            selected: ''
        };
        this.shouldRenderFirst = true;

        this.toolbarHeight = material.toolbarHeight;
        this.paddingTop = Platform.OS === 'ios' ? 18 : 0;
    }

    getValues() {
        return this.state.selected;
    }

    renderWithBundle = (data) => {
        let options = JSON.parse(JSON.stringify(data.selections));
        if (this.shouldRenderFirst) {
            options.unshift({
                id: '',
                name: '-- ' + Identify.__('Please Select') + ' --'
            });
            this.shouldRenderFirst = false;
        }
        if (this.state.selected == '') {
            this.state.selected = options[0].id;
        }
        let values = data.values;
        let items = [];
        for (let i in options) {
            let item = options[i];
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
            // if (Identify.magentoPlatform() === 2) {
            //     price = item.prices.finalPrice.amount;
            // }
            let element = (
                <Picker.Item style={{ fontFamily: material.fontFamily }} key={Identify.makeid()} name={this.props.key_field} value={item.id}
                    label={this.parent.renderLabelOptionText(item.name, price, item.qty)}
                    color={material.textColor}
                />
            );
            items.push(element);
        }
        return items;
    };

    renderWithCustom = (data) => {
        let values = JSON.parse(JSON.stringify(data.values));
        if (values instanceof Array && values.length > 0) {
            if (this.shouldRenderFirst) {
                values.unshift({
                    id: '',
                    title: '-- ' + Identify.__('Please Select') + ' --'
                });
                this.shouldRenderFirst = false;
            }
            if (this.state.selected == '') {
                this.state.selected = values[0].id;
            }
            let items = values.map(item => {
                let prices = 0;
                if (item.price) {
                    prices = item.price;
                } else if (item.price_including_tax) {
                    prices = item.price_including_tax.price;
                }

                return (
                    <Picker.Item style={{ fontFamily: material.fontFamily }} key={Identify.makeid()} name={this.props.key_field} value={item.id}
                        label={this.renderLabelItemText(item.title, prices)}
                        color={material.textColor} />
                );

            });
            return items;
        }
        return <View />
    };

    onValueChange(value: string) {
        this.state.selected = value;
        this.setState({ selected: value });
        this.parent.updatePrices();
    }

    render = () => {
        let { data } = this.props;
        let type_id = this.props.parent.getProductType();
        let items = null;
        if (type_id === 'bundle') {
            items = this.renderWithBundle(data);
        } else {
            items = this.renderWithCustom(data)
        }
        return (
            <Picker
                renderHeader={backAction =>
                    <Header style={{
                        backgroundColor: Identify.theme.app_background,
                        elevation: 0,
                        height: this.toolbarHeight,
                        paddingTop: this.paddingTop
                    }}>
                        <Left>
                            <Button transparent onPress={backAction}>
                                <Icon name={"md-close"} style={{ color: Identify.theme.textColor }} />
                            </Button>
                        </Left>
                        <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                            <Title style={{ color: Identify.theme.textColor }}>{Identify.__('Select One')}</Title>
                        </Body>
                        <Right />
                    </Header>}
                mode="dropdown"
                iosIcon={<Icon name="ios-arrow-down" style={{ color: material.textColor }} />}
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}
                style={{ width: '100%', marginLeft: 10, marginRight: 10 }}
                itemTextStyle={{ color: material.textColor, fontFamily: material.fontFamily }}
                textStyle={{ color: material.textColor, fontFamily: material.fontFamily }}>
                {items}
            </Picker>
        );
    }
}

export default Select;
