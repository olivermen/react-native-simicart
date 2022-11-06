import React from 'react';
import md5 from 'md5';
import SimiCart from './simicart';
import AppStorage from './storage';

const maxLength = 14;
const minLength = 4;
const template = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const Buffer = require("buffer").Buffer;

class Identify {
    static language = null;
    static theme = null;
    static appConfig = null;
    static locale_identifier = null;
    static store_id = "default";
    static plugins = [];
    static location = {};
    static customerParams = null;
    static customerData = null;
    static creditCardData = null;
    static initialNotificationOpened = false;
    static isOpenShareFB = false;
    static isRunInitDeepLink = false;
    static merchantConfig = null;
    static appTrackingEnabled = false;

    static setAppConfig(config) {
        this.language = config.language || null;
        this.theme = config.theme || null;
        this.appConfig = config;
        this.plugins = config['site_plugins'] || [];
    }

    static getSimiCartConfig() {
        return {
            merchant_url: SimiCart.merchant_url,
            api_path: "",
            simicart_url: SimiCart.simicart_url,
            simicart_authorization: SimiCart.simicart_authorization,
        };
    }

    static setMerchantConfig(config) {
        this.merchantConfig = config;
    }

    static getMerchantConfig() {
        return this.merchantConfig;
    }

    static TRUE(data) {
        if (data) {
            data = data.toString();
            data = data.toLowerCase();

            if (data === '0') {
                return false;
            }
            if (data === 'false') {
                return false;
            }

            return true;
        } else {
            return false;
        }
    }

    static isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    static __(text) {
        if (Identify.language !== null && Identify.locale_identifier !== null) {
            let laguageWithCode = Identify.language[Identify.locale_identifier];
            if (laguageWithCode && laguageWithCode.hasOwnProperty(text)) {
                return laguageWithCode[text];
            }
        }
        return text;
    }

