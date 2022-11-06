import React from 'react';
import { Alert } from 'react-native';
import Identify from '@helper/Identify';
import md5 from 'md5';
import simicart from '@helper/simicart';
import AppStorage from '@helper/storage';

export default class NewConnection {

    constructor() {
        this._dataGet = {};
        this._dataPost = null;
        this._headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + md5(simicart.merchant_authorization),
            'cache-control': 'no-cache',
            'pragma': 'no-cache'
        };
        this.config = Identify.getSimiCartConfig();
        this.isCustomURL = false;
        this.url = '';
        this.parent;
        this.showErrorAlert = true;
        this.requestID = '';
        this.requestMethod;
        this.shoulAddCustomerParams = true;
        this.addGetData.bind(this);
    }

    init(url, requestID, parent, requestMethod = 'GET') {
        this.url = url;
        this.requestID = requestID;
        this.parent = parent;
        this.requestMethod = requestMethod;
        return this;
    }

    createGetParams() {
        this.dispatchAddGetParams(this.requestID);
        let merchantConfig = Identify.getMerchantConfig();
        if (merchantConfig !== null && merchantConfig.storeview !== undefined) {
            if (this.requestMethod.toUpperCase() === 'PUT') {
                if (merchantConfig.storeview.base.is_support_put !== undefined
                    && parseInt(merchantConfig.storeview.base.is_support_put) === 0) {
                    this.requestMethod = 'POST';
                    this._dataGet['is_put'] = '1';
                }
            }
            if (this.requestMethod.toUpperCase() === 'DELETE') {
                if (merchantConfig.storeview.base.is_support_delete !== undefined
                    && parseInt(merchantConfig.storeview.base.is_support_delete) === 0) {
                    this.requestMethod = 'POST';
                    this._dataGet['is_delete'] = '1';
                }
            }
            if (merchantConfig.storeview.base.add_store_currency_id
                && merchantConfig.storeview.base.add_store_currency_id !== undefined
                && merchantConfig.storeview.base.add_store_currency_id === '1'
                && !this.url.includes('simiconnector/rest/v2/storeviews')) {
                this._dataGet['storeid'] = merchantConfig.storeview.base.store_id;
                this._dataGet['currencyid'] = merchantConfig.storeview.base.currency_code;
            }
        }
        if (this.shoulAddCustomerParams) {
            let customerParams = Identify.getCustomerParams();
            let customer = { ...customerParams };
            if (customer.hasOwnProperty('simi_hash')) {
                delete customer['password']
            }
            for (let key in customer) {
                this._dataGet[key] = customerParams[key];
            }
        }
    }

    initURL() {
        let _fullUrl = this.config.merchant_url;
        let merchantConfig = Identify.getMerchantConfig();
        if (merchantConfig !== null) {
            if (merchantConfig.storeview.base.base_url !== '' && merchantConfig.storeview.base.base_url != null) {
                _fullUrl = merchantConfig.storeview.base.base_url;
            } else {
                _fullUrl = this.config.merchant_url
                if (parseInt(merchantConfig.storeview.base.use_store) === 1) {
                    _fullUrl = this.config.merchant_url + '/' + merchantConfig.storeview.base.store_code
                }
            }
        }
        if (_fullUrl.lastIndexOf('/') !== _fullUrl.length - 1) {
            _fullUrl += '/'
        }

        _fullUrl += this.config.api_path;
        _fullUrl += this.url;

        this.createGetParams();

        if (this._dataGet) {
            let getParams = Object.keys(this._dataGet).map((key) => {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(this._dataGet[key]);
            }).join('&');
            _fullUrl += "?" + getParams;
        }
        return _fullUrl;
    }

    connect() {
        let addQuoteID = this.dispatchAddQuoteId();
        if (addQuoteID) {
            AppStorage.getData('quote_id').then((quote_id) => {
                if (!Identify.getCustomerData() && quote_id) {
                    this.addGetData({
                        'quote_id': quote_id
                    });
                }
                this.startRequest();
            });
        } else {
            this.startRequest();
        }
    }

    startRequest() {
        let _fullUrl = this.url;
        if (!this.isCustomURL) {
            _fullUrl = this.initURL();
        }
        console.log(_fullUrl);

        let requestData = {};
        this.dispatchAddHeader();
        requestData['headers'] = new Headers(this._headers);
        requestData['method'] = this.requestMethod;
        if (this._dataPost) {
            requestData['body'] = JSON.stringify(this._dataPost);
            console.log(JSON.stringify(requestData['body']));
        }

        let _request = new Request(_fullUrl, requestData);
        fetch(_request)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                let errors = {};
                if (this.showErrorAlert) {
                    let message = Identify.__('Network response was not ok');
                    errors['errors'] = [
                        { message: message }
                    ];
                }
                return errors;
            })
            .then((data) => {
                if (data.errors) {
                    let hasHandleMethod = false;
                    if (this.parent && typeof this.parent.handleWhenRequestFail !== "undefined") {
                        this.parent.handleWhenRequestFail(this.requestID);
                        hasHandleMethod = true;
                    }
                    let errors = data.errors;
                    let error = errors[0];
                    let message = error.message;
                    if (this.showErrorAlert) {
                        if (hasHandleMethod) {
                            setTimeout(() => {
                                Alert.alert(
                                    Identify.__('Error'),
                                    Identify.__(message),
                                );
                            }, 300);
                        } else {
                            Alert.alert(
                                Identify.__('Error'),
                                Identify.__(message),
                            );
                        }
                    }
                } else {
                    this.parent.setData(data, this.requestID);
                }
            }).catch((error) => {
                if (this.parent && typeof this.parent.handleWhenRequestFail !== "undefined") {
                    this.parent.handleWhenRequestFail(this.requestID);
                }
                if (this.showErrorAlert) {
                    Alert.alert(
                        Identify.__('Error'),
                        Identify.__('Something went wrong')
                    );
                }
                console.log(error);
            });
    }

    dispatchAddGetParams(requestID) {
        let configEvents = require('@helper/config/events');
        let events = configEvents.default.events;
        if (configEvents && events && events.hasOwnProperty('network_get_params') && requestID != 'get_merchant_config') {
            for (let i = 0; i < events.network_get_params.length; i++) {
                let node = events.network_get_params[i];
                let key = node.key;
                let action = node.value;

                if (action.getParamValue()) {
                    let param = {};
                    param[key] = action.getParamValue();
                    this.addGetData(param);
                }
            }
        }
    }

    dispatchAddQuoteId() {
        let configEvents = require('@helper/config/events');
        let events = configEvents.default.events;
        if (configEvents && events && events.hasOwnProperty('add_quote_id')
            && events.add_quote_id.length > 0
            && (this.url.includes('simiconnector/rest/v2/quoteitems') || this.url.includes('simiconnector/rest/v2/orders/onepage'))) {
            let node = events.add_quote_id[0];
            if (node.active === true) {
                return true;
            }
        }
        return false;
    }

    dispatchAddHeader() {
        let configEvents = require('@helper/config/events');
        let events = configEvents.default.events;
        if (configEvents && events && events.hasOwnProperty('network_headers')) {
            for (let i = 0; i < events.network_headers.length; i++) {
                let node = events.network_headers[i];
                let key = node.key;
                let action = node.value;
                let param = {};
                if (node.get_param_value) {
                    param[key] = action.getParamValue();
                } else {
                    param[key] = action;
                }
                this.addHeaderData(param);
            }
        }
    }

    addHeaderData(data) {
        this._headers = {
            ...this._headers,
            ...data
        }
        return this;
    }

    addGetData(data) {
        this._dataGet = {
            ...this._dataGet,
            ...data
        };
        return this;
    }

    addBodyData(data) {
        this._dataPost = {
            ...this._dataPost,
            ...data
        };
        return this;
    }

    setCustomURL(isCustom) {
        this.isCustomURL = isCustom;
        return this;
    }

    setHeader(key, value) {
        this._headers[key] = value;
        return this;
    }

    setShowErrorAlert(show) {
        this.showErrorAlert = show;
        return this;
    }

    addCustomerParams(add) {
        this.shoulAddCustomerParams = add;
        return this;
    }

}