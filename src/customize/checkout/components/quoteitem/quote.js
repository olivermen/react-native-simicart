import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import Format from '../../../catalog/components/product/price/format';

const EXCLUDE_KEYS = ['giftcard_template_image', 'giftcard_use_custom_image', 'amount', 'send_friend', 'notify_success'];

const Quote = (props) => {

    merchant_configs = Identify.isEmpty(Identify.getMerchantConfig()) ? null : Identify.getMerchantConfig();
    style = props.style ? props.style : {};
    tax_cart_display_price = merchant_configs.storeview.tax.tax_cart_display_price;

    function renderPrice(quoteItem) {
        let price = <Format style={styles.priceStyle} price={quoteItem.row_total} />;
        if (tax_cart_display_price == 3) {
            price = (<View>
                <Text>{Identify.__('Incl Tax') + ': '}<Format style={styles.priceStyle} price={quoteItem.row_total_incl_tax} /></Text>
                <Text>{Identify.__('Excl Tax') + ': '}<Format style={styles.priceStyle} price={quoteItem.row_total} /></Text>
            </View>);
        } else if (tax_cart_display_price == 2) {
            price = <Format style={styles.priceStyle} price={quoteItem.row_total_incl_tax} />;
        } else {
            price = <Format style={styles.priceStyle} price={quoteItem.row_total} />;
        }
        return price;
    }

    function renderOption(quoteItem) {
        let optionText = [];
        if (quoteItem.option) {
            let options = quoteItem.option;
            for (let i in options) {
                let option = options[i];
                optionText.push(<Text style={styles.itemStyle}
                    key={Identify.makeid()}>{option.option_title + ': ' + option.option_value}</Text>);
            }
        }
        return optionText;
    }

    function renderGiftCardOption(quoteItem) {
        if (quoteItem.product_type == 'giftvoucher') {
            const giftcard_options = quoteItem.product.giftcard_options;
            if (giftcard_options) {
                return Object.keys(giftcard_options).map((key, index) => {
                    if (EXCLUDE_KEYS.indexOf(key) != -1) {
                        return null;
                    }
                    return (
                        <Text
                            style={[styles.itemStyle, { textTransform: 'capitalize' }]}
                            key={index}>
                            {Identify.__(key.replace(/_/g, ' ')) + ': ' + giftcard_options[key]}
                        </Text>
                    );
                })
            }
        }
        return null;
    }

    function renderQuote(quoteItem) {
        return (
            <View>
                <View style={{ marginTop: 10 }}>
                    {renderOption(quoteItem)}
                    {renderGiftCardOption(quoteItem)}
                </View>
                <View style={{ marginTop: 10 }}>
                    {renderPrice(quoteItem)}
                </View>
            </View>
        );
    }

    quoteItem = props.item ? props.item : 0;
    if (quoteItem != 0) {
        return renderQuote(quoteItem)
    } else {
        return (
            <Text style={style}>0</Text>
        );
    }
}

const styles = StyleSheet.create({
    itemStyle: {
        textAlign: 'left',
        color: '#747474'
    },
    priceStyle: {
        fontFamily: material.fontBold,
        color: material.priceColor
    }
});

export default Quote;