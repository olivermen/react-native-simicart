import React from 'react';
import { Footer } from 'native-base';

class FooterApp extends React.Component {
  render(){
    return (
      <Footer>
          {this.props.layout}
        </Footer>
    );
  }
}

export default FooterApp;
