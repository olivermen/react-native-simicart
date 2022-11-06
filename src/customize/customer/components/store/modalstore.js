import React, { useState } from 'react'
import {
    Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Image, FlatList
} from 'react-native'
import { Button } from 'native-base'
import Identify from '@helper/Identify';
import NewConnection from '@base/network/NewConnection';
import material from '../../../../../native-base-theme/variables/material';

const ModalStore = (props) => {
    const [input, setInput] = useState('')
    const [stores, setStores] = useState([])
    const [stockID, setStockID] = useState('')

    getStores = (text) => {
        let params = {};
        params['filter[postcode][like]'] = `%${text}%`
        params['filter[is_allow_pickup][eq]'] = '1'
        params['page'] = 1
        params['limit'] = 10

        new NewConnection()
            .init('simiconnector/rest/V2/clickCollectLocations', 'get_store_data', this)
            .addGetData(params)
            .connect();
    }

    setData = (data) => {
        let sortedStoreByName = data.clickCollectLocations.sort((a, b) => a.name.localeCompare(b.name))
        setStores(sortedStoreByName)
    }

    handleDetails = (id) => {
        if (id === stockID) {
            setStockID('')
        } else {
            setStockID(id)
        }
    }

    renderStockLabel = (stockID, listProduct = []) => {
        if (props.screen === 'product') {
            let stockInLocations = props.product.stock_in_locations
            let statusStock = stockInLocations && stockInLocations.filter(stock => stock.stock_id === stockID)
            let check = false
            if (statusStock.length && statusStock[0].qty > 0) {
                return check = true
            } else return check
        } else {
            let array = [];
            let check = false;
            listProduct.forEach(product => {
                let status = product.stock_in_locations.filter(product => product.stock_id === stockID && product.qty > 0)
                status.length && array.push(status[0]);
            })
            if (array.length === listProduct.length) {
                return check = true;
            } return check
        }
    }

    checkStockInLocation = (stockID, product) => {
        let status = false;
        product.forEach(item => {
            if (item.stock_id === stockID && item.qty > 0) {
                status = true
                return
            }
        });
        return status
    }

    renderItems = ({ item }) => {
        let stockStatus = this.renderStockLabel(parseInt(item.stock_id), props.list)
        return (
            <View style={styles.store}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text numberOfLines={3} style={[styles.txt16Bold, { width: '50%' }]}>{Identify.__(item.name)}</Text>
                    {stockStatus
                        ? <Text style={[styles.txt16Bold, { color: 'green' }]}>{Identify.__('Enough Qty')}</Text>
                        : <Text style={[styles.txt16Bold, { color: 'red' }]}>{Identify.__('Not Enough Qty')}</Text>
                    }
                </View>
                <Text style={{ paddingBottom: 6 }}>{Identify.__(item.street)}</Text>
                <Text style={{ paddingBottom: 6 }}>{Identify.__(item.telephone)}</Text>
                <View style={[styles.actions, { alignSelf: props.screen === 'product' ? 'flex-end' : null }]}>
                    {props.screen !== 'product' ?
                        <Button
                            full
                            style={[styles.btnPick, { opacity: stockStatus ? 1 : 0.5 }]}
                            onPress={() => {
                                if (stockStatus) {
                                    props.handlePickStore(item)
                                } null
                            }}
                        >
                            <Text style={{ fontSize: 16, fontFamily: material.fontBold, color: '#fff' }}>{Identify.__('Pick here')}</Text>
                        </Button>
                        : null
                    }
                    <TouchableOpacity onPress={() => handleDetails(item.stock_id)}>
                        <Text style={styles.txtViewDetails}>{Identify.__('View Details')}</Text>
                    </TouchableOpacity>
                </View>
                {stockID === item.stock_id ? props.screen !== 'product' ?
                    props.list.map(product => {
                        return (
                            <View key={product.product_id} style={{ flexDirection: 'row', marginTop: 10 }}>
                                {checkStockInLocation(parseInt(item.stock_id), product.stock_in_locations)
                                    ? <Image source={require('../../../icon/icon-check.png')} style={[styles.iconStock, { tintColor: 'black' }]} />
                                    : <Image source={require('../../../icon/icon-close-1.png')} style={styles.iconStock} />
                                }
                                <Text numberOfLines={2} style={{ width: '80%' }}>{Identify.__(product.name)}</Text>
                            </View>
                        )
                    })
                    :
                    (<View style={{ flexDirection: 'row', marginTop: 10 }}>
                        {stockStatus
                            ? <Image source={require('../../../icon/icon-check.png')} style={styles.iconStock} />
                            : <Image source={require('../../../icon/icon-close-1.png')} style={styles.iconStock} />
                        }
                        <Text numberOfLines={2} style={{ width: '80%' }}>{Identify.__(props.product.name)}</Text>
                    </View>)
                    : null
                }
            </View>
        )
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.visible}
            style={{ flex: 1 }}
        >
            <View activeOpacity={1} style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>{Identify.__("Click & Collect")}</Text>
                    <View style={styles.modalView2}>
                        <TextInput
                            style={styles.input}
                            value={input}
                            onChangeText={(text) => setInput(text)}
                            placeholder={Identify.__("Enter City and State or Zip Code")}
                            placeholderTextColor='#747474'
                        />
                        <TouchableOpacity style={styles.btnFind} onPress={() => getStores(input)}>
                            <Text style={styles.txtFind}>
                                {Identify.__("Find")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {stores && stores.length ?
                        <FlatList
                            data={stores}
                            style={stores.length > 1 && { height: '62%' }}
                            keyExtractor={item => item.location_id}
                            renderItem={renderItems}
                        />
                        : <View style={styles.noData}>
                            <Image source={require('../../../icon/search_not_found.png')} style={{ width: 80, height: 80 }} />
                            <Text style={[styles.txt16Bold, { paddingBottom: 10 }]}>{Identify.__('No stores were found.')}</Text>
                            <Text>{Identify.__('Do you want to look further away?')}</Text>
                        </View>
                    }
                    <TouchableOpacity style={styles.close} onPress={props.closeModal}>
                        <Image source={require('../../../icon/icon-close.png')} style={{ width: 18, height: 18 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#00000033',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 15,
        paddingTop: 27,
        paddingBottom: 23,
        position: "relative"
    },
    modalView2: {
        backgroundColor: '#FAFAFA',
        paddingTop: 20,
        paddingBottom: 30,
        paddingHorizontal: 16,
        marginTop: 28,
        borderTopWidth: 1,
        borderTopColor: '#D8D8D8',
        borderBottomWidth: 1,
        borderBottomColor: '#D8D8D8',
        marginBottom: 30
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 16
    },
    input: {
        paddingHorizontal: 16,
        backgroundColor: '#FAFAFA',
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#E5E5E5'
    },
    btnFind: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#E4531A',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    txtFind: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold'
    },
    noData: {
        width: '100%',
        height: 160,
        alignItems: 'center',
        justifyContent: 'center'
    },
    close: {
        position: 'absolute',
        top: 20,
        right: 20
    },
    store: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#D8D8D8',
        marginBottom: 15,
        marginHorizontal: 16,
        borderRadius: 8
    },
    txt16Bold: {
        fontSize: 16,
        fontWeight: '500'
    },
    txtViewDetails: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontSize: 16,
        color: '#096BB3'
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'space-between',
        marginBottom: 8
    },
    btnPick: {
        height: 45,
        borderRadius: 8,
        width: '58%'
    },
    iconStock: {
        width: 20,
        height: 20,
        marginRight: 12
    }
})

export default ModalStore