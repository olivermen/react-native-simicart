import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import QuoteItemView from './quote';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import Format from '../../../catalog/components/product/price/format';

const QuoteItem = (props) => {

    renderItemContent = (data) => {
        return (
            <View style={{ marginLeft: 10, flex: 1, position: 'relative' }}>
                <View style={{ width: '60%' }}>
                    <Text style={styles.spaceLine}>{data.name}</Text>
                </View>
                <QuoteItemView item={data} style={styles.itemStyle} />
                <View style={styles.itemContent}>
                    <View style={{ flexDirection: 'row', paddingBottom: 6 }}>
                        <Text style={styles.title}>{Identify.__('Product Code:  ')}</Text>
                        <Text style={styles.spaceLine}>{data.sku}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 6 }}>
                        <Text style={styles.title}>{Identify.__('Unit Price:  ')}</Text>
                        <Format style={[styles.spaceLine, { paddingTop: 2 }]} price={data.price} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.title}>{Identify.__('Total Price:  ')}</Text>
                        <Format style={[styles.spaceLine, { paddingTop: 2 }]} price={data.row_total} />
                    </View>
                </View>
                {(!props.parent.from || props.parent.from != 'cart') && <Text style={styles.quantity}>x {parseInt(data.qty.toString()).toString()}</Text>}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image style={styles.viewImage} source={{ uri: props.data.image }} resizeMode='contain' />
            {renderItemContent(props.data)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#D8D8D8',
        padding: 16,
        position: 'relative',
        flexDirection: 'row',
        borderRadius: 8,
        marginBottom: 15
    },
    spaceLine: { textAlign: 'left', flex: 1 },
    title: {
        fontWeight: '500'
    },
    viewImage: {
        height: 65,
        width: 65,
        borderWidth: 0.5,
        borderColor: '#000'
    },
    itemContent: {
        width: '100%',
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        padding: 16,
        marginTop: 10
    },
    quantity: {
        fontFamily: material.fontBold,
        color: '#E4531A',
        position: 'absolute',
        top: 0,
        right: 0
    },
    itemStyle: {
        marginBottom: 5,
        fontSize: material.textSizeSmall
    }
});

export default QuoteItem