import { StyleSheet } from "react-native"
import variable from "../../../../../../native-base-theme/variables/material";

export default StyleSheet.create({
  container: {
    width: '100%',
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    marginBottom: 5,
     backgroundColor:'transparent',
     position: 'absolute'
  },
  search: {
    backgroundColor: variable.getsearchbackgroundcColor,
    borderRadius: 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  center: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    marginLeft: 10,
    color: variable.searchtextColor
  },
  icon: {
    fontSize: 20,
    color: variable.searchtextColor
  }
})
