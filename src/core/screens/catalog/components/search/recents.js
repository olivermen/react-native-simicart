import React from 'react';
import { TouchableOpacity, FlatList } from 'react-native';
import { View, Icon, Text } from 'native-base';
import Identify from '@helper/Identify';
import variable from '@theme/variables/material';
import SimiComponent from "@base/components/SimiComponent";
import AppStorage from '@helper/storage';

export default class RecentSearch extends SimiComponent {

    constructor(props) {
        super(props);
        this.state = {
            suggestion: []
        }
        this.newRecents = [];
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined)
        }
    }

    saveQuery(query) {
        let id = query.replace(' ', '_').toLowerCase();
        let position = -1;
        this.newRecents = JSON.parse(JSON.stringify(this.state.suggestion));
        this.newRecents.forEach(element => {
            if (element.id == id) {
                position = this.newRecents.indexOf(element);
                return;
            }
        });
        let item = null;
        if (position == -1) {
            item = {
                id: id,
                label: query
            };
            if (this.newRecents.length == 5) {
                this.newRecents.splice(4, 1);
            }
        } else {
            item = this.newRecents[position];
            this.newRecents.splice(position, 1);
        }
        this.newRecents.unshift(item);
        AppStorage.saveData('recent_search', JSON.stringify(this.newRecents));
        this.setState({ suggestion: this.newRecents });
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
        AppStorage.getData('recent_search').then((recents) => {
            if (recents) {
                this.setState({ suggestion: JSON.parse(recents) });
            }
        });
    }

    renderPhoneLayout() {
        let recents = this.state.suggestion;
        if (recents.length == 0) {
            return null;
        }
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <Text style={{ fontFamily: variable.fontBold, fontSize: 18 }}>{Identify.__('Recent Searches')}</Text>
                    <Text
                        style={{ fontFamily: variable.fontBold, position: 'absolute', right: 10, padding: 5 }}
                        onPress={() => {
                            AppStorage.saveData('recent_search', '').then(() => {
                                this.setState({ suggestion: [] });
                            });
                        }}
                    >{Identify.__('CLEAR')}</Text>
                </View>
                <FlatList
                    data={recents}
                    extraData={this.newRecents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.parent.openSearchResults(item.label);
                                }}
                                style={{ borderBottomColor: '#EDEDED', borderBottomWidth: 0.5, flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                                <Text style={{ flex: 1, marginRight: 30, paddingBottom: 0 }}>{item.label}</Text>
                                <Icon style={{ color: '#EDEDED', fontSize: 14, position: 'absolute', right: 15 }} name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} />
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        );
    }
}