import React from 'react';
import Device from '../../helper/device';
import { Dimensions, View } from 'react-native';
import md5 from 'md5';
import Layout from '@helper/config/layout';
import SimiContext from './SimiContext'
export default class SimiComponent extends React.Component {

    constructor(props) {
        super(props);
        this.useTabletLayout = true;
        this.useDiffLayoutForHorizontal = false;
        Dimensions.addEventListener('change', () => {
            if (Device.isTablet() && this.useDiffLayoutForHorizontal) {
                this.setState({});
            }
        });
        this.contextData = undefined;
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

    createLayout(contextData) {
        this.contextData = contextData;
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

    shouldRenderLayoutFromConfig() {
        return true;
    }

    shouldShowComponent(element) {
        return true;
    }

    addMorePropsToComponent(element) {
        return {};
    }

    addContextToConsumer(){
        return {};
    };

    renderLayoutFromConfig(layoutKey, containerKey) {
        let components = [];
        if (this.shouldRenderLayoutFromConfig()) {
            let containers = Layout.layout[layoutKey][containerKey];
            for (let i = 0; i < containers.length; i++) {
                let element = containers[i];
                if (element.active == true && this.shouldShowComponent(element)) {
                    let key = md5(layoutKey + i);
                    let Content = element.content;
                    components.push(<Content
                        parent={this}
                        navigation={this.props.navigation}
                        key={key}
                        {...element.data}
                        {...this.addMorePropsToComponent(element)}
                    />);
                }
            };
        }
        return components;
    }

    render() {
        return (
            <SimiContext.Consumer>
                {(contextData) => (
                    <View style={{ flex: 1 }}>
                        {this.createLayout(contextData)}
                    </View>
                )}
            </SimiContext.Consumer>
        );
    }

}
