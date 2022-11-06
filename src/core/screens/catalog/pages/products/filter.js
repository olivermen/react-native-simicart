import React from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { ListItem, Left, Right, Icon, Text, Button, Body, H3 } from "native-base";
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import styles from './styles';
import SimiPageComponent from '@base/components/SimiPageComponent';
import variable from '@theme/variables/material';

class Filter extends SimiPageComponent {
	constructor(props) {
		super(props);
		this.isPage = true;
		this.selected = this.props.navigation.getParam("filter");
		this.onFilterAction = this.props.navigation.getParam("onFilterAction");

	}

	openSelection = (item) => {
		NavigationManager.openPage(this.props.navigation, 'FilterSelection', {
			attribute: item,
			seleted: this.selected.layer_state,
			onFilterAction: this.onFilterAction
		});
	}

	onRemoveFilter = (remove) => {
		if (remove.attribute != 'cat') {
			let params = {};
			let selected = this.selected.layer_state;
			for (let i = 0; i < selected.length; i++) {
				let item = selected[i];
				if (item.attribute != 'cat' && item.attribute != remove.attribute) {
					params['filter[layer][' + item.attribute + ']'] = item.value;
				}
			}

			this.onFilterAction(params);

			NavigationManager.backToPreviousPage(this.props.navigation);
		}
	}

	onClearFilter() {
		this.onFilterAction(null);
		NavigationManager.backToPreviousPage(this.props.navigation);
	}

	createSelectedListProps() {
		return {
			data: this.props.navigation.getParam("filter").layer_state,
			showsVerticalScrollIndicator: false
		};
	}

	renderItemSelected(item) {
		return (
			<ListItem onPress={() => { this.onRemoveFilter(item) }}>
				<Left>
					<View style={styles.selectedContainer}>
						<Text style={styles.itemText}>{Identify.__(item.title)}:</Text>
						<Text style={styles.selectedText}>{Identify.__(item.label)}</Text>
					</View>
				</Left>
				<Right>
					<Icon name="md-close" />
				</Right>
			</ListItem>
		);
	}

	createSelectionListProps() {
		return {
			data: this.props.navigation.getParam("filter").layer_filter,
			showsVerticalScrollIndicator: false
		};
	}

	renderItemSelection(item) {
		if (item.filter && item.filter.length > 0) {
			return (
				<ListItem onPress={() => { this.openSelection(item) }}>
					<Left>
						<Text style={styles.itemText}>{Identify.__(item.title)}</Text>
					</Left>
					<Right>
						<Icon name="ios-arrow-forward" />
					</Right>
				</ListItem>
			);
		} else {
			return null;
		}

	}

	renderPhoneLayout() {
		return (
			<ScrollView style={{ backgroundColor: variable.appBackground }}>
				{this.selected.layer_state && this.selected.layer_state.length > 0 && <View>
					<H3 style={styles.title}>{Identify.__('ACTIVATED')}</H3>
					<FlatList
						{...this.createSelectedListProps()}
						keyExtractor={(item) => item.attribute}
						renderItem={({ item }) => this.renderItemSelected(item)} />
					<Body style={styles.btnClearContainer}>
						<Button bordered warning onPress={() => { this.onClearFilter() }}>
							<Icon name='md-close' />
							<Text>{Identify.__('Clear All')}</Text>
						</Button>
					</Body>
				</View>}
				{this.selected.layer_filter && this.selected.layer_filter.length > 0 && <View>
					<H3 style={styles.title}>{Identify.__('SELECT A FILTER')}</H3>
					<FlatList
						{...this.createSelectionListProps()}
						keyExtractor={(item) => item.attribute}
						renderItem={({ item }) => this.renderItemSelection(item)} />
				</View>}
			</ScrollView>
		);
	}
}

export default Filter;
