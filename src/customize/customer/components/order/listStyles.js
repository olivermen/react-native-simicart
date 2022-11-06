import { StyleSheet } from "react-native";
import material from '../../../../../native-base-theme/variables/material';

export default StyleSheet.create({
    view: {
        paddingHorizontal: 12
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
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderRadius: 5,
        borderColor: '#C5CBD5',
        borderWidth: 1,
        height: 50,
        width: '100%'
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        paddingTop: 30,
        paddingBottom: 25,
        textAlign: 'left'
    },
    // Order Item
    card: {
        backgroundColor: '#FAFAFA',
        borderRadius: 16,
        width: '100%',
        borderWidth: 1,
        borderColor: '#D8D8D8',
        padding: 20,
        marginBottom: 15
    },
    row1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 8
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 10,
        backgroundColor: '#E4531A',
        marginRight: 8
    },
    txtOrderNum: {
        fontSize: 18,
        color: '#000',
        fontWeight: '500'
    },
    btnViewOrder: {
        height: 45,
        borderWidth: 1,
        borderColor: '#E4531A',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    txtViewOrder: {
        color: '#E4531A',
        fontWeight: '500'
    },
    flex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
