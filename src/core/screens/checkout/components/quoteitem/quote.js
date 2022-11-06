import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'native-base';
import Identify from '@helper/Identify';
import { StyleSheet } from 'react-native';
import material from '@theme/variables/material';
import Format from '../../../catalog/components/product/price/format';

const Quote = (props) => {

     merchant_configs = Identify.isEmpty(Identify.getMerchantConfig()) ? null : Identify.getMerchantConfig();
     style =  props.style ?  props.style : {};
     tax_cart_display_price =  merchant_configs.storeview.tax.tax_cart_display_price;

    function renderPrice(quoteItem) {
        let price = <Text style={styles.itemStyle}>{Identify.__('Price') + ': '}<Format style={{ color: material.priceColor }} price={quoteItem.row_total} /></Text>;
        if ( tax_cart_display_price == 3) {
            price = (<View>
                <Text style={styles.itemStyle}>{Identify.__('Incl Tax') + ': '}<Format style={{ color: material.priceColor }} price={quoteItem.row_total_incl_tax} /></Text>
                <Text style={styles.itemStyle}>{Identify.__('Excl Tax') + ': '}<Format style={{ color: material.priceColor }} price={quoteItem.row_total} /></Text>
            </View>);
        } else if ( tax_cart_display_price == 2) {
            price = <Text style={styles.itemStyle}>{Identify.__('Price') + ': '}<Format style={{ color: material.priceColor }} price={quoteItem.row_total_incl_tax} /></Text>;
        } else {
            price = <Text style={styles.itemStyle}>{Identify.__('Price') + ': '}<Format style={{ color: material.priceColor }} price={quoteItem.row_total} /></Text>;
        }
        return price;
    }

    function renderOption(quoteItem) {
        let optionText = [];
        if ( quoteItem.option) {
            let options = quoteItem.option;
            for (let i in options) {
                let option = options[i];
                optionText.push(<Text style={styles.itemStyle}
                    key={Identify.makeid()}>{option.option_title + ': ' + option.option_value}</Text>);
            }
        }
        return optionText;
    }

    function renderQuote(quoteItem) {
        return (
            <View>
                { renderPrice(quoteItem)}
                { renderOption(quoteItem)}
            </View>
        );
    }

         quoteItem =  props.item ?  props.item : 0;
        if ( quoteItem != 0) {
            return  renderQuote( quoteItem)
        } else {
            return (
                <Text style={ style}>0</Text>
            );
        }
}

const styles = StyleSheet.create({
    itemStyle: {
        fontSize: material.textSizeSmall,
        textAlign: 'left'
    }
});

export default Quote;