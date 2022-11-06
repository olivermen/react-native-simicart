import { StyleSheet } from "react-native";
import { scale, verticalScale } from 'react-native-size-matters';
import material from '../../../../../native-base-theme/variables/material';

export default StyleSheet.create({
    container: {
        backgroundColor: '#00000033',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dialog: {
        width: scale(260), 
        alignItems: 'center', 
        alignSelf: 'baseline', 
        backgroundColor: 'white', 
        paddingLeft: scale(15), 
        paddingRight: scale(15), 
        paddingTop: verticalScale(15),
        marginLeft: (material.deviceWidth - scale(260)) / 2
    },
    message: {
        marginTop: verticalScale(10)
    },
    image: {
        width: scale(230),
        aspectRatio: 1,
        marginTop: verticalScale(10)
    },
    buttonContainer: {
        flexDirection: 'row', 
        marginTop: verticalScale(5)
    },
    button: {
        width: scale(115), 
        height: verticalScale(56)
    }
})
