import { StyleSheet } from "react-native"
import material from "../../../../../../native-base-theme/variables/material";

export default StyleSheet.create({
  addToCart: {
    position: 'absolute',
    bottom: material.isIphoneX ? 15 : 0,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10
  }
})
