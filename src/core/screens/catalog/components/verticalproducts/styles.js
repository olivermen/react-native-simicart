import { StyleSheet } from "react-native";
import material from '../../../../../../native-base-theme/variables/material';
import { scale, verticalScale } from 'react-native-size-matters';

export default StyleSheet.create({
    verticalList: {
        marginLeft: 5,
        marginRight: 5
    },
    image: {
        flex: 1,
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
    name: {
        fontFamily: material.fontBold
    },
    bottom: {
        backgroundColor: '#E6f2f2f2',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: verticalScale(40),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: scale(10),
        paddingRight: scale(10)
    },
    icon: {
        fontSize: 22,
        padding: 5
    }
})
