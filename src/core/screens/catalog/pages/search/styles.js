import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 5
  },
  search: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginLeft: 5,
    marginRight: 5
  },
  inputContainer: {
  	flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  clearIcon: {
    marginLeft: 5,
    fontSize: 21,
    marginRight: 5,
    paddingLeft: 10
  }
})
