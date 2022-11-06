import React from 'react';
import { View } from 'native-base';
import Simple from './simple';
import Bundle from './bundle';
import Grouped from './grouped';
import TierPrice from './tier';
import PropTypes from 'prop-types';
import material from '@theme/variables/material';
import Identify from "@helper/Identify";
import Events from '@helper/config/events';

class Price extends React.Component {
    constructor(props) {
        super(props);
        this.isUpdatePrice = false;
        this.storeConfig = Identify.getMerchantConfig().storeview.base;
        this.state = {
            prices: {}
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }
    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined)
        }
    }

    renderView() {
        if (this.type === "bundle") {
            return <Bundle prices={this.state.prices} parent={this} />
        }
        else if (this.type === "grouped") { // for list page
            return <Grouped prices={this.state.prices} parent={this} />
        }
        else {
            ////simple, configurable ....
            return <Simple prices={this.state.prices} parent={this} />
        }
    }

    renderTierPrice() {
        return (
            <TierPrice tierPrice={this.props.tierPrice} />
        );
    }

    render() {
        if (!this.isUpdatePrice) {
            this.initPrices();
        } else {
            this.isUpdatePrice = false;
        }
        let priceView = this.dispatchReplacePrice();
        if (priceView) {
            return priceView;
        } else {
            if (this.storeConfig && this.storeConfig.hasOwnProperty('is_show_price_for_guest') &&
                this.storeConfig.is_show_price_for_guest == '0' && !Identify.getCustomerData()) {
                return null;
            } else {
                return (
                    <View>
                        {this.renderView()}
                        {this.renderTierPrice()}
                    </View>
                );
            }
        }
    }

    dispatchReplacePrice() {
        if (Events.events.price_view) {
            let priceView = null;
            let priority = -1;
            for (let i = 0; i < Events.events.price_view.length; i++) {
                let node = Events.events.price_view[i];
                if (node.active === true && node.priority >= priority) {
                    priority = node.priority;
                    let Content = node.content;
                    priceView = <Content parent={this} />
                }
            }
            return (priceView);
        }
        return null;
    }

    updatePrices(newPrices) {
        this.isUpdatePrice = true;
        this.setState({ prices: newPrices });
    }

    initPrices() {
        this.type = this.props.type;
        this.configure = null;
        this.configurePrice = this.props.configure_price ? this.props.configure_price : null;
        this.state.prices = this.props.prices;
        this.style = {
            styleLabel: this.props.styleLabel ? this.props.styleLabel : { fontSize: material.textSizeSmall },
            stylePrice: this.props.stylePrice ? this.props.stylePrice : { fontSize: material.textSizeSmall, color: material.priceColor, marginRight: 5, marginLeft: 5 },
            stylePriceLine: this.props.stylePriceLine ? this.props.stylePriceLine : { fontSize: material.textSizeSmall, textDecorationLine: 'line-through', color: material.priceColor, marginRight: 5, marginLeft: 5 },
            styleSpecialPrice: this.props.styleSpecialPrice ? this.props.styleSpecialPrice : { fontSize: material.textSizeSmall, color: material.secpicalPriceColor, marginRight: 5, marginLeft: 5 },
            //one row.
            styleOneRowPrice: this.props.styleOneRowPrice ? this.props.styleOneRowPrice : { flexWrap: 'wrap', flexDirection: 'row' },
            styleTwoRowPrice: this.props.styleTwoRowPrice ? this.props.styleTwoRowPrice : { flexWrap: 'wrap', flexDirection: 'column' },
            styleDiscount: this.props.styleDiscount ? this.props.styleDiscount : { fontSize: 9 }
        }
    }

}

Price.defaultProps = {
    prices: 0,
    type: 'simple'

};
Price.propTypes = {
    type: PropTypes.string
};


export default Price;
