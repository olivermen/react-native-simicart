import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Button } from 'native-base'
import { connect } from 'react-redux';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import SimiPageComponent from '@base/components/SimiPageComponent';

class NewsletterPage extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            isShow: false,
            selected: false
        }
    }

    componentDidMount() {
        if (this.props.data.news_letter === '1') {
            this.setState({ selected: true })
        }
    }

    handleSave = () => {
        if (this.state.selected) {
            this.props.storeData('showLoading', { type: 'dialog' });
            new NewConnection()
                .init('simiconnector/rest/v2/newsletters', 'subscribe', this, 'POST')
                .addBodyData({
                    email: this.props.data.email
                })
                .connect();
        } else {
            this.props.storeData('showLoading', { type: 'dialog' });
            new NewConnection()
                .init('simiconnector/rest/v2/newsletters', 'unsubscribe', this, 'POST')
                .addBodyData({
                    email: this.props.data.email,
                    unsubscribe: "1"
                })
                .connect();
        }
    }

    setData(data, requestId) {
        if (requestId === 'subscribe') {
            this.props.storeData('showLoading', { type: 'none' });
            if (data && data.success) {
                this.props.storeData('customer_data', {
                    ...this.props.data,
                    news_letter: '1'
                });
                this.showNoti()
            }
        } else {
            this.props.storeData('showLoading', { type: 'none' });
            if (data && data.success) {
                this.props.storeData('customer_data', {
                    ...this.props.data,
                    news_letter: '0'
                });
                this.showNoti()
            }
        }
    }

    showNoti = () => {
        this.setState({ isShow: true }, () => {
            setTimeout(() => {
                NavigationManager.backToPreviousPage(this.props.navigation);
            }, 3000)
        });
    }

    selectedCheckbox = () => {
        this.setState(prevState => ({ selected: !prevState.selected }))
    }

    renderPhoneLayout() {
        const { isShow, selected } = this.state
        const container = {
            height: 50,
            backgroundColor: '#D4F6D2',
            borderWidth: 1,
            borderColor: '#39A935',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            marginTop: 20
        }

        return (
            <View style={{ paddingHorizontal: 12 }}>
                {isShow
                    ? <View style={container}>
                        <Text style={{ fontSize: 16 }}>{Identify.__('Your preferences have been updated')}</Text>
                    </View>
                    : null
                }
                <Text style={{ fontSize: 20, fontWeight: '600', paddingTop: 30 }}>{Identify.__('Newsletter Subscription')}</Text>
                <Text style={{ fontSize: 16, paddingTop: 10, paddingBottom: 20 }}>{Identify.__('Subscription option')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={this.selectedCheckbox}>
                        <Image
                            source={selected ? require('../../icon/ic_checked.png') : require('../../icon/ic_uncheck.png')}
                            style={{ width: 20, height: 20, marginRight: 16, tintColor: selected ? '#E4531A' : 'black' }}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontWeight: '500' }}>{Identify.__('General Subscription')}</Text>
                </View>
                <Button style={{ width: '40%', height: 50, borderRadius: 8, marginTop: 30 }}
                    full
                    onPress={this.handleSave}>
                    <Text style={{ fontSize: 16, fontFamily: material.fontBold, color: '#fff' }}>{Identify.__('Save')}</Text>
                </Button>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.customer_data };
}

//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsletterPage);