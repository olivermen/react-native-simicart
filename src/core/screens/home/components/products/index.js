import React from 'react';
import { connect } from 'react-redux';
import Item from './item';
import { Spinner } from 'native-base';
import { View } from 'react-native';
import Identify from '@helper/Identify';
import { home_spot_products } from '@helper/constants';
import NewConnection from '@base/network/NewConnection';
import Device from '@helper/device';

class Products extends React.Component {

    constructor(props) {
        super(props);
        this.homeproductlists = this.props.data;
    }

    renderHomeProductsList() {
        let row = [];
        this.homeproductlists.sort(function (a, b) {
            return parseInt(a.sort_order) - parseInt(b.sort_order);
        });
        this.homeproductlists.forEach(element => {
            row.push(
                <Item
                    productlist_id={element.productlist_id}
                    key={Identify.makeid()}
                    title={element.list_title}
                    item={element}
                    navigation={this.props.navigation} />)
        });
        return row;
    }

    render() {
        return (
            <View>
                {this.renderHomeProductsList()}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.home_data.home.homeproductlists.homeproductlists };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);