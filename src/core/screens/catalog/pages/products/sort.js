import React from 'react';
import { View, FlatList } from 'react-native';
import { Container, ListItem, Left, Right, Icon, Text } from "native-base";
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import styles from './styles';
import SimiPageComponent from '@base/components/SimiPageComponent';
import variable from '@theme/variables/material';

class Sort extends SimiPageComponent {
	constructor(props) {
		super(props);
		this.onSortAction = this.props.navigation.getParam('onSortAction');
	}

	onSelectOrder = (item) => {
		this.onSortAction(item.key, item.direction);

		NavigationManager.backToPreviousPage(this.props.navigation);
	}

	createListProps() {
		return {
			data: this.props.navigation.getParam("sort"),
			showsVerticalScrollIndicator: false
		}
	}

	renderItem(item) {
		return (
			<ListItem onPress={() => { this.onSelectOrder(item) }}>
				<Left>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={styles.itemText}>{Identify.__(item.value)}</Text>
						<Icon name={(item.direction == 'asc') ? 'arrow-up' : 'arrow-down'} />
					</View>
				</Left>
				<Right>
					{(item.default == 1) && <Icon style={styles.iconChecked} name="checkmark" />}
				</Right>
			</ListItem>
		);
	}

	renderPhoneLayout() {
		return (
			<Container style={{ backgroundColor: variable.appBackground }}>
				<FlatList
					{...this.createListProps()}
					keyExtractor={(item) => item.key + '_' + item.direction}
					renderItem={({ item }) => this.renderItem(item)} />
			</Container>
		);
	}
}

export default Sort;
