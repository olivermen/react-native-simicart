import React from 'react';
import {connect} from 'react-redux';
import { View, Text } from 'native-base';
import Identify from '../../../helper/Identify';

class Language extends React.Component {
  constructor(props) {
    super(props);
    this.simicart_config = Identify.isEmpty(this.props.data.dashboard_configs) ? null : this.props.data.dashboard_configs;
    this.merchant_configs = Identify.isEmpty(this.props.data.merchant_configs) ? null : this.props.data.merchant_configs;
    this.text = this.props.text;
    this.style = this.props.style ?  this.props.style : {};
  }
  render(){
    let config = null;
    if (this.simicart_config !== null) {
        config = this.simicart_config['app-configs'][0] || null;
    }
    if ((config !== null && config.language) && (this.merchant_configs && this.merchant_configs.storeview.hasOwnProperty('base')
            && this.merchant_configs.storeview.base.hasOwnProperty('locale_identifier'))) {
        let languageCode = this.merchant_configs.storeview.base.locale_identifier;
        if (config.language.hasOwnProperty(languageCode)) {
            let language = config.language;
            let laguageWithCode = language[languageCode];
            if (laguageWithCode && laguageWithCode.hasOwnProperty(this.text)) {
                return (
                  <Text style={this.style}>{laguageWithCode[this.text].toUpperCase()}</Text>
                )
            }
        }
    }
    return (
      <Text style={this.style}>{this.text}</Text>
    );
  }
}
const mapStateToProps = (state) => {
    return {data: state.redux_data};
}
export default connect(mapStateToProps)(Language);
