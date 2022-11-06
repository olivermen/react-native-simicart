import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';


export const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    zIndex: 9999,
    flex: 1,
    width: Dimensions.get('window').width,
  },
  onlineContainer:{
    backgroundColor: '#4caf50',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    zIndex: 9999,
    flex: 1,
    width: Dimensions.get('window').width,
  },
  offlineText: {
    color: '#fff',
    fontSize: 10,
  }
});
