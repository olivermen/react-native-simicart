import React from 'react';
import { Text, Button, View, Input, Item, Toast, Picker, Icon, Header, Left, Right, Body, Title } from 'native-base';
import { TouchableOpacity } from 'react-native'
import Identify from '@helper/Identify';
import NewConnection from '@base/network/NewConnection';
import Events from '@helper/config/events';
import { quoteitems, onepage } from '@helper/constants';
import { connect } from 'react-redux'
import material from '@theme/variables/material';
import NavigationManager from '@helper/NavigationManager';

class Giftcode extends React.Component {

    constructor(props) {
        super(props)
        this.parent = this.props.parent;

        let hasGiftCode = false;
        this.giftCode = {};
        if (this.props.is_cart) {
            hasGiftCode = this.parent.props.data.total.gift_codes && this.parent.props.data.total.gift_codes.length > 0 ? true : false;
            this.giftCode = this.parent.props.data.total.gift_codes && this.parent.props.data.total.gift_codes.length > 0 ? this.parent.props.data.total.gift_codes : null
        } else {
            hasGiftCode = this.parent.props.data.order.gift_codes && this.parent.props.data.order.total.gift_codes.length > 0 ? true : false;
            this.giftCode = this.parent.props.data.order.gift_codes && this.parent.props.data.order.total.gift_codes.length > 0 ? this.parent.props.data.order.total.gift_codes : null
        }
        this.state = {
            expand: hasGiftCode,
            giftCodeEditing: '',
            mygiftcards: null
        }
    }

    setData(data, requestId) {
        if (requestId == 'mygiftcards') {
            this.setState({
                mygiftcards: data.giftvouchers
            });
        } else {
            data['reload_data'] = true;
            this.parent.setData(data);
            if (this.props.is_cart) {
                this.giftCode = data.total.gift_codes.length > 0 ? data.total.gift_codes : null;
            } else {
                this.giftCode = data.order.total.gift_codes.length > 0 ? data.order.total.gift_codes : null;
            }
            this.setState({ giftCodeEditing: '' });
        }
    }

    requestApplyGiftCode = (giftCode) => {
        this.props.storeData('showLoading', { type: 'dialog' });
        new NewConnection()
            .init(this.props.is_cart ? quoteitems : onepage, 'apply_giftcode', this, 'PUT')
            .addBodyData({
                gift_code: giftCode
            })
            .connect();

        this.props.storeData('showLoading', { type: 'none' });
    }

    applyGiftCode() {
        if (this.state.giftCodeEditing === '') {
            Toast.show({ text: Identify.__('Please enter gift code'), textStyle: { fontFamily: material.fontFamily } })
        } else {
            this.requestApplyGiftCode(this.state.giftCodeEditing);
        }
    }

    removeGiftCode(code) {
        this.props.storeData('showLoading', { type: 'dialog' });
        new NewConnection()
            .init(this.props.is_cart ? quoteitems : onepage, 'remove_giftcode', this, 'PUT')
            .addBodyData({
                gift_code: code,
                is_remove: true
            })
            .connect();
    }

    onSelectGiftCode = (value) => {
        this.requestApplyGiftCode(value);
    }

    componentDidUpdate(nextProps, nextState) {
        let nextPropsTotal = this.props.is_cart ? nextProps.parent.props.data.total : nextProps.parent.props.data.order.total;
        if (nextPropsTotal.gift_codes && nextPropsTotal.gift_codes.length && !this.state.expand) {
            this.setState({
                expand: true,
                giftCodeEditing: ''
            })
        }
    }

    componentDidMount() {
        if (Identify.getCustomerData()) {
            new NewConnection()
                .init('simiconnector/rest/v2/mygiftcards', 'mygiftcards', this)
                .addGetData({ limit: 100 })
                .connect();
        }
    }

    renderMyGiftCodeItems = (giftCodes) => {
        return giftCodes.map(item => {
            return (
                <Picker.Item
                    style={{ fontFamily: material.fontFamily }}
                    key={item.voucher_id}
                    value={item.gift_code}
                    label={item.gift_code_hide}
                    color={material.textColor} />
            );
        })
    }

