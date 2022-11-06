import React from 'react';
import { Container, Content } from 'native-base';
import SimiPageComponent from "@base/components/SimiPageComponent";
import NavigationManager from "@helper/NavigationManager";
import Events from '@helper/config/events';

class SearchProducts extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.isBack = true;
        this.showSearch = false;
        this.state = {
            ...this.state,
            suggestion: []
        }
    }

    openSearchResults(query) {
        if (query.length > 0) {
            this.tracking(query);
            if (this.recents) {
                this.recents.saveQuery(query);
            }
            routeName = 'Products';
            params = {
                categoryId: this.props.navigation.getParam("categoryId"),
                categoryName: this.props.navigation.getParam("categoryName"),
                query: query
            };
            NavigationManager.openPage(this.props.navigation, routeName, params);
        }
    }

    createRef(id) {
        switch (id) {
            case 'default_recents':
                return ref => (this.recents = ref);
            default:
                return undefined;
        }
    }

    addMorePropsToComponent(element) {
        return {
            onRef: this.createRef(element.id)
        };
    }

    renderPhoneLayout() {
        return (
            <Container>
                {this.renderLayoutFromConfig('search_layout', 'container')}
                {/* <Content>
                    {this.renderLayoutFromConfig('search_layout', 'content')}
                </Content> */}
            </Container>
        );
    }

    tracking(query) {
        let data = {};
        data['event'] = 'search_action';
        data['action'] = 'view_search_results';
        data['search_term'] = query;
        Events.dispatchEventAction(data, this);
    }

}

export default SearchProducts;
