import React, { Component } from "react";
import { I18nManager, Platform, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
// import CardStackStyleInterpolator from 'react-navigation';
// import { fromLeft } from 'react-navigation-transitions';
import Splash from '../src/customize/splash/pages/index'
import Maintain from '../src/core/screens/splash/pages/maintain'
import Category from '../src/core/screens/catalog/pages/categories/catagories'
import Home from '../src/customize/home/pages'
import Products from '../src/customize/catalog/pages/products/products'
import Settings from '../src/core/screens/settings/pages/settings'
import Sort from '../src/core/screens/catalog/pages/products/sort'
import Filter from '../src/core/screens/catalog/pages/products/filter'
import FilterSelection from '../src/core/screens/catalog/pages/products/selection'
import Drawer from '../src/customize/drawer'
import Login from '../src/core/screens/customer/pages/login'
import ProductDetail from '../src/customize/catalog/pages/product/product'
import Cart from '../src/customize/checkout/pages/cart'
import Checkout from '../src/customize/checkout/pages/checkout'
import Thankyou from '../src/core/screens/checkout/pages/thankyou'
import NewAddress from '../src/core/screens/customer/pages/address'
import OrderHistory from '../src/core/screens/customer/pages/orders'
import OrderHistoryDetail from '../src/customize/customer/pages/order'
import MyAccount from '../src/customize/customer/pages/myaccount'
import Profile from '../src/customize/customer/pages/profile'
import Newsletter from '../src/customize/customer/pages/newsletter'
import AddressBook from '../src/customize/customer/pages/addressbook'
import WebViewPage from '../src/customize/webview'
import TechSpecs from '../src/core/screens/catalog/pages/product/techspecs'
import FullImage from '../src/core/screens/catalog/pages/product/fullimage'
import SearchProducts from '../src/customize/catalog/pages/search'
import Customer from '../src/core/screens/customer/pages/customer'
import NotificationHistory from '../src/core/screens/notification/pages'
import ForgotPassword from '../src/core/screens/customer/pages/forgotPassword'
import CreditCard from '../src/core/screens/checkout/pages/creditcard'
import WebAppPage from '../src/core/screens/webview/WebApp'
import CheckoutWebView from '../src/core/screens/checkout/pages/webview'
import CustomPayment from '../src/plugins/custompayments/page'
import BrandPage from '../src/customize/brand/pages'
import MenuPage from '../src/customize/catalog/pages/menu'
import More from '../src/customize/footer/menu'
import RootCategory from '../src/customize/catalog/pages/rootcate'

import ReviewDetail from '../src/plugins/review/reviewDetail';
import ReviewPage from '../src/plugins/review/reviewPage';
import AddReview from '../src/plugins/review/addreview/addReview';
import Wishlist from '../src/plugins/wishlist';

import MyReviews from '../src/customize/customer/pages/myreviews';
import MyGiftcard from '../src/customize/customer/pages/mygiftcard';
import GiftcardDetail from '../src/customize/customer/pages/giftcarddetail';
import ReviewDetails from '../src/customize/catalog/pages/product/productreview';
import Store from '../src/customize/customer/pages/store';
import Service from '../src/customize/customer/pages/service';

const Stack = createStackNavigator(
    {
        Splash: Splash,
        Maintain: Maintain,
        Category: Category,
        Home: Home,
        Products: Products,
        Settings: Settings,
        Sort: Sort,
        Filter: Filter,
        FilterSelection: FilterSelection,
        Drawer: Drawer,
        Login: Login,
        ProductDetail: ProductDetail,
        Cart: Cart,
        Checkout: Checkout,
        Thankyou: Thankyou,
        NewAddress: NewAddress,
        OrderHistory: OrderHistory,
        OrderHistoryDetail: OrderHistoryDetail,
        MyAccount: MyAccount,
        Profile: Profile,
        Newsletter: Newsletter,
        AddressBook: AddressBook,
        WebViewPage: WebViewPage,
        TechSpecs: TechSpecs,
        FullImage: FullImage,
        SearchProducts: SearchProducts,
        Customer: Customer,
        NotificationHistory: NotificationHistory,
        ForgotPassword: ForgotPassword,
        CreditCard: CreditCard,
        WebAppPage: WebAppPage,
        CheckoutWebView: CheckoutWebView,
        CustomPayment: CustomPayment,
        BrandPage: BrandPage,
        MenuPage: MenuPage,
        More: More,
        Wishlist: { screen: Wishlist },
        ReviewDetail: { screen: ReviewDetail },
        ReviewPage: { screen: ReviewPage },
        AddReview: { screen: AddReview },
        RootCategory: { screen: RootCategory },
        MyReviews: { screen: MyReviews },
        MyGiftcard: { screen: MyGiftcard },
        GiftcardDetail: { screen: GiftcardDetail },
        ReviewDetails: { screen: ReviewDetails },
        Store: { screen: Store },
        Service: { screen: Service }
    },
    {
        headerMode: 'none',
        // transitionConfig: (nav) => handleCustomTransition(nav)
    }
);

Stack.navigationOptions = ({ navigation }) => {
    let drawerLockMode = 'unlocked';
    let screenWantDisable = ['Maintain', 'WebAppPage']; //screen want to disable drawer
    //app Astir remove comment and comment above.
    // let screenWantDisable = ['Maintain', 'WebAppPage' , 'PromotionPage']; 
    let route = navigation.state.routes;
    screenWantDisable.forEach(screen => {
        route.forEach(routeName => {
            if (routeName.routeName === screen) {
                drawerLockMode = 'locked-closed';
            }
        })
    })

    return {
        drawerLockMode,
    };
};

//app Astir remove comment.
// const handleCustomTransition = ({ scenes }) => {
//     const nextScene = scenes[scenes.length - 1];
//     if (nextScene.route.routeName == 'ProductDetail' && nextScene.route.params.swipe && nextScene.route.params.swipe == 'right') {
//         return fromLeft(500);
//     }
//     return null;
// }

// app Nejree remove comment. disable menu left all app
Stack.navigationOptions = ({ navigation }) => {
    drawerLockMode = 'locked-closed';

    return {
        drawerLockMode,
    };
};

const Router = createDrawerNavigator(
    {
        Splash: { screen: Splash },
        Stack: { screen: Stack }
    },
    {
        contentComponent: props => <Drawer {...props} />,
        initialRouteName: 'Splash',
        drawerPosition: I18nManager.isRTL ? 'right' : 'left',
        drawerWidth: Dimensions.get('screen').width * 3 / 5 > 280 ? 280 : Dimensions.get('screen').width * 2 / 3
        // For Het Gareel
        // drawerPosition: 'right'
    }
);

const App = createAppContainer(Router);

export default App;
