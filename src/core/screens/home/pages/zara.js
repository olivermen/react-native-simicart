import React from 'react';
import { connect } from 'react-redux';
import { Content, Container } from "native-base";
import Identify from '@helper/Identify';
import { ScrollView } from 'react-native';
import SimiComponent from "@base/components/SimiComponent";
import variable from '@theme/variables/material';

class Zara extends SimiComponent {
    constructor(props) {
        super(props);
        this.scrollView = null
    }
    renderPhoneLayout() {
        if (Identify.isEmpty(this.props.data)) {
            return null;
        }
        return (
            <Container style={{ backgroundColor: variable.appBackground }}>
                {this.renderLayoutFromConfig('zara_layout', 'container')}
                <Content>
                    <ScrollView ref={(c) => { this.scrollView = c }}>
                        {this.renderLayoutFromConfig('zara_layout', 'content')}
                    </ScrollView>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.home_data };
}
export default connect(mapStateToProps)(Zara);
