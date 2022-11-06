import { StyleSheet } from "react-native";
import { scale } from 'react-native-size-matters';
import material from '@theme/variables/material';

export default StyleSheet.create({
    title: {
        margin: scale(15),
        width: '70%'
    },
    list: {
        marginLeft: scale(15),
    },
    listItem: {
        width: scale(140),
        paddingRight: 10
    },
    imageListItem: {
        flex: 1,
        aspectRatio: 1
    },
    textListItem: {
        textAlign: 'center'
    },
    content: {
        padding: 8,
        fontSize: material.textSizeBigger
    },

})
