import React from 'react';
import Abstract from "./Abstract";
import Checkbox from './checkbox';
import { View, Text } from 'native-base';

class MultiCheckbox extends Abstract {

  constructor(props){
      super(props);
      this.checkboxes = {};
  }

  getValues() {
    let values = '';
    for(let i in this.checkboxes) {
      let checkbox = this.checkboxes[i];
      let value = checkbox.getValues();
      if(value != '') {
        values = values + value + ',';
      }
    }
    if(values.slice(-1) == ',') {
      values = values.slice(0, -1);
    }
    return values;
  }

  renderForBundle =()=>{
      let options = this.props.selections;
      let values = this.props.values;
      let objs = [];
      for (let i in options) {
          let item = options[i];
          let selected = false;
          if (values && values.indexOf(i.toString()) >= 0) {
              selected = true;
          }
          let price = 0;
          if (item.price) {
              price = item.price;
          }
          if (item.priceInclTax) {
              price = item.priceInclTax;
          }

          // if (Identify.magentoPlatform() === 2) {
          //     price = item.prices.finalPrice.amount;
          // }
          let app_tier_prices = null;
          if (item.app_tier_prices && item.app_tier_prices.length > 0){
            app_tier_prices = item.app_tier_prices[0];
          }
          let label  = this.parent.renderLabelOption(item.name, price, item.qty, app_tier_prices);
          let element = (<Checkbox key={i}
                                  label={label}
                                  selected={selected}
                                  value={i}
                                  parent={this.parent}
                                  onRef={ref => (this.checkboxes[i] = ref)}/>);

          objs.push(element);
      }
      return objs;
  };

  renderForCustom = () => {
      let values = this.props.values;
      let objs = [];
      for (let i in values) {
          let item = values[i];
          let prices = 0;
          if (this.props.showType === 1) {
              if (item.price) {
                  prices = item.price;
              } else if (item.price_including_tax) {
                  prices = item.price_including_tax.price;
              }
          }
          let symbol = prices > 0 ? <Text style={{marginLeft: 5}}>+</Text> : null;
          prices = prices > 0 ? this.props.parent.renderOptionPrice(prices) : null;
          let label  = <View style={{flexDirection: 'row', marginLeft: 10}}>
              <Text>{item.title}</Text>
              {symbol}
              {prices}
          </View>;
          let element = (<Checkbox key={item.id}
                                  label={label}
                                  value={item.id}
                                  parent={this.parent}
                                  onRef={ref => (this.checkboxes[item.id] = ref)}/>)

          objs.push(element);
      }
      return objs;
  };

  render() {
    let {data} = this.props;
    let type_id = this.props.parent.getProductType();
    return(
      <View>
        {(type_id === 'bundle') ? this.renderForBundle() : this.renderForCustom()}
      </View>
    );
  }
}

export default MultiCheckbox;
