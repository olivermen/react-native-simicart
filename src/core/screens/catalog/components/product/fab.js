import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Fab, Icon, Button } from "native-base";
import { View } from 'react-native';
import Events from '@helper/config/events';
import md5 from 'md5';
import Identify from '@helper/Identify';
import material from '../../../../../../native-base-theme/variables/material';

export default class FabProduct extends SimiComponent {

    constructor(props) {
        super(props);
        this.state = {
            active: false
        };
    }

    dispatchAddButtons() {
        let plugins = Events.events.product_buttons;
        plugins.sort(function (a, b) {
            return parseInt(a.position) - parseInt(b.position);
        });
        let buttons = [];
        for (let i = 0; i < plugins.length; i++) {
            let node = plugins[i];
            if (node.active === true) {
                let key = md5("modules_product_buttons" + i);
                let Content = node.content;
                buttons.push(<Button key={key} style={{ backgroundColor: Identify.theme.button_background, marginBottom: 40 }}>
                    <Content obj={this} product={this.props.parent.product} />
                </Button>);
            }
        }
        return buttons;
    }

    render() {
        let buttons = this.dispatchAddButtons();

        if (!this.props.parent.product) {
            return (null);
        }
        return (
            <View>
                {buttons.length > 0 && <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{}}
                    position="bottomRight"
                    style={{ backgroundColor: Identify.theme.button_background, marginBottom: material.isIphoneX ? 50: 40 }}
                    onPress={() => this.setState({ active: !this.state.active })}>
                    <Icon name="ios-add" />
                    {buttons}
                </Fab>}
            </View>
        );
    }

}