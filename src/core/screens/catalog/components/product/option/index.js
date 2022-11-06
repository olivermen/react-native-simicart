import React from 'react';
import { View } from 'react-native';
import { Card } from 'native-base';
import Downloadable from './downloadable/index';
import Configurable from './configurable/index';
import CustomOptions from './custom/index';
import Bundle from './bundle/index';
import Grouped from './group/index';
import Identify from "@helper/Identify";

class Option extends React.Component {
  constructor(props) {
    super(props);
    this.parent = this.props.parent
  }

  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  renderBundleOption() {
    return (
      <Bundle key={Identify.makeid()}
        app_options={this.app_options}
        parent={this.props.parent}
        productType={this.product_type}
        product_id={this.product.entity_id}
        prices={this.product.app_prices}
        onRef={ref => (this.option = ref)} />
    );
  }

  renderConfigurableOption() {
    return (
      <View>
        <Configurable key={Identify.makeid()}
          app_options={this.app_options}
          parent={this.props.parent}
          current_parent={this}
          productType={this.product_type}
          product_id={this.product.entity_id}
          prices={this.product.app_prices}
          onRef={ref => (this.option_configurable = ref)} />
        <CustomOptions key={Identify.makeid()}
          app_options={this.app_options}
          current_parent={this}
          parent={this.props.parent}
          productType={this.product_type}
          product_id={this.product.entity_id}
          prices={this.product.app_prices}
          onRef={ref => (this.option_custom = ref)} />
      </View>
    );
  }

  renderGroupedOption() {
    return (
      <Grouped key={Identify.makeid()}
        app_options={this.app_options}
        parent={this.props.parent}
        productType={this.product_type}
        product_id={this.product.entity_id}
        prices={this.product.app_prices}
        onRef={ref => (this.option = ref)} />
    );
  }

  renderDownloadableOption() {
    return (
      <Downloadable key={Identify.makeid()}
        app_options={this.app_options}
        parent={this.props.parent}
        productType={this.product_type}
        product_id={this.product.entity_id}
        prices={this.product.app_prices}
        onRef={ref => (this.option = ref)} />
    );
  }

  renderCustomOption() {
    return (
      <CustomOptions key={Identify.makeid()}
        app_options={this.app_options}
        parent={this.props.parent}
        productType={this.product_type}
        product_id={this.product.entity_id}
        prices={this.product.app_prices}
        onRef={ref => (this.option = ref)} />
    );
  }

  render() {
    if (this.parent.state.reRender) {
      this.product = this.props.product;
      this.app_options = this.product.app_options;
      this.product_type = this.product.type_id;
      if (!this.app_options) {
        return null;
      }
      let option = <View />
      switch (this.product_type) {
        case 'bundle':
          option = this.renderBundleOption();
          break;
        case 'configurable':
          option = this.renderConfigurableOption();
          break;
        case 'grouped':
          option = this.renderGroupedOption();
          break;
        case 'downloadable':
          option = this.renderDownloadableOption();
          break;
        default:
          if (this.app_options.hasOwnProperty('custom_options') && this.app_options.custom_options.length > 0) {
            option = this.renderCustomOption();
          } else {
            return option;
          }
          break;
      }

      if (this.props.showCard) {
        return (
          <Card style={this.props.cardStyles}>
            {option}
          </Card>
        );
      } else {
        return (
          <View style={this.props.cardStyles}>
            {option}
          </View>
        );
      }
    }
    return null;
  }

  getParams() {
    let params = false;
    if (this.product_type == 'configurable') {
      params = this.option_configurable.getParams();
      if (params == false) return null;
      if (this.app_options.custom_options) {
        let custom_options = this.option_custom.getParams();
        if (custom_options == false) return null;
        params['options'] = custom_options.options;
      }
      return params;
    } else {
      if (this.option == null) {
        return null;
      } else {
        params = this.option.getParams();
        if (params != false) {
          return params;
        } else {
          return null;
        }
      }
    }
  }

}

Option.defaultProps = {
  showCard: true,
  cardStyles: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 0,
    paddingBottom: 10
  }
}

export default Option;
