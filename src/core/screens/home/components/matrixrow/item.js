import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import { products_mode } from '@helper/constants';
import Events from '@helper/config/events';
import { Text } from 'native-base';
import Identify from '@helper/Identify';
import Device from '@helper/device';

const Item = (props) => {
    const generateData = (item) => {
        let imageUrl = '';
        let width = props.width
        let widthPercent = Device.isTablet() ? parseFloat(item.matrix_width_percent_tablet) : parseFloat(item.matrix_width_percent);
        let heightPercent = Device.isTablet() ? parseFloat(item.matrix_height_percent_tablet) : parseFloat(item.matrix_height_percent);
        let itemWidth = widthPercent * width / 100;
        let itemHeight = heightPercent * width / 100;
        if (props.listSize > 1) {
            if (props.index != props.listSize - 1) {
                itemWidth += 5;
            } else {
                itemWidth -= 5;
            }
        }
        if (item.simicategory_filename) {
            if (Device.isTablet()) {
                imageUrl = item.simicategory_filename_tablet;
            } else {
                imageUrl = item.simicategory_filename;
            }
        } else if (item.list_image) {
            if (Device.isTablet()) {
                imageUrl = item.list_image_tablet;
            } else {
                imageUrl = item.list_image;
            }
        }
        let name = '';
        if (item.simicategory_name !== undefined) {
            name = item.simicategory_name;
        } else if (item.list_title) {
            name = item.list_title;
        }
        return {
            name,
            imageUrl,
            itemWidth,
            itemHeight
        }
    }

    function renderItem(item) {
        let data = generateData(item);
        return (
            <View style={{ height: data.itemHeight, width: data.itemWidth, alignItems: 'center', justifyContent: 'center', paddingRight: props.index == props.listSize - 1 ? 0 : 5 }}>
                <Image
                    source={{ uri: data.imageUrl }}
                    style={{ width: '100%', height: data.itemHeight }} />
                {Identify.getMerchantConfig().storeview.base.is_show_home_title == '1' && <View style={{ padding: 10, backgroundColor: 'rgba(255,255,255, 0.8)', position: "absolute" }}><Text style={{ color: 'black' }}>{data.name.toUpperCase()}</Text></View>}
            </View>
        )
    }

    function tracking(item) {
        let data = {};
        data['event'] = 'home_action';
        if (item.simicategory_filename) {
            data['action'] = 'selected_category';
            data['category_id'] = item.category_ids;
        } else {
            data['action'] = 'selected_product_list';
            data['product_list_id'] = item.productlist_id;
        }
        Events.dispatchEventAction(data, this);
    }

    function selectItem(item) {
        if (item.content_type == '3') {
            console.log('1');
            if (item.has_children) {
                console.log('3');
                routeName = 'Category';
                params = {
                    categoryId: item.category_id,
                    categoryName: item.cat_name,
                };
            } else {
                console.log('4');
                routeName = 'Products';
                params = {
                    categoryId: item.category_id,
                    categoryName: item.cat_name,
                };
            }
        } else {
            console.log('2');
            routeName = 'Products';
            params = {
                spotId: item.productlist_id,
                'mode': products_mode.spot,
            };
        }
        tracking(item);
        NavigationManager.openPage(props.navigation, routeName, params);
    }

    if (props.item == null) return null;
    let item = props.item;
    return (
        <TouchableOpacity onPress={() => {
            selectItem(item);
        }}>
            {renderItem(item)}
        </TouchableOpacity>
    );
};

Item.defaultProps = {
    item: null
}

export default Item;