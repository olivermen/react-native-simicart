import React from 'react';
import { View } from 'native-base';
import ItemBottomMenu from './ItemBottomMenu';
import Identify from '@helper/Identify';
import { connect } from 'react-redux';
import { Platform, Dimensions } from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const isIphoneX = platform === "ios" && (deviceHeight === 812 || deviceWidth === 812);
const hideBottom = [
    'CustomPayment',
    'Checkout',
    'ProductDetail'
];

class BottomMenu extends React.Component {

    initData() {
        let listItemBottoms = [];

        //add home
        listItemBottoms.push({
            active: true,
            key: 'home_bottom',
            route_name: "Home",
            image: require('./icon/icon-home.png')
        });

        //add categories
        listItemBottoms.push({
            active: true,
            key: 'search_bottom',
            route_name: "Search",
            image: require('./icon/icon-search.png')
        });

        //add categories
        listItemBottoms.push({
            active: true,
            key: 'deals_bottom',
            route_name: "Deals",
            image: require('./icon/icon-Deals.png')
        });

        //add cart
        listItemBottoms.push({
            active: true,
            key: 'cart_bottom',
            route_name: "Cart",
            image: require('./icon/icon-cart.png')

        });

        //add myaccount
        listItemBottoms.push({
            active: true,
            key: 'more_bottom',
            route_name: "More",
            image: require('./icon/icon-More.png')

        });

        return listItemBottoms;
    }

    setCurrentScreen(currentScreen) {
        if (this.props.redux_data.current_screen) {
            if (this.props.redux_data.current_screen != currentScreen) {
                this.props.storeData("current_screen", currentScreen);
            }
        } else {
            this.props.storeData("current_screen", currentScreen);
        }
    }

    renderView() {
        let routeName = this.props.navigation.state.routeName;
        // switch (routeName) {
        //     case 'Home':
        //         this.setCurrentScreen('Home')
        //         break;
        //     case 'RootCategory':
        //         this.setCurrentScreen('RootCategory')
        //         break;
        //     case 'Brand':
        //         this.setCurrentScreen('Brand')
        //         break;
        //     case 'Cart':
        //         this.setCurrentScreen('Cart')
        //         break;
        //     case 'MyAccount':
        //         this.setCurrentScreen('MyAccount')
        //         break;
        //     case 'Login':
        //         this.setCurrentScreen('MyAccount')
        //         break;
        //     default:
        // }

        let items = this.initData();
        let renderItems = [];
        items.map((item, index) => {
            renderItems.push(
                <ItemBottomMenu key={index}
                    data={item}
                    navigation={this.props.navigation}
                    current_screen={routeName}
                    quoteitems={this.props.quoteitems}
                    customer_data={this.props.customer_data}
                />
            )
        })
        return renderItems;
    }

    render() {
        if (hideBottom.indexOf(this.props.navigation.state.routeName) > -1) {
            return null;
        }
        return (
            <View style={{
                width: '100%',
                zIndex: 9999,
                elevation: 9999
                // overflow: 'hidden',
            }}>
                <View style={{ 
                    flexDirection: 'row', 
                    backgroundColor: 'white', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    paddingBottom: isIphoneX ? 10 : 0,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.4,
                    shadowRadius: 3,
                    elevation: 5, }}>
                    {this.renderView()}
                </View>
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
}

const mapStateToProps = (state) => {
    return {
        customer_data: state.redux_data.customer_data,
        redux_data: state.redux_data,
        quoteitems: state.redux_data.quoteitems
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BottomMenu);