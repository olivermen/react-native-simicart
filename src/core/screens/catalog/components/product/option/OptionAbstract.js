import React from 'react';
import Identify from "@helper/Identify";
import { Text, View, Toast } from 'native-base';
import material from "../../../../../../../native-base-theme/variables/material";

class OptionAbstract extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.app_options;
        this.parentObj = this.props.parent;
        this.selected = {};
        this.required = [];
        this.params = {
            'product': this.props.product_id
        };
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    renderOptions = () => {
        return <View />;
    };

    renderOptionPrice = (price) => {
        return <Text style={{ marginLeft: 5 }}>{Identify.formatPrice(price)}</Text>
    };

    renderOptionPriceText = (price) => {
        return Identify.formatPrice(price);
    };

    renderLabelRequired = (show = 1) => {
        if (show === 1) {
            return <Text style={{ marginLeft: 5, color: '#ff0000' }}>*</Text>;
        }
        return null;
    };

    renderLabelOption = (title, price) => {
        let symbol = price > 0 ? <Text style={{ marginLeft: 5 }}>+</Text> : null;
        price = price > 0 ? this.renderOptionPrice(price) : null;
        let label = <View style={{ flexDirection: 'row', marginLeft: 10 }}>
            <Text>1 x {title}</Text>
            {symbol}
            {price}
        </View>;
        return label;
    };

    renderLabelOptionText = (title, price) => {
        let symbol = price > 0 ? ' +' : '';
        price = price > 0 ? ' ' + this.renderOptionPriceText(price) : '';
        let label = title + symbol + price;
        return label;
    };

    getStatePrice = (PriceComponent = this.parentObj.Price) => {
        return PriceComponent.state.prices;
    };

    updateStatePrice = (prices = this.getStatePrice(), PriceComponent = this.parentObj.Price) => {
        PriceComponent.updatePrices(prices);
    };

    updatePrices = (selected = this.selected) => {
        return <View />;
    };

    updateOptions = (key, val) => {
        this.selected[key] = val;
        this.updatePrices();
    };

    deleteOptions = (key) => {
        if (this.selected[key]) {
            delete this.selected[key];
            this.updatePrices();
        }
    }

    setParamOption = (keyOption = null) => {
        if (keyOption === null) return;
        this.params[keyOption] = this.selected;
    };

    getProductType = () => {
        return this.props.productType;
    };

    getParams = () => {
        return null;
    };

    checkOptionRequired = (selected, required = this.required) => {
        let check = true;
        // return false
        for (let i in required) {
            let requiredOptionId = required[i];
            if (!selected.hasOwnProperty(requiredOptionId) || !selected[requiredOptionId]) {
                check = false;
                break;
            }
        }
        if (!check) {
            Toast.show({
                text: Identify.__('Please select the options required') + ' (*)',
                type: "danger",
                duration: 3000,
                textStyle: {fontFamily: material.fontFamily}
            });
        }
        return check;
        // console.log(required)
    }

}

export default OptionAbstract;
