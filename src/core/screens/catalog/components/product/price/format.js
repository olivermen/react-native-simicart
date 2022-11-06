import React from 'react';
import {connect} from 'react-redux';
import { View, Text} from 'native-base';
import Identify from '../../../../../helper/Identify';

class Format extends React.Component {
  constructor(props) {
    super(props);
    this.merchant_configs = Identify.isEmpty(this.props.data.merchant_configs) ? null : this.props.data.merchant_configs;
  }

  putThousandsSeparators(value, sep, decimal, max_number_of_decimals) {
      if (!max_number_of_decimals) {
          max_number_of_decimals = this.merchant_configs.storeview.base.max_number_of_decimals || 2;
      }

      if (sep == null) {
          sep = ',';
      }
      if (decimal == null) {
          decimal = '.';
      }

      value = value.toFixed(max_number_of_decimals);
      // check if it needs formatting
      if (value.toString() === value.toLocaleString()) {
          // split decimals
          var parts = value.toString().split(decimal)
          // format whole numbers
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
          // put them back together
          value = parts[1] ? parts.join(decimal) : parts[0];
      } else {
          value = value.toLocaleString();
      }
      return value;
  }

  render(){
    this.initValues();
    let price_convert = this.price;
    if (this.merchant_configs) {
     let currency_symbol = this.merchant_configs.storeview.base.currency_symbol || this.merchant_configs.storeview.base.currency_code;
     if(this.currency_symbol) currency_symbol = this.currency_symbol;
     let currency_position = this.merchant_configs.storeview.base.currency_position;
     let decimal_separator = this.merchant_configs.storeview.base.decimal_separator;
     let thousand_separator = this.merchant_configs.storeview.base.thousand_separator;
     let max_number_of_decimals = this.merchant_configs.storeview.base.max_number_of_decimals;
     if (this.type === 1) {
       price_convert = this.putThousandsSeparators(this.price, thousand_separator, decimal_separator, max_number_of_decimals);
     }else{
       if (currency_position == "before") {
          price_convert = currency_symbol + this.putThousandsSeparators(this.price, thousand_separator, decimal_separator, max_number_of_decimals);
       }else {
          price_convert = this.putThousandsSeparators(this.price, thousand_separator, decimal_separator, max_number_of_decimals) + currency_symbol;
       }
     }

    }
    return (
      <Text style={this.style}>{price_convert}</Text>
    );
  }

  initValues() {
    this.price = this.props.price ? parseFloat(this.props.price) : 0;
    this.type = this.props.type ? this.props.type : 0;
    this.style = this.props.style ?  this.props.style : {};
    this.currency_symbol = this.props.currency_symbol ?  this.props.currency_symbol : null;
  }
}
const mapStateToProps = (state) => {
    return {data: state.redux_data};
}
export default connect(mapStateToProps)(Format);
