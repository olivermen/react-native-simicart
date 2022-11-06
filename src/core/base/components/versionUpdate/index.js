import React from 'react'
import {Text, View, H3, Button} from 'native-base'
import {Modal, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import material from '../../../../../native-base-theme/variables/material';
import {connect} from 'react-redux'
import Identify from "../../../helper/Identify";

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#00000033',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dialog: {
        position: 'absolute',
        zIndex: 9999,
        width: scale(260),
        alignItems: 'center',
        alignSelf: 'baseline',
        backgroundColor: 'white',
        paddingLeft: scale(15),
        paddingRight: scale(15),
        paddingTop: verticalScale(15),
        marginLeft: material.deviceWidth < material.deviceHeight ? (material.deviceWidth - scale(260)) / 2 : (material.deviceHeight - scale(260))/2,
        borderRadius: 10
    },
})
class VersionUpdate extends React.Component{
    constructor(props){
        super(props)
    }
    handleCloseUpdate(){
        this.props.storeData('showUpdate', {show: false})
    }
    render(){
        if(this.props.data.show === true){
            return(
                <View>
                    <Modal onRequestClose={() => null} visible={true} transparent={true} animationType="fade">
                        <View activeOpacity={1} style={styles.container}>
                            <View style={styles.dialog}>
                                <H3 style={{color: Identify.theme.button_background, marginBottom: 15}}>{Identify.__('Update is available')}</H3>
                                <Text style={{fontSize: 13}}>{Identify.__('A new version has been released. Please update to use the app')}</Text>
                                <View
                                >
                                    <Button
                                        style={{marginTop: 15}}
                                        transparent
                                        title={Identify.__('Update now')}
                                        onPress={() => {Linking.openURL(this.props.data.urlApp)}}
                                    >
                                        <Text style={{color: Identify.theme.button_background, fontWeight: '900'}}>{Identify.__('Update now')}</Text>
                                    </Button>
                                </View>
                            </View>
                            <TouchableOpacity style={{flexGrow: 1, width: '100%'}} onPress={() => {this.handleCloseUpdate()}}/>
                        </View>
                    </Modal>
                </View>
            )
        }
        return null;
    }
}
const mapStateToProps = state => ({
    data: state.redux_data.showUpdate
});

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (data) => {
            dispatch({ type: 'showUpdate', data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VersionUpdate);