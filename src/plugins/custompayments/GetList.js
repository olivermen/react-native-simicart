import React from 'react';
import { connect } from 'react-redux';
import NewConnection from '@base/network/NewConnection';
import { customizepayments } from '@helper/constants';
import Identify from '@helper/Identify';

class CustomPayment extends React.Component {
    componentDidMount() {
        if (Identify.isEmpty(this.props.data.customPayment)) {
            new NewConnection()
                .init(customizepayments, 'get_customize_payments', this)
                .setShowErrorAlert(false)
                .connect();
        }
    }
    setData(data) {
        this.props.storeData(data.customizepayments);
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
            dispatch({ type: 'customPayment', data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomPayment);