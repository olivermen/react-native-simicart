import React from 'react';
import {View, Text} from 'native-base';
import NetInfo from "@react-native-community/netinfo";
import {styles} from './style';

class NetWorkStt extends React.Component {
  constructor(props){
    super(props);
    this.state = {isConnected: true, view: 0};
    setInterval(() => {
      if(this.state.view == 2){
        this.setState({view: 0});
      }
    }, 2000);
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    if(!isConnected){
      this.setState({ isConnected: isConnected, view: 1});
    }else if(this.state.view != 0){
      this.setState({ isConnected: isConnected, view: 2});
    }else{
      this.setState({ isConnected: isConnected });
    }
  };

  render(){

    if (!this.state.isConnected) {
      return (
        <View style={styles.offlineContainer}><Text style={styles.offlineText}>No connection</Text></View>
      );
    }
    else if(this.state.view == 2){
      return (
        <View style={styles.onlineContainer}><Text style={styles.offlineText}>You are online</Text></View>
      );
    }
    return null;
  }
}


export default NetWorkStt;
