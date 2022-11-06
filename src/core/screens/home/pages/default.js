import React from 'react';
import { connect } from 'react-redux';
import Identify from '@helper/Identify';
import SimiComponent from "@base/components/SimiComponent";
import { Content,Container } from "native-base";
import variable from '@theme/variables/material';

class Home extends SimiComponent {
    constructor(props) {
        super(props);
    }
    renderPhoneLayout() {
        if (Identify.isEmpty(this.props.data)) {
            return (null);
        } else {
            this.home_data = this.props.data;
            return (
                <Container style={{backgroundColor: variable.appBackground}}>
                    <Content>
                        {this.renderLayoutFromConfig('standard_layout','content')}
                    </Content>
                    {this.renderLayoutFromConfig('standard_layout','container')}
                </Container>
            );
        }
    }
}
const mapStateToProps = (state) => {
    return { data: state.redux_data.home_data };
}
export default connect(mapStateToProps)(Home);