    renderSelectGiftCode = () => {
        if (!this.state.mygiftcards || this.state.mygiftcards.length == 0) {
            return null;
        }

        let availableGifCode = [];
        if (this.giftCode) {
            this.state.mygiftcards.forEach(element => {
                const codeApplied = this.giftCode.find(applied => applied.code == element.gift_code);
                if (!codeApplied) {
                    availableGifCode.push(element)
                }
            });
        } else {
            availableGifCode = this.state.mygiftcards;
        }

        if (!availableGifCode || availableGifCode.length == 0) {
            return null;
        }

        return (
            <View>
                <Text style={{ marginTop: 15 }}>{Identify.__('or Select an existing gift card code')}</Text>
                <Picker
                    renderHeader={backAction =>
                        <Header style={{
                            backgroundColor: Identify.theme.app_background,
                            elevation: 0,
                            height: this.toolbarHeight,
                            paddingTop: this.paddingTop
                        }}>
                            <Left>
                                <Button transparent onPress={backAction}>
                                    <Icon name={"md-close"} style={{ color: Identify.theme.textColor }} />
                                </Button>
                            </Left>
                            <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                                <Title style={{ color: Identify.theme.textColor }}>{Identify.__('Select a gift code')}</Title>
                            </Body>
                            <Right />
                        </Header>}
                    mode="dropdown"
                    iosIcon={<Icon name="ios-arrow-down" style={{ color: material.textColor }} />}
                    selectedValue={''}
                    onValueChange={this.onSelectGiftCode}
                    style={{ width: '70%', borderWidth: 1, borderColor: '#EAEAEA' }}
                    itemTextStyle={{ color: material.textColor, fontFamily: material.fontFamily }}
                    textStyle={{ color: material.textColor, fontFamily: material.fontFamily }}>
                    <Picker.Item
                        style={{ fontFamily: material.fontFamily }}
                        key={1231321}
                        value={''}
                        label={Identify.__('Please select')}
                        color={material.textColor} />
                    {this.renderMyGiftCodeItems(availableGifCode)}
                </Picker>
            </View>
        );
    }

    render() {
        if (!Identify.getCustomerData()) {
            return null;
        }
        const appliedGiftCode = this.giftCode ? this.giftCode.map(item => <View style={{ marginTop: 15 }} key={item.code}>
            <Text style={{ color: '#39A935', fontFamily: material.fontBold }}>{item.code}</Text>
            <View style={{ flexDirection: 'row' }}>
                <Item regular style={{ flex: 7, marginRight: 10, marginLeft: 0, height: 50, borderRadius: 5, borderWidth: 2, borderColor: '#EAEAEA', backgroundColor: 'white' }}>
                    <Input
                        disabled={true}
                        style={{ paddingStart: 10 }}
                        editable={false}
                        value={item.discount} />
                </Item>
                <TouchableOpacity
                    style={{ flex: 3, borderRadius: 8, height: 50, backgroundColor: 'white', borderWidth: 1, borderColor: 'black', alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => this.removeGiftCode(item.code)}>
                    <Text style={{ fontFamily: material.fontBold, color: 'black' }}>{Identify.__('Remove')}</Text>
                </TouchableOpacity>
            </View>
        </View>) : null;

        const enterGiftCode = (
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                <Item regular style={{ flex: 7, marginRight: 10, marginLeft: 0, height: 50, borderRadius: 5, borderWidth: 2, borderColor: '#EAEAEA', backgroundColor: 'white' }}>
                    <Input
                        style={{ paddingStart: 10 }}
                        placeholder={Identify.__('Enter your gift code')}
                        placeholderTextColor={Identify.hexToRgb(material.textColor, 0.65)}
                        onChangeText={(code) => this.state.giftCodeEditing = code}
                        defaultValue={this.state.giftCodeEditing} />
                </Item>
                <Button
                    style={{ flex: 3, borderRadius: 8, height: 50, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => this.applyGiftCode()}>
                    <Text style={{ textAlign: 'center', fontFamily: material.fontBold }}>{Identify.__('Apply')}</Text>
                </Button>
            </View>
        );

        const existGiftCode = this.renderSelectGiftCode();

        return (
            <View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                    onPress={() => {
                        this.setState(oldState => {
                            return {
                                expand: !oldState.expand
                            }
                        })
                    }}
                >
                    <Text style={{ fontFamily: material.fontBold, fontSize: 18 }}>
                        {Identify.__('Gift Card')}
                    </Text>
                    {this.state.expand
                        ? <Icon style={{ fontSize: 18, color: '#c3c3c3' }} name="ios-arrow-up" />
                        : <Icon style={{ fontSize: 18, color: '#c3c3c3' }} name="ios-arrow-down" />}
                </TouchableOpacity>
                {this.state.expand && <>
                    {appliedGiftCode}
                    {enterGiftCode}
                    {existGiftCode}
                    <Text style={{ marginTop: 15 }}>
                        {Identify.__('To manage your gift cards, please click')} <Text style={{ color: '#096BB3', textDecorationLine: 'underline' }} onPress={() => NavigationManager.openPage(this.parent.props.navigation, 'MyGiftcard')}>{Identify.__('here')}</Text>
                    </Text>
                </>}
            </View>
        )
    }

}

const mapStateToProps = (state) => {
    return { loading: state.redux_data.showLoading };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Giftcode);