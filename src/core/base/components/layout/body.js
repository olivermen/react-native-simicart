import React from 'react';
import { Content, Text} from 'native-base';

class Body extends React.Component {
  constructor(props, context) {
     super(props);
  }
  render(){
    return (
      <Content>
        {this.props.children}        
      </Content>
    );
  }
}

export default Body;
