import React from "react";
import { connect } from 'react-redux';
import { Content, Container } from "native-base";
import Identify from '@helper/Identify';
import SimiComponent from "@base/components/SimiComponent";
import variable from '@theme/variables/material';

class Matrix extends SimiComponent {
    constructor(props) {
        super(props);
    }

    renderPhoneLayout() {
        if (Identify.isEmpty(this.props.data)) {
            return (null);
        } else {
            return (
                <Container style={{ backgroundColor: variable.appBackground }}>
                    <Content>
                        {this.renderLayoutFromConfig('matrix_layout', 'content')}
                    </Content>
                    {this.renderLayoutFromConfig('matrix_layout', 'container')}
                </Container>
            );
        }
    }
}
const mapStateToProps = (state) => {
    return { data: state.redux_data.home_data };
}
export default connect(mapStateToProps)(Matrix);
