import { StyleSheet, Platform } from 'react-native'

export const styles = StyleSheet.create({
    page: {
        marginHorizontal: 12,
        paddingBottom: 40
    },
    header: {
        flexDirection: 'row',
        paddingTop: 25,
        marginBottom: 20
    },
    tabHeader: {
        width: '50%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 3
    },
    txtHeader: {
        fontSize: 16
    },
    total: {
        fontWeight: '500',
        paddingBottom: 20,
        textAlign: 'left'
    },
    container: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#D8D8D8',
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 15,
        borderRadius: 8
    },
    container2: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#D8D8D8',
        backgroundColor: '#FAFAFA',
        paddingBottom: 20,
        marginTop: 15,
        borderRadius: 8
    },
    headerTitle: {
        width: '100%',
        height: 48,
        paddingLeft: 20,
        justifyContent: 'center',
        borderTopStartRadius: 8,
        borderTopEndRadius: 8,
        backgroundColor: '#E4531A',
        marginBottom: 30
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtAction: {
        fontWeight: '500',
        color: '#E4531A',
        paddingLeft: 10
    },
    nameDetail: {
        fontWeight: '500',
        fontSize: 20,
        paddingLeft: 15
    },
    timeOpen: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    // Map
    containerlist: {
        flex: 1
    },
    mapIOS: {
        ...StyleSheet.absoluteFillObject,
        height: 300
    },
    mapAndroid: {
        flex: 1,
        height: 300,
        position: 'relative'
    },
    mapInfo: {
        position: Platform.OS === 'ios' ? 'relative' : 'absolute',
        top: 20,
        left: 20,
        width: '86%',
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    icClose: {
        position: 'absolute',
        top: 16,
        right: 16
    }
})