    static makeid() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 20; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return md5(text + Date.now());
    }

    static isRtl() {
        let is_rtl = false;
        let configs = this.getMerchantConfig();
        if (configs !== null) {
            is_rtl = parseInt(configs.storeview.base.is_rtl) === 1;
        }
        return is_rtl;
    }

    static upperCaseFirstLetterInString(string) {
        let word = string.split(' ');
        let StringAfter = []
        word.forEach(w => {
            StringAfter.push(w.charAt(0).toUpperCase() + w.slice(1))
        })
        return StringAfter.join(' ')
    }

    static formatPrice(price, type = 0) {
        if (typeof (price) != "number") {
            price = parseFloat(price);
        }
        //let merchant_config = JSON.parse(localStorage.getItem('merchant_config'));
        let merchant_config = this.getMerchantConfig();
        if (merchant_config !== null) {
            let currency_symbol = merchant_config.storeview.base.currency_symbol || merchant_config.storeview.base.currency_code;
            let currency_position = merchant_config.storeview.base.currency_position;
            let decimal_separator = merchant_config.storeview.base.decimal_separator;
            let thousand_separator = merchant_config.storeview.base.thousand_separator;
            let max_number_of_decimals = merchant_config.storeview.base.max_number_of_decimals;
            if (type === 1) {
                return Identify.putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals);
            }
            if (currency_position == "before") {
                return currency_symbol + " " + Identify.putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals);
            } else {
                return Identify.putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals) + currency_symbol;
            }
        }

    }

    static formatPriceWithCurrency(price, currency_symbol, type = 0) {
        if (typeof (price) != "number") {
            price = parseFloat(price);
        }
        let merchant_config = this.getMerchantConfig();
        if (merchant_config !== null) {
            let currency_position = merchant_config.storeview.base.currency_position;
            let decimal_separator = merchant_config.storeview.base.decimal_separator;
            let thousand_separator = merchant_config.storeview.base.thousand_separator;
            let max_number_of_decimals = merchant_config.storeview.base.max_number_of_decimals;
            if (type === 1) {
                return Identify.putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals);
            }
            if (currency_position == "before") {
                return currency_symbol + Identify.putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals);
            } else {
                return Identify.putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals) + currency_symbol;
            }
        }

    }

    static putThousandsSeparators(value, sep, decimal, max_number_of_decimals) {
        if (!max_number_of_decimals) {
            let merchant_config = this.getMerchantConfig();
            max_number_of_decimals = merchant_config.storeview.base.max_number_of_decimals || 2;
        }

        if (sep == null) {
            sep = ',';
        }
        if (decimal == null) {
            decimal = '.';
        }

        value = value.toFixed(max_number_of_decimals);
        // check if it needs formatting
        if (value.toString() === value.toLocaleString()) {
            // split decimals
            var parts = value.toString().split(decimal)
            // format whole numbers
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
            // put them back together
            value = parts[1] ? parts.join(decimal) : parts[0];
        } else {
            value = value.toLocaleString();
        }
        return value;
    }

    static isPluginEnabled(sku) {
        if (!this.pluginsStatus)
            this.pluginsStatus = {};
        if (typeof this.pluginsStatus[sku] === "undefined" && this.plugins.length > 0) {
            let pluginEnabled = false;
            this.plugins.forEach((plugin) => {
                if (plugin.sku && (plugin.sku === sku)) {
                    if (parseInt(plugin['config']['enable'], 10) === 1) {
                        pluginEnabled = true;
                    }
                    return false;
                }
            })
            this.pluginsStatus[sku] = pluginEnabled;
        }
        return this.pluginsStatus[sku];
    }

    static hexToRgb = (hex, opacity = 1) => {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        let rgb = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
        if (rgb) {
            return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opacity + ')'
        }
        return hex;
    };

    static randomNumber(max, min) {
        return Math.round(min + Math.random() * (max - min));
    }

    static getCheckoutParams(redirectUrl, quoteId) {
        let email = '';
        let password = '';
        quoteId = new Buffer(quoteId).toString("base64");
        let secretKey = md5(SimiCart.merchant_authorization);

        let customerParams = Identify.getCustomerParams();
        if (customerParams) {
            email = customerParams.email;
            password = customerParams.password;
        }

        let salt = '';
        let randLength = this.randomNumber(maxLength, minLength);
        for (let i = 0; i < randLength; i++) {
            salt += template.charAt(this.randomNumber(template.length, 0));
        }

        let token = '';
        let customerData = {
            email: email,
            password: password,
            quote_id: quoteId,
            redirect_url: new Buffer(redirectUrl).toString("base64")
        };

        let encodedCustomerData = new Buffer(JSON.stringify(customerData)).toString("base64");

        secretKey = secretKey.slice(0, salt.length) + salt + secretKey.slice(salt.length, secretKey.length);
        token = encodedCustomerData.slice(0, salt.length) + secretKey + encodedCustomerData.slice(salt.length, encodedCustomerData.length);
        token = new Buffer(token).toString("base64");

        return {
            token: token,
            salt: salt
        };
    }

    static isMagento2() {
        let merchant_config = this.getMerchantConfig();
        if (merchant_config !== null && merchant_config.storeview.base.magento_version && merchant_config.storeview.base.magento_version == '2') {
            return true;
        }
        return false;
    }

    static validateEmail = (email) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,100})+$/;
        if (reg.test(email) === false)
            return false;
        else
            return true;
    }

    static setLocation(lat, lng) {
        this.location = { lat: lat, lng: lng };
    }

    static getLocation() {
        return this.location;
    }

    static setCustomerData(data) {
        this.customerData = data;
    }

    static getCustomerData() {
        return this.customerData;
    }

    static setCustomerParams(params) {
        this.customerParams = params;
    }

    static getCustomerParams() {
        return this.customerParams;
    }

    static initCreditCardData() {
        AppStorage.getData('credit_card').then((data) => {
            this.creditCardData = data ? JSON.parse(data) : null;
        })
    }

    static saveCreditCardData(data) {
        this.creditCardData = data;
    }

    static getCreditCardData() {
        return this.creditCardData;
    }

    static saveInitNotiOpened(isOpen) {
        this.initialNotificationOpened = isOpen;
    }

    static isInitNotiOpened() {
        return this.initialNotificationOpened;
    }

    static saveIsOpenShareFB(isOpenShareFB) {
        return this.isOpenShareFB = isOpenShareFB;
    }

    static enableAppTracking() {
        this.appTrackingEnabled = true;
    }

    static isAppTrackingEnable() {
        return this.appTrackingEnabled;
    }

}

export default Identify;
