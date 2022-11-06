import React from 'react';
import { connect } from 'react-redux';
import { PixelRatio } from "react-native";
import { Text, List, ListItem, View, Thumbnail } from "native-base";
import Identify from '@helper/Identify';
import variable from "@theme/variables/material";
import NavigationManager from '@helper/NavigationManager';
import Events from '@helper/config/events';
class Cms extends React.Component {
    constructor(props) {
        super(props);
    }

    renderImage(image) {
        if (image) {
            return (
                <Thumbnail square source={{ uri: image }} style={{ width: 23, height: 23 }} />
            );
        }
        return null;
    }

    render() {
        let color = variable.menuLeftTextColor;
        if (Identify.isEmpty(this.props.data) ||
            Identify.isEmpty(this.props.data.storeview) ||
            Identify.isEmpty(this.props.data.storeview.cms)
        ) {
            return null;
        }
        let cmsList = this.props.data.storeview.cms.cmspages;
        return <List style={{ borderTopColor: variable.listBorderColor, borderTopWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1), paddingBottom: 100 }}
            dataArray={cmsList}
            renderRow={data => {
                return (
                    <ListItem last
                        button
                        onPress={() => {
                            let params = {};
                            params['event'] = 'menu_action';
                            params['action'] = 'clicked_menu_item';
                            params['menu_item_name'] = 'cms';
                            Events.dispatchEventAction(params);
                            NavigationManager.openPage(this.props.navigation, 'WebViewPage', {
                                html: data.cms_content,
                            });
                        }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {this.renderImage(data.cms_image)}
                            <Text style={{ marginLeft: 10, marginTop: 3, color: color }}>{data.cms_title}</Text>
                        </View>
                    </ListItem>
                );
            }}
        />
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.merchant_configs };
}
export default connect(mapStateToProps)(Cms);
