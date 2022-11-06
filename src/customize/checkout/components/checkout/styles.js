import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    tab: {
        borderColor: '#D8D8D8',
        borderWidth: 1,
        borderBottomWidth: 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        padding: 10,
        width: '49.5%',
        alignItems: 'center'
    },
    noneTab: {
        borderBottomWidth: 1,
        borderColor: '#D8D8D8',
        width: '49.5%',
        borderBottomRightRadius: 9
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dot: {
        width: 14, height: 14, backgroundColor: '#E4531A', borderRadius: 7
    },
    content: {
        borderColor: '#D8D8D8',
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        paddingVertical: 25,
        paddingHorizontal: 15
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#D8D8D8',
        marginBottom: 16.5
    },
    btnSelectBtn: {
        height: 40,
        width: '48%',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000'
    },
    input: {
        paddingHorizontal: 16,
        backgroundColor: '#FFF',
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#E5E5E5'
    },
    txt16Bold: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingLeft: 2
    },
    btnSave: {
        height: 50,
        borderRadius: 8,
        width: '50%',
        marginTop: 2,
        marginBottom: 5,
        alignSelf: 'flex-end'
    },
    pickupContainer: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#D8D8D8',
        backgroundColor: '#FAFAFA',
        width: '100%',
        borderRadius: 8,
        marginBottom: 8
    },
    deliveryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        marginTop: 15
    }
})