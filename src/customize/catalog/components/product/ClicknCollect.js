import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Identify from '@helper/Identify';
import SimiComponent from "@base/components/SimiComponent";
import ModalStore from '../../../customer/components/store/modalstore'

export default class ClicknCollect extends SimiComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            visibleModal: false
        }
    }

    showModal = () => {
        this.setState({ visibleModal: true })
    }

    hideModal = () => {
        this.setState({ visibleModal: false })
    }

    renderPhoneLayout() {
        let product = this.props.product
        return (
            <>
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../../../icon/icon-car.png')} style={{ width: 21, height: 24 }} />
                        <View style={{ marginLeft: 10 }}>
                            <View style={{ flexDirection: 'row', paddingBottom: 5 }}>
                                <Text style={styles.txt16Bold}>{Identify.__('Click & Collect: ')}</Text>
                                <Text style={{ fontSize: 16 }}>{Identify.__('To view availability,')}</Text>
                            </View>
                            <TouchableOpacity onPress={this.showModal}>
                                <Text style={[styles.txt16Bold, { color: '#096BB3', textDecorationLine: 'underline' }]}>{Identify.__('View Store')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                <ModalStore
                    visible={this.state.visibleModal}
                    closeModal={this.hideModal}
                    screen='product'
                    product={product}
                />
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#747474',
        borderRadius: 8,
        width: '100%',
        paddingTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 12,
        marginTop: 15,
    },
    txt16Bold: {
        fontSize: 16,
        fontWeight: '500'
    }
})