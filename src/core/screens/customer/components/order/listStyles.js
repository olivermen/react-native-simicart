import { StyleSheet } from "react-native";
import material from '../../../../../../native-base-theme/variables/material';

export default StyleSheet.create({
    verticalList: {
        marginLeft: 10,
        marginRight: 10
    },
    image: {
        flex: 1,
        aspectRatio: 1
    },
    title: {
        fontFamily: material.fontBold,
        marginRight: 15
    },
    bottom: {
        backgroundColor: '#E6f2f2f2',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    }
})
