import React from 'react';
import Device from '@helper/device';
import { Dimensions, View, BackHandler, Platform, Alert } from 'react-native';
import { StyleProvider, Container, Spinner } from 'native-base';
import { NetworkApp } from "./layout/config";
import material from '../../../../native-base-theme/variables/material';
import getTheme from '../../../../native-base-theme/components/index';
import { HeaderApp } from './layout/config';
import SimiComponent from './SimiComponent';
import Events from '@helper/config/events';
import md5 from 'md5';
import Identify from '@helper/Identify';
import SimiContext from './SimiContext';
import NavigationManager from '@helper/NavigationManager';

export default class SimiPageComponent extends SimiComponent {
    constructor(props) {
        super(props);
        this.useTabletLayout = true;
        this.useDiffLayoutForHorizontal = false;
        Dimensions.addEventListener('change', () => {
            if (Device.isTablet() && this.useDiffLayoutForHorizontal) {
                this.setState({});
            }
        });
        this.isBack = true;
        this.isRight = true;
        this.isMenu = true;
        this.title = null;
        this.isPaymentWebview = false;
        this.dataTracking = null;
        this.showSearch = true;
        this.headerProps = {};
        this.showHeader = true;
        this.loadingColor = Identify.theme && Identify.theme.loading_color ? Identify.theme.loading_color : '#ab452f';
        this.backAction = this.backAction.bind(this);
        this.state = {
            showLoading: 'none'
        };
    }
    componentDidMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackAndroid);
        }
    }
    componentWillUnmount(){
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackAndroid);
        }
    }
    handleBackAndroid = () => {
        if (this.isBack) {
            NavigationManager.backToPreviousPage(this.props.navigation);
            return true;
        } else {
            console.log('close app');
            Alert.alert(
                Identify.__('Warning'),
                Identify.__('Are you sure you want to exit app?'),
                [
                    {
                        text: Identify.__('Cancel'), onPress: () => {
                            style: 'cancel'
                        }
                    },
                    {
                        text: Identify.__('OK'), onPress: () => {
                            BackHandler.exitApp()
                        }
                    },
                ],
                { cancelable: true }
            )
            return true
        }
    }

    handleWhenRequestFail() {
        if (typeof this.props.storeData !== "undefined") {
            this.props.storeData('showLoading', { type: 'none' });
        }
        if (this.state.showLoading != 'none') {
            this.setState({ showLoading: 'none' });
        }
    }
    isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };

    renderPhoneLayout() {
        return null;
    }

    renderTabletLayout() {
        return this.renderPhoneLayout();
    }

    renderTabletHorizontalLayout() {
        return null;
    }

    createLayout() {
        // let phoneLayout = this.renderPhoneLayout();
        // let tabletLayout = this.renderTabletLayout();
        if (!this.isPortrait() && this.useDiffLayoutForHorizontal && this.useTabletLayout) {
            return this.renderTabletHorizontalLayout();
        }
        if (Device.isTablet() && this.useTabletLayout) {
            return this.renderTabletLayout();
        } else {
            return this.renderPhoneLayout();
        }
    }

    dispatchEventPage() {
        let items = [];
        for (let i = 0; i < Events.events.init_page.length; i++) {
            let node = Events.events.init_page[i];
            if (node.active === true) {
                let key = md5("init_page" + i);
                let Content = node.content;
                items.push(<Content key={key} navigation={this.props.navigation} parent={this} />);
            }
        }
        return items;
    }

    loadExistData(data) {
        return true;
    }

    checkExistData(data, key) {
        if (data) {
            if (key) {
                if (data.hasOwnProperty(key)) {
                    let item = data[key];
                    return this.loadExistData(item);
                }
                return false;
            } else {
                return this.loadExistData(data);
            }
        }
        return false;
    }

    showLoading(show = 'none', shouldCallSetState = true) {
        if (shouldCallSetState) {
            this.setState({ showLoading: show });
        } else {
            this.state.showLoading = show;
        }
    }

    backAction() {
        return false;
    }

    render() {
        return (
            <SimiContext.Provider value={{ parent: this, ...this.addContextToConsumer() }}>
                <StyleProvider style={getTheme(material)}>
                    <Container>
                        <NetworkApp />
                        {this.showHeader && <HeaderApp
                            obj={this}
                            navigation={this.props.navigation}
                            back={this.isBack}
                            showSearch={this.showSearch}
                            show_right={this.isRight}
                            title={this.title}
                            show_menu={this.isMenu}
                            backAction={this.backAction}
                            {...this.headerProps} />}
                        {this.dispatchEventPage()}
                        <View style={{ flex: 1, backgroundColor: material.appBackground, paddingTop: this.showHeader ? 0 : 24 }}>
                            {this.createLayout()}
                            {this.state.showLoading != 'none' &&
                                <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: this.state.showLoading == 'full' ? 'white' : '#00000033', alignItems: 'center', justifyContent: 'center' }}>
                                    <Spinner color={this.loadingColor} />
                                </View>}
                        </View>
                        {this.dispatchPlugin('footer_app')}
                    </Container>
                </StyleProvider>
            </SimiContext.Provider>
        );
    }

    dispatchPlugin(keyPlugin) {
        let plugins = [];
        for (let i = 0; i < Events.events[keyPlugin].length; i++) {
            let node = Events.events[keyPlugin][i];
            if (node.active === true) {
                let key = md5(keyPlugin + i);
                let Content = node.content;
                plugins.push(<Content key={key}
                    obj={this} navigation={this.props.navigation} />);
            }
        }
        return plugins;
    }

    dispatchCheckRootPages(routeName) {
        for (let i = 0; i < Events.events.root_pages.length; i++) {
            let rootPage = Events.events.root_pages[i];
            if (rootPage == routeName) {
                return true;
            }
        }
        return false;
    }

}
