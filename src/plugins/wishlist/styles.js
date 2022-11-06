import { StyleSheet } from "react-native";
import material from '../../../native-base-theme/variables/material';

export default StyleSheet.create({
    page: {
        paddingHorizontal: 12
    },
    btnEmpty: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderRadius: 5,
        borderColor: '#C5CBD5',
        borderWidth: 1,
        height: 50,
        width: '100%'
    },
    verticalList: {
        marginLeft: 5,
        marginRight: 5
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        paddingTop: 30,
        paddingBottom: 25
    },
    btnShare: {
        flexDirection: 'row',
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: '#F96C35',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    item: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#FFC0A7',
        padding: 15,
        borderRadius: 16,
        marginBottom: 15
    },
    imageListItem: {
        height: 101,
        width: 101
    },
    btnStatus: {
        height: 25,
        borderRadius: 3,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12
    },
    btnDelete: {
        height: 40,
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 1,
        width: '68%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10
    },
    noti: {
        backgroundColor: '#D4F6D2',
        borderColor: '#39A935',
        borderWidth: 1,
        width: '100%',
        borderRadius: 8,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    buttonIcon: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10
    },
    outOfStock: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'red',
        color: 'white',
        padding: 5,
        fontWeight: "bold",
        fontSize: material.textSizeSmall
    },
    btnEmail: {
        width: '100%',
        height: 54,
        borderRadius: 8,
        backgroundColor: '#E4531A',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#00000033',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 15,
        paddingTop: 25,
        paddingHorizontal: 16,
        paddingBottom: 40,
        position: 'relative'
    },
    input: {
        paddingHorizontal: 16,
        backgroundColor: '#FAFAFA',
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#D8D8D8',
        marginBottom: 20
    },
    close: {
        position: 'absolute',
        top: 20,
        right: 20
    }
})
