import React from 'react';
import { Spinner, View } from 'native-base';
import { Modal } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';
import Identify from '../../../helper/Identify';

class SpinnerApp extends React.Component {

    constructor(props) {
        super(props);
    }

    renderLoading() {
        let loadingColor = Identify.theme && Identify.theme.loading_color ? Identify.theme.loading_color : '#ab452f';
        return (
            <Modal onRequestClose={() => null} visible={true} transparent={true}>
                <View style={styles.container}>
                    <View style={(this.props.showLoading.type === 'full') ? styles.fullSpinnerContainer : styles.dialogSpinnerContainer}>
                        <Spinner color={loadingColor} style={this.props.showLoading.style} />
                    </View>
                </View>
            </Modal>
        );
    }

    render() {
        if (this.props.showLoading.type !== 'none') {
            return (
                <View>
                    {this.renderLoading()}
                </View>
            );
        } else {
            return (
                <View />
            );
        }
    }
}

const mapStateToProps = state => ({
    showLoading: state.redux_data.showLoading
});

export default connect(mapStateToProps, null)(SpinnerApp);
