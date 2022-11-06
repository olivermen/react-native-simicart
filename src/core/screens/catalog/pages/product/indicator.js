import React from 'react'
import { FlatList, Platform, Image, Dimensions, TouchableHighlight, View } from 'react-native'
import Identify from "@helper/Identify";

export default class IndicatorFullImage extends React.Component {
    render() {
        let data = this.props.images;
        return (
            <FlatList
                contentContainerStyle={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
                ref={listRef => { this.listRef = listRef }}
                data={data}
                keyExtractor={() => Identify.makeid()}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                renderItem={({ item, index }) => {
                    return this.renderBottomIndicator(item, index)
                }}
            />
        )
    }

    scrollToIndex = (index, animated) => {
        this.listRef && this.listRef.scrollToIndex({ index, animated })
    }

    onSelectImage(index) {
        this.props.parent.setState({ index: index });
    }

    componentDidUpdate() {
        if (Platform.OS === 'android' && parseInt(Identify.getMerchantConfig().storeview.base.is_rtl) === 1) {
            this.scrollToIndex((this.props.images.length - 1) - this.props.parent.state.index, true);
        } else {
            this.scrollToIndex(this.props.parent.state.index, true);
        }
    }

    renderBottomIndicator(item, index) {
        if (item.id && item.id.includes('fake')) {
            return (
                <View style={{ width: (Dimensions.get('window').width - 50) / 4, height: 0 }} />
            );
        }
        return (
            <TouchableHighlight
                onPress={() => {
                    this.onSelectImage(index)
                }}
                key={index}
                style={{ borderRadius: 2, marginLeft: 10 }}>
                <Image resizeMode='cover' source={{ uri: item.url }}
                    style={{
                        borderWidth: 2,
                        borderColor: index === this.props.parent.state.index ? Identify.theme.button_background : 'transparent',
                        aspectRatio: 1,
                        width: (Dimensions.get('window').width - 50) / 4,
                        borderRadius: 2,
                        overflow: 'hidden'
                    }} />
            </TouchableHighlight>
        )
    }
}