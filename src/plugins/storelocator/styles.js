import { scale } from 'react-native-size-matters'
import { StyleSheet, Dimensions } from 'react-native';

export default {
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: scale(10)
    },
    content: { 
        padding: scale(15), 
        paddingTop: 0 
    },
    marginItem: { 
        marginRight: scale(10) 
    },
    container: {
        // height: scale(200),
        // width: Dimensions.get('window').width,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    map: {
        height: scale(200),
        width: Dimensions.get('window').width,
    },
    containerlist: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    maplist: {
        ...StyleSheet.absoluteFillObject,
        //width: Dimensions.get('window').width,
    },
}
