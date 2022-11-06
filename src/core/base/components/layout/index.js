import React from 'react';
import { Container } from 'native-base';
import Header from './header';
import Body from './body';
import Footer from './footer';

class Default extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render(){
    return (
       <Container>
          <Header/>
          <Body children={this.props.children}/>
          <Footer/>
       </Container>
    );
  }

}

export default Default;
