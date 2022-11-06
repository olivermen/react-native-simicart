import React from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Icon, Text } from "native-base";
import SimiPageComponent from '@base/components/SimiPageComponent';
import Identify from '@helper/Identify';

export default class SelectedFilter extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.parent = this.props.navigation.getParam("parent");
        this.selected = this.props.navigation.getParam("filter");
    }

    renderItem(item) {
        if (item.attribute != 'cat') {
            return (
                <View style={styles.item}>
                    <Text style={styles.title}>{item.title}: </Text>
                    <Text style={styles.value}>{item.label}</Text>
                    <Icon name="md-close"
                        style={{ marginLeft: 15, marginRight: 0, fontSize: 20 }}
                        onPress={() => { this.onRemoveFilter(item) }} />
                </View>
            );
        } else {
            return null;
        }
    }

    onRemoveFilter = (remove) => {
        if (remove.attribute != 'cat') {
            let params = {};
            let selected = this.props.parent.state.data.layers.layer_state;
            for (let i = 0; i < selected.length; i++) {
                let item = selected[i];
                if (item.attribute != 'cat' && item.attribute != remove.attribute) {
                    params['filter[layer][' + item.attribute + ']'] = item.value;
                }
            }

            this.props.parent.onFilterAction(params);
        }
    }

    render() {
        let data = this.props.parent.state.data;
        let filterSelected = false;
        if (data.layers) {
            if ((data.layers.layer_filter && data.layers.layer_filter.length > 0) || (data.layers.layer_state && data.layers.layer_state.length > 0)) {
                if (data.layers.layer_state && data.layers.layer_state.length > 0) {
                    if (data.layers.layer_state.length == 1) {
                        if (data.layers.layer_state[0].attribute == 'cat') {
                            filterSelected = false;
                        } else {
                            filterSelected = true;
                        }
                    } else {
                        filterSelected = true;
                    }
                } else {
                    filterSelected = false;
                }
            }
        }

        if (filterSelected) {
            return (
                <View style={styles.parent}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        showVerticalScrollIndicator={false}>
                        <FlatList
                            horizontal={true}
                            contentContainerStyle={{ flex: 1, flexDirection: 'row' }}
                            data={this.props.parent.state.data.layers.layer_state}
                            scrollEnabled={false}
                            keyExtractor={(item) => Identify.makeid()}
                            renderItem={({ item }) => this.renderItem(item)} />
                    </ScrollView>
                </View>
            );
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    parent: {
        marginStart: 10,
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    item: {
        backgroundColor: '#ededed',
        paddingStart: 10,
        paddingTop: 10,
        paddingEnd: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'baseline',
        marginRight: 20,
        borderRadius: 20
    },
    title: {
        fontWeight: 'bold',
        color: '#000000',
        fontSize: 16
    },
    value: {
        color: '#000000',
        fontSize: 16
    }
})