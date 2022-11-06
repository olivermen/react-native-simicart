import React from 'react';
import { FlatList, View, Dimensions } from 'react-native';
import Item from './item';
var { height, width } = Dimensions.get("window");

export default class Row extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            layout: {
                height: height,
                width: width
            }
        };
    }

    _onLayout = event => {
        this.setState({
            layout: {
                height: event.nativeEvent.layout.height,
                width: event.nativeEvent.layout.width
            }
        });
    };

    renderRowItem = (item, index) => {
        return <Item width={this.state.layout.width} item={item} index={index} listSize={this.props.items.length} />
    }

    render() {
        let items = this.props.items;

        items.sort(function(a, b){
            var keyA = a.sort_order,
                keyB = b.sort_order;
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });

        if (items.length > 0) {
            return (
                <View>
                    <FlatList
                        onLayout={this._onLayout}
                        style={{ marginTop: 5 }}
                        data={items}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.item_id}
                        renderItem={({ item, index }) =>
                            this.renderRowItem(item, index)
                        } />
                </View>
            );
        }
        return null;
    }
}
