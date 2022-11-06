import React from 'react';
import { connect } from 'react-redux';
import NewConnection from '@base/network/NewConnection';
import Identify from '@helper/Identify';
import Layout from '@helper/config/layout';
import Events from '@helper/config/events';
import AppStorage from "@helper/storage";
import simicart from '@helper/simicart';

class Dashboard extends React.Component {

    componentDidMount() {
        new NewConnection()
            .init(simicart.simicart_url + 'bear_token/' + simicart.simicart_authorization, 'get_dashboard_config', this)
            .setCustomURL(true)
            .setShowErrorAlert(false)
            .connect();
    }

    setData(data, requestID) {
        this.saveAppConfig(data)
    }

    handleWhenRequestFail(requestID) {
        AppStorage.getData('dashboard_configs').then(results => {
            if (results && results !== undefined) {
                let dataFromStorage = JSON.parse(results)
                this.saveAppConfig(dataFromStorage, false)
            }
        })
    }

    saveAppConfig(data, shouldSaveToStorage = true) {
        Identify.setAppConfig(data['app-configs'][0]);

        Layout.plugins = data['app-configs'][0]['site_plugins'] || [];
        Layout.initAppLayout();

        Events.plugins = data['app-configs'][0]['site_plugins'] || [];
        Events.initAppEvents();

        this.props.storeData(data);

        if (shouldSaveToStorage) {
            AppStorage.saveData('dashboard_configs', JSON.stringify(data))
        }
    }

    render() {
        return (null);
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (data) => {
            dispatch({ type: 'dashboard_configs', data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
