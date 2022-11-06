import React from 'react';
import { TouchableOpacity, FlatList } from 'react-native';
import { Container, View, Icon, Input, List, Text } from 'native-base';
import Identify from '@helper/Identify';
import styles from '../../pages/search/styles';
import variable from '@theme/variables/material';
import md5 from 'md5';
import SimiPageComponent from "@base/components/SimiPageComponent";
import Events from '@helper/config/events';
import NavigationManager from "@helper/NavigationManager";
import AppStorage from '@helper/storage';

export default class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            showClear: false
        }
    }

    onChangeText(txt) {
        this.state.text = txt;
        this.textInput.setNativeProps({ text: txt })
        if (this.state.showClear && this.state.text.length == 0) {
            this.setState({ showClear: false });
        } else if (!this.state.showClear && this.state.text.length > 0) {
            this.setState({ showClear: true });
        }
    }

    onEndEditing() {
        this.props.parent.openSearchResults(this.state.text);
    }

    render() {
        let voiceSearch = this.dispatchAddItem();
        return (
            <View style={[styles.container, { backgroundColor: variable.getsearchbackgroundcColor }]}>
                <View regular style={[styles.search, { backgroundColor: variable.getsearchbackgroundcColor }]}>
                    <Icon name='search' style={[styles.icon, { color: variable.toolbarDefaultBg == '#ffffff' ? variable.toolbarBtnColor : variable.toolbarDefaultBg }]} />
                    <View style={styles.inputContainer}>
                        <Input style={{ flex: 1, color: variable.searchtextColor }}
                            placeholderTextColor={variable.searchtextColor}
                            placeholder={Identify.__('What are you looking for?')}
                            autoFocus={true}
                            ref={input => { this.textInput = input }}
                            onChangeText={(txt) => {
                                this.onChangeText(txt)
                            }}
                            returnKeyType='search'
                            onSubmitEditing={() => { this.onEndEditing() }} />
                        {this.state.showClear && <Icon style={styles.clearIcon} name='md-close' onPress={() => {
                            this.textInput.setNativeProps({ text: '' })
                            this.setState({ text: '', showClear: false });
                        }} />}
                        {voiceSearch}
                    </View>
                </View>
            </View>
        );
    }

    dispatchAddItem() {
        let plugins = [];
        for (let i = 0; i < Events.events.search_page.length; i++) {
            let node = Events.events.search_page[i];
            if (node.active === true) {
                let key = md5("pages_search_items" + i);
                let Content = node.content;
                plugins.push(<View style={{ marginBottom: 10, marginTop: 10, alignItems: 'baseline' }} key={key}>
                    <Content obj={this} />
                </View>);
            }
        }
        return plugins;
    }
}