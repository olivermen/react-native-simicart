import React from 'react';
import { FlatList } from 'react-native';
import { Container, ListItem, Left, Right, Text } from "native-base";
import NavigationManager from '@helper/NavigationManager';
import styles from './styles';
import SimiPageComponent from '@base/components/SimiPageComponent';
import variable from '@theme/variables/material';

class FilterSelection extends SimiPageComponent {
	constructor(props) {
		super(props);
		this.isPage = true;
		this.attribute = null;
		this.onFilterAction = this.props.navigation.getParam("onFilterAction");
	}

	onSelectFilter(selection) {
		let params = {};
		params['filter[layer][' + this.attribute.attribute + ']'] = selection.value;

		let selected = this.props.navigation.getParam("seleted");
		if(selected) {
			for (let i = 0; i < selected.length; i++) {
				let item = selected[i];
				if (item.attribute != 'cat') {
					params['filter[layer][' + item.attribute + ']='] = item.value;
				}
			}
		}

		this.onFilterAction(params);

		NavigationManager.backToPage(this.props.navigation, 2);
	}

	createListProps() {
		return {
			data: this.attribute.filter,
			showsVerticalScrollIndicator: false
		};
	}

	renderItem(item) {
		return (
			<ListItem onPress={() => { this.onSelectFilter(item) }}>
				<Left>
					<Text style={styles.itemText}>{item.label}</Text>
				</Left>
				<Right>

				</Right>
			</ListItem>
		);
	}

	renderPhoneLayout() {
		this.attribute = this.props.navigation.getParam("attribute");
		return (
			<Container style={{backgroundColor: variable.appBackground}}>
				<FlatList
					{...this.createListProps()}
					keyExtractor={(item) => item.value}
					renderItem={({ item }) => this.renderItem(item)} />
			</Container>
		);
	}
}

export default FilterSelection;
