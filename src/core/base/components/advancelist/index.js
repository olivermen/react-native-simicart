import React, { Component } from 'react'
import SearchList from '../../../../community/react-native-search-list/index';
import Identify from "@helper/Identify";
import { StatusBar } from 'react-native'
import { Text, View, Button } from 'native-base'
import variable from "@theme/variables/material";
import Item from './item';

export default class AdvanceList extends Component {
    constructor(props) {
        super(props);
    }

    formatData() {
        let formatted = [];
        let data = this.props.data;
        data.forEach(element => {
            if (element.searchStr) {
                let firstChar = element.searchStr.charAt(0).toUpperCase();
                let existed = false;
                if (formatted.length > 0) {
                    formatted.forEach(item => {
                        if (item.title == firstChar) {
                            existed = true;
                            item.data.push(element);
                            return;
                        }
                    });
                }
                if (!existed) {
                    formatted.push({
                        title: firstChar,
                        searchKey: Identify.makeid(),
                        data: [element]
                    });
                }
            }
        });
        formatted.sort(function (a, b) {
            if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
            if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }
            return 0;
        });
        return formatted;
    }

    // custom render row
    renderRow(item) {
        return (
            <Item parent={this.props.parent} item={item} />
        )
    }

    // render empty view when datasource is empty
    renderEmpty() {
        return (
            <View>
                <Text style={{ fontSize: variable.textSizeBigger, paddingTop: 20 }}> No Content </Text>
            </View>
        )
    }

    // render empty result view when search result is empty
    renderEmptyResult(searchStr) {
        return (
            <View>
                <Text style={{ fontSize: variable.textSizeBigger, paddingTop: 20 }}> No Result For <Text
                    style={{ fontSize: variable.textSizeBigger }}>{searchStr}</Text></Text>
                <Text style={{ fontSize: variable.textSizeBigger, alignItems: 'center', paddingTop: 10 }}>Please search again</Text>
            </View>
        )
    }

    renderBackButton() {
        return (
            <Button transparent onPress={() => { this.props.parent.showModal() }}><Text style={{ color: variable.btnPrimaryColor }}>{Identify.__('Cancel')}</Text></Button>
        )
    }
    renderRightButton() {
        return (
            <Button transparent onPress={() => { }}><Text style={{ color: variable.statusBarColor }}>{Identify.__('Cancel')}</Text></Button>
        )
    }
    renderTitle() {
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: variable.btnPrimaryColor }}>{Identify.__(this.props.title)}</Text></View>
        )
    }

    render() {
        return (
            <View>
                {this.props.showStatusBar && <StatusBar backgroundColor={variable.statusBarColor} barStyle='light-content' />}
                <SearchList
                    data={this.formatData()}
                    renderRow={this.renderRow.bind(this)}
                    renderEmptyResult={this.renderEmptyResult.bind(this)}
                    renderBackButton={this.renderBackButton.bind(this)}
                    renderTitle={this.renderTitle.bind(this)}
                    renderRightButton={this.renderRightButton.bind(this)}
                    renderEmpty={this.renderEmpty.bind(this)}
                    rowHeight={40}
                    toolbarBackgroundColor={variable.statusBarColor}
                    cancelTitle={Identify.__('Cancel')}
                    onClickBack={() => { console.log('1234'); }}
                    searchListBackgroundColor={variable.statusBarColor}
                    searchBarToggleDuration={300}
                    searchInputBackgroundColor={variable.toolbarInputColor}
                    searchInputBackgroundColorActive={variable.toolbarInputColor}
                    searchInputPlaceholderColor={variable.inputColorPlaceholder}
                    searchInputTextColor={variable.inputColor}
                    searchInputTextColorActive={variable.textColor}
                    searchInputPlaceholder={Identify.__('Search')}
                    sectionIndexTextColor={'#6ec6ff'}
                    searchBarBackgroundColor={variable.statusBarColor}
                    showToolBar={this.props.showToolBar}
                    showSearchBar={this.props.showSearchBar}
                    listHeight={this.props.listHeight}
                />
            </View>
        );
    }
}
AdvanceList.defaultProps = {
    title: 'Search',
    data: [],
    value: '',
    showStatusBar: true,
    showToolBar: true,
    showSearchBar: true
};
