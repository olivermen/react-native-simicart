import React from 'react';
import Identify from '@helper/Identify';
import { Container, Content, Button, Text, View, Icon, Card, H2 } from "native-base";
import { TouchableOpacity, StyleSheet } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import { checkout_mode } from '@helper/constants';

const ThankOrder = (props) => {

    function onThankyouSelect() {
        NavigationManager.openPage(props.navigation, 'OrderHistoryDetail', { orderId: props.navigation.getParam('invoice') });
    }

    if (props.navigation.getParam('mode') == checkout_mode.guest) {
        return (
            <View style={{
                marginTop: 20,
                paddingTop: 15,
                paddingBottom: 15
            }}>
                <Text style={styles.orderLabel}>{Identify.__('Your order is')}: #{props.navigation.getParam('invoice')}</Text>
            </View>
        )
    } else {
        let disabledButton = props.navigation.getParam('mode') == checkout_mode.new_customer && !Identify.getCustomerData();
        return (
            <TouchableOpacity
                disabled={disabledButton}
                onPress={() => {
                    onThankyouSelect()
                }}>
                <Card style={styles.card}>
                    <View style={styles.cardContainer}>
                        <Text style={styles.orderLabel}>{Identify.__('Your order is')}: #{props.navigation.getParam('invoice')}</Text>
                        {disabledButton ?
                            null :
                            <Icon style={styles.extendIcon} name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} />}
                    </View>
                </Card>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    orderLabel: {
        flex: 1
    },
    extendIcon: {
        marginLeft: 5,
        fontSize: 20,
        color: '#c9c9c9'
    },
    button: {
        marginTop: 30
    },
    content: {
        padding: 20,
    },
});

export default ThankOrder;