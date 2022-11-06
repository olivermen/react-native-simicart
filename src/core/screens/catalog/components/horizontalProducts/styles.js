import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import material from '@theme/variables/material';

export default StyleSheet.create({
    list: {
        marginLeft: scale(15),
    },
    listItem: {
        width: scale(130),
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginRight: verticalScale(10),
        flex: 1,
    },
    imageListItem: {
        width: scale(130),
        aspectRatio: 1,
        overflow: 'hidden'
    },
    outOfStock: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'red',
        color: 'white',
        padding: 5,
        fontWeight: "bold"
    },
    textPriceListProductItem: {
        color: 'red'
    },
    priceListItem: {
        height: verticalScale(20)
    },
    card: {
        flex: 1,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    title: {
        marginBottom: 5,
    }
})
