import React from 'react';
import { Icon, View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import NavigationManager from '../../../../helper/NavigationManager';
import Identify from '../../../../helper/Identify';
import styles from './styles';
import { products_mode } from '../../../../helper/constants';

const Search = (props) => {

    function openSearchPage() {
        if (props.navigation.getParam("query")) {
            NavigationManager.backToPreviousPage(props.navigation);
        } else {
            let mode = props.navigation.getParam("mode");
            if (mode && mode === products_mode.spot) {
                routeName = 'SearchProducts';
                params = {
                    spotId: props.navigation.getParam("spotId"),
                    mode: mode,
                };
            } else {
                routeName = 'SearchProducts';
                params = {
                    categoryId: props.navigation.getParam("categoryId"),
                    categoryName: props.navigation.getParam("categoryName"),
                };
            }
            NavigationManager.openPage(props.navigation, routeName, params);
        }
    }

    let text = props.navigation.getParam("query") ? props.navigation.getParam("query") : Identify.__('Search');
    return (
        <TouchableOpacity style={styles.container} onPress={() => {
            openSearchPage();
        }}>
            <View style={styles.search}>
                <View style={styles.center}>
                    <Icon style={styles.icon} name='search' />
                    <Text style={styles.text}>{text}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
export default Search;
