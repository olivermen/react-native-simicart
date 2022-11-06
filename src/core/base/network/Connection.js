import md5 from 'md5';
import Identify from '@helper/Identify';
import { Alert } from 'react-native';
import AppStorage from "@helper/storage";
import simicart from '@helper/simicart';

class Connection {

    s = 'KLXYZXXOQCOvY9ZuuwvAdmopMPQjoj';

    constructor() {
        let current = this;
        this._loading = true;
        this._dataGet = null;
        this._dataPost = null;
        this._headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + md5(simicart.merchant_authorization),
        });
        // this._init = {cache: 'default', mode: 'cors'};
        this._init = { credentials: 'include' };
        this.merchantConfig = null;
        this.customer = null;
        this.config = Identify.getSimiCartConfig();
        this.fullUrl = "";
    }
    getFullUrl() {
        return this.fullUrl;
    }
    setCustomer(customer) {
        this.customer = customer;
    }

    getCustomer() {
        return this.customer;
    }

    setMerchantConfig(config) {
        this.merchantConfig = config;
    }

    getMerchantConfig() {
        return this.merchantConfig;
    }

    setHeader(key, value) {
        this._headers.set(key, value);
    }

    setInitConfig(key, value) {
        this._init[key] = value;
    }

    setHttpMethod(method) {
        this._init['method'] = method;
    }

    setLoading(isLoad) {
        this._loading = isLoad;
    }

    restData() {
        this._dataGet = null;
        this._dataPost = null;
        this._init['body'] = null;
    }

    //param is array
    setGetData(data) {
        this._dataGet = Object.keys(data).map(function (key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(data[key]);
        }).join('&');
    }

    //param is JSON
    setBodyData(data) {
        this._dataPost = JSON.stringify(data);
    }

    setBodyFormData(data) {
        this._dataPost = data;
    }

    dispatchAddGetParams(url) {
        let configEvents = require('@helper/config/events');
        let events = configEvents.default.events;
        if (configEvents && events && events.hasOwnProperty('network_get_params') && !url.includes('simiconnector/rest/v2/storeviews')) {
            if (this._dataGet == null) {
                this._dataGet = '';
            }
            for (let i = 0; i < events.network_get_params.length; i++) {
                let node = events.network_get_params[i];
                let key = node.key;
                let action = node.value;
                if (this._dataGet.endsWith) {
                    this._dataGet += '&';
                }
                this._dataGet += encodeURIComponent(key) + '=' + encodeURIComponent(action.getParamValue());
            }
        }
    }

    connect(url, obj, method = 'GET', showErrorAlert = true, customURL = '') {
        let addQuoteID = this.dispatchAddQuoteId(url);
        if (addQuoteID) {
            AppStorage.getData('quote_id').then((quote_id) => {
                if (!Identify.getCustomerData() && quote_id) {
                    this.setGetData({
                        'quote_id': quote_id
                    });
                }
                this.startRequest(url, obj, method, showErrorAlert, customURL);
            });
        } else {
            this.startRequest(url, obj, method, showErrorAlert, customURL);
        }
    }

    /**
     * param url - api resources/{id}/nested_resources/{nested_id}?refines
     * param obj - object that call to Api.
     **/
    startRequest(url, obj, method = 'GET', showErrorAlert = true, customURL = '') {
        let _fullUrl = customURL;
        if (!_fullUrl) {
            _fullUrl = this.config.merchant_url;
            if (this.merchantConfig !== null) {
                if (this.merchantConfig.storeview.base.base_url !== '' && this.merchantConfig.storeview.base.base_url != null) {
                    _fullUrl = this.merchantConfig.storeview.base.base_url;
                } else {
                    _fullUrl = this.config.merchant_url
                    if (parseInt(this.merchantConfig.storeview.base.use_store) === 1) {
                        _fullUrl = this.config.merchant_url + '/' + this.merchantConfig.storeview.base.store_code
                    }
                }
            }
            if (_fullUrl.lastIndexOf('/') !== _fullUrl.length - 1) {
                _fullUrl += '/'
            }

            this.dispatchAddGetParams(url);

            _fullUrl += this.config.api_path;
            this.fullUrl = _fullUrl;
            _fullUrl += url;
            if (this.customer !== null) {
                _fullUrl += '?';
                let customer = { ...this.customer };
                if (customer.hasOwnProperty('simi_hash')) {
                    delete customer['password']
                }
                for (let key in customer) {
                    _fullUrl += key + '=' + this.customer[key] + '&';
                }
                _fullUrl = _fullUrl.slice(0, -1);
                // _fullUrl += "?email=" + this.customer.email + "&password=" + this.customer.password;
                if (this._dataGet) {
                    _fullUrl += "&" + this._dataGet;
                }
            } else {
                if (this._dataGet) {
                    _fullUrl += "?" + this._dataGet;
                }
            }
        }

        let merchantConfig = this.merchantConfig;
        if (method.toUpperCase() === 'PUT') {
            if (merchantConfig !== null) {
                if (merchantConfig.storeview !== undefined && merchantConfig.storeview.base.is_support_put !== undefined
                    && parseInt(merchantConfig.storeview.base.is_support_put) === 0) {
                    method = 'POST';
                    if (this._dataGet) {
                        _fullUrl += "&is_put=1";
                    } else {
                        if (_fullUrl.includes('?'))
                            _fullUrl += "&is_put=1";
                        else
                            _fullUrl += "?is_put=1";
                    }

                }
            }
        }

        if (method.toUpperCase() === 'DELETE') {
            if (merchantConfig !== null) {
                if (merchantConfig.storeview !== undefined && merchantConfig.storeview.base.is_support_delete !== undefined
                    && parseInt(merchantConfig.storeview.base.is_support_delete) === 0) {
                    method = 'POST';
                    if (this._dataGet) {
                        _fullUrl += "&is_delete=1";
                    } else {
                        if (_fullUrl.includes('?'))
                            _fullUrl += "&is_delete=1";
                        else
                            _fullUrl += "?is_delete=1";
                    }

                }
            }
        }

        if (merchantConfig !== null) {
            if (merchantConfig.storeview !== undefined && merchantConfig.storeview.base.add_store_currency_id !== undefined
                && merchantConfig.storeview.base.add_store_currency_id === '1') {
                let addParams = "storeid=" + merchantConfig.storeview.base.store_id + '&currencyid' + merchantConfig.storeview.base.currency_code;
                if (this._dataGet) {
                    _fullUrl += "&" + addParams;
                } else {
                    if (_fullUrl.includes('?'))
                        _fullUrl += "&" + addParams;
                    else
                        _fullUrl += "?" + addParams;
                }
            }
        }

        console.log(_fullUrl);
        this._init['headers'] = this._headers;
        this._init['method'] = method;
        // this._init['credentials'] = 'same-origin';
        if (this._dataPost) {
            this._init['body'] = this._dataPost;
            console.log(JSON.stringify(this._init['body']));
        }
        if (method === 'GET') {
            this._init['body'] = null;
        }

        let _request = new Request(_fullUrl, this._init);
        fetch(_request)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                let errors = {};
                if (showErrorAlert) {
                    errors['errors'] = [
                        { message: Identify.__('Network response was not ok') }
                    ];
                }
                return errors;
                //throw new Error();
            })
            .then(function (data) {
                //console.log(data);
                //set data to obj.
                //  if (obj._mounted) {
                if (data.errors) {
                    let hasHandleMethod = false;
                    if (obj && typeof obj.handleWhenRequestFail !== "undefined") {
                        obj.handleWhenRequestFail(url);
                        hasHandleMethod = true;
                    }
                    let errors = data.errors;
                    let error = errors[0];
                    let message = error.message;
                    if (showErrorAlert) {
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
                    obj.setData(data);
                }
                // obj.setLoaded(true);
                //}
            }).catch((error) => {
                if (obj && typeof obj.handleWhenRequestFail !== "undefined") {
                    obj.handleWhenRequestFail(url);
                }
                if (showErrorAlert) {
                    Alert.alert(
                        Identify.__('Error'),
                        Identify.__('Something went wrong')
                    );
                }
                console.log(error);
            });
    }

    /**
     * param method - simicart server
     **/
    async connectSimiCartServer(method = 'GET', obj = null, forceUpdate = false) {
        let _fullUrl = this.config.simicart_url + 'bear_token/' + this.config.simicart_authorization;
        let _init = {};
        _init['method'] = method;
        //_init['credentials'] = 'omit';
        //_init['mode'] = 'cors';
        console.log(_fullUrl);
        var _request = new Request(_fullUrl, _init);
        await fetch(_request)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(Identify.__('Network response was not ok'));
            })
            .then(function (data) {
                // Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, Constants.SIMICART_CONFIG, data);
                // if (forceUpdate === true && obj !== null) {
                //     obj.forceUpdate();
                // }
                if (obj != null) {
                    obj.setData(data);
                }
            }).catch((error) => {
                AppStorage.getData('dashboard_configs').then(results => {
                    if (results && results !== undefined) {
                        let dataFromStorage = JSON.parse(results)
                        obj.saveAppConfig(dataFromStorage, false)
                    } else {
                        console.warn(error);
                    }
                })
            });
    }

    dispatchAddQuoteId(url) {
        let configEvents = require('@helper/config/events');
        let events = configEvents.default.events;
        if (configEvents && events && events.hasOwnProperty('add_quote_id')
            && events.add_quote_id.length > 0
            && (this.fullUrl.includes('simiconnector/rest/v2/quoteitems') || this.fullUrl.includes('simiconnector/rest/v2/orders/onepage'))) {
            let node = events.add_quote_id[0];
            if (node.active === true) {
                return true;
            }
        }
        return false;
    }
}


const connection = new Connection();
export default connection;
