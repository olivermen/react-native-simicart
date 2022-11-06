import { StyleSheet } from "react-native";
import { scale, verticalScale } from 'react-native-size-matters';

export default StyleSheet.create({
    cateName: {
        width: '100%',
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        marginLeft: 15,
        textAlign: 'left'
    },
    cateNameWithViewAll: {
        width: '75%',
        textAlign: 'left'
    },
    viewAll: {
        width: '25%',
        textDecorationLine: 'underline',
        textAlign: 'right'
    },
    top: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        marginTop: verticalScale(10),
        marginRight: scale(10),
        marginBottom: verticalScale(10),
        marginLeft: scale(15),
        flexWrap: 'wrap'
    },
})
