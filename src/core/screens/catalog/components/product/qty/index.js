import React from 'react';
import { Item, Input } from 'native-base';
import styles from './styles';

class Quantity extends React.Component {

  constructor(props) {
    super(props);
    this.checkoutQty = '1';
  }

  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  getCheckoutQty() {
    return this.checkoutQty;
  }

  render() {
    return (
      <Item regular style={styles.container}>
        <Input
          style={styles.input}
          keyboardType="numeric"
          returnKeyType="done"
          onChangeText={(txt) => {
            this.checkoutQty = txt
          }}>1</Input>
      </Item>
    );
  }

}

export default Quantity;
