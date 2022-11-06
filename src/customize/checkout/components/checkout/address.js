import React from 'react';
import {
    TouchableOpacity, View, Modal, ScrollView, TextInput, Text, Image
} from 'react-native';
import { Icon, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { RadioButton, RadioGroup } from 'react-native-flexi-radio-button';
import Identify from '@helper/Identify';
import { onepage } from '@helper/constants';
import { addresses } from "@helper/constants";
import material from '@theme/variables/material';
import ButtonAddAddress from './ButtonAddAddress';
import NewConnection from '@base/network/NewConnection';
import AddressFrom from '../../../customer/components/address/addressform';
import ModalStore from '../../../customer/components/store/modalstore'
import { styles } from './styles';

class AddressCheckout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            showPopup: false,
            enableButton: false,
            buttonLoading: false,
            address: {},
            selectedTab: this.props.parent.state.selectedMode ? this.props.parent.state.selectedMode : 0,
            visible: false,
            selectedStore: this.props.parent.store,
            selectedPickup: 0,
            form: {
                name: '',
                phone: '',
                email: '',
                err: false
            },
            showInfoPickup: false
        }
        this.loadingColor = Identify.theme && Identify.theme.loading_color ? Identify.theme.loading_color : '#ab452f';
    }

    componentDidMount() {
        if (!this.checkExistData()) {
            this.getListAddresses();
        }
        if (this.state.selectedStore) {
            this.setSelectedStore(this.state.selectedStore)
        }
    }

    checkExistData() {
        if (this.props.addressBook.addresses !== undefined) {
            return true;
        }
        return false;
    }

    getListAddresses() {
        new NewConnection()
            .init(addresses, 'get_address_data', this)
            .addGetData({
                limit: 100,
                offset: 0,
                dir: 'desc'
            })
            .connect();
    }

    setData(data, requestID) {
        if (requestID == 'get_address_data') {
            this.props.storeData('address_book_data', data);
        } else if (requestID == 'add_new_address_normal') {
            this.setState({
                showPopup: false,
                enableButton: false,
                buttonLoading: false,
                address: {}
            });
            this.props.parent.onChangeAddress(data.Address.entity_id);
            this.getListAddresses();
            setTimeout(() => {
                this.props.parent.scrollViewRef.scrollTo({ x: 0, y: 0, animated: true });
            }, 500);
        } else if (requestID == 'set_click_collect') {
            this.props.parent.onChangeClickCollect(data.order.billing_address.entity_id, data.order.billing_address.entity_id);
            // this.props.parent.onChangeClickCollect(data.order.billing_address.entity_id, data.order.shipping_address.entity_id);
            this.props.parent.onSaveMethod({
                s_method: {
                    method: 'clickandcollect_clickandcollect'
                }
            });
        }
    }

    checkVirtual() {
        let list = this.props.list ? this.props.list : this.props.parent.list;
        let isVirtual = true;
        if (list && list.length > 0) {
            for (let i in list) {
                if (!list[i]['is_virtual'] || !Identify.TRUE(list[i]['is_virtual'])) {
                    isVirtual = false;
                    break;
                }
            }
        }
        return isVirtual;
    }

    handleTabs = (tab) => {
        this.setState({ selectedTab: tab });
        this.props.parent.handleShippingMode(tab)
    }

    handleModal = (type) => {
        if (type === 'open') {
            this.setState({ visible: true });
        } else if (type === 'close') {
            this.setState({ visible: false })
        }
    }

    convertDate = (type) => {
        let date = new Date()
        if (type === 'datetime') {
            return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + (date.getHours())).slice(-2) + ':' + ('0' + (date.getMinutes())).slice(-2) + ':' + ('0' + (date.getSeconds())).slice(-2)
        } else {
            return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
        }
    }

    setSelectedStore = (item) => {
        let params = {};
        params['s_method'] = {}
        params['s_method']['method'] = 'clickandcollect'
        newConnection = new NewConnection();
        newConnection.init(onepage, 'set_click_collect', this, 'PUT')
        if (Identify.TRUE(Identify.getMerchantConfig().storeview.checkout.enable_address_params)) {
            params = {
                ...params,
                b_address: item,
                s_address: {
                    ...item,
                    location_pickup_id: parseInt(item.location_id),
                    pickup_date_time: this.convertDate('datetime'),
                    pickup_date_only: this.convertDate('date')
                }
            }
        }
        if (params) {
            newConnection.addBodyData(params);
        }
        newConnection.connect();

        this.setState({ selectedStore: item, visible: false });
        this.props.parent.handleSelectStore(item)
        this.props.parent.getNotiStockProduct(item.stock_id, this.props.parent.list)
    }

    onSelect(value) {
        this.setState({ selectedPickup: value });
    }

    getFieldLabel(code, value) {
        const custom_field_config = Identify.getMerchantConfig().storeview.custom_field_config;
        let label = null;
        try {
            custom_field_config.forEach(field => {
                if (field.code == code) {
                    const options = field.options;
                    options.forEach(element => {
                        if (element.value == value) {
                            label = element.label;
                        }
                    });
                }
            });
        } catch (err) {
            return label;
        }
        return label;
    }

    updateButtonStatus(status) {
        if (this.buttonSave) {
            this.buttonSave.updateButtonStatus(status);
        }
    }

    savePickup = () => {
        const { name, phone, email } = this.state.form
        this.props.parent.onSavePickupInfo(name, phone, email);
        this.setState({ showInfoPickup: true })
    }

    handleChangeTxt = (name, value) => {
        let form = { ...this.state.form, [name]: value };
        this.setState({ form })
    }

    addNewAddress = () => {
        this.addressData = this.addressForm.getAddressData();
        let countryStateData = this.addressData.country_state;
        this.addressData = {
            ...this.state.address,
            ...this.addressData,
            ...countryStateData
        }
        delete this.addressData.country_state;

        this.setState({ buttonLoading: true })
        new NewConnection()
            .init(addresses, 'add_new_address_normal', this, 'POST')
            .addBodyData(this.addressData)
            .connect();
    }

    createListAddress() {
        if (!this.props.addressBook) {
            return null;
        }
        const shippingAddress = this.props.orderData.order.shipping_address;
        let addresses = [shippingAddress];
        this.props.addressBook.addresses.forEach(element => {
            if (element.entity_id != shippingAddress.entity_id) {
                addresses.push(element)
            }
        });
        return addresses;
    }

    renderAddressBook = () => {
        const loading = (
            <View style={{ width: '100%', height: 200, alignItems: 'center', justifyContent: 'center' }}>
                <Spinner color={this.loadingColor} />
            </View>
        );
        const listAddresses = this.createListAddress();
        const addresses = this.props.addressBook ? listAddresses.map(item => {
            return (
                <TouchableOpacity
                    style={{ paddingVertical: 15, marginHorizontal: 20, borderBottomWidth: (listAddresses.indexOf(item) < listAddresses.length - 1) ? 1 : 0, borderColor: '#D8D8D8' }}
                    key={item.entity_id}
                    onPress={() => {
                        this.setState({ expanded: false })
                        if (listAddresses.indexOf(item) != 0) {
                            this.props.parent.onChangeAddress(item.entity_id)
                        }
                    }}>
                    <Text style={{ textAlign: 'left' }}>{item.firstname} {item.lastname}</Text>
                    <Text style={{ textAlign: 'left' }}>{item.email}</Text>
                    <Text style={{ textAlign: 'left' }}>{item.block_number}, {item.house_building_number}, {this.getFieldLabel('address_types', item.address_types)}, {this.getFieldLabel('area', item.area)}</Text>
                    <Text style={{ textAlign: 'left' }}>{item.telephone}</Text>
                    {listAddresses.indexOf(item) == 0 && <Icon
                        style={{ fontSize: 18, color: '#E4531A', position: 'absolute', right: 0, top: '50%' }}
                        name={"ios-arrow-up"} />}
                </TouchableOpacity>
            );
        }) : null;
        return (
            <View style={{ width: '100%', borderRadius: 8, borderWidth: Identify.isRtl() ? 2 : 1, borderColor: '#E4531A', position: 'absolute', top: 25, left: 15, right: 15, backgroundColor: 'white' }}>
                {!this.checkExistData() ? loading : <View>
                    {addresses}
                    <TouchableOpacity
                        style={{ width: '100%', padding: 15, backgroundColor: '#FAFAFA', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
                        onPress={() => this.setState({ expanded: false, showPopup: true })}>
                        <Text style={{ fontSize: 16, color: '#E4531A', fontFamily: material.fontBold, textAlign: 'left' }}>{Identify.__('New Address')}</Text>
                    </TouchableOpacity>
                </View>}
            </View>
        );
    }

    renderAddress = () => {
        let shippingAddress = this.props.orderData.order.shipping_address;
        if (!shippingAddress || shippingAddress.firstname == null) {
            return (
                <View>
                    <AddressFrom
                        key="address_form"
                        onRef={ref => (this.addressForm = ref)}
                        mode="add_new_address_detail"
                        parent={this} />
                    <View style={{ marginTop: 30, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }} />
                        <ButtonAddAddress parent={this} onRef={ref => (this.buttonSave = ref)} />
                    </View>
                </View>
            );
        }
        return (
            <TouchableOpacity
                style={{ width: '100%', backgroundColor: '#FAFAFA', borderRadius: 8, borderWidth: 1, borderColor: '#D8D8D8', paddingLeft: 15, paddingVertical: 20, paddingRight: 40 }}
                onPress={() => this.setState({ expanded: true })}>
                <Text style={{ textAlign: 'left' }}>{shippingAddress.firstname} {shippingAddress.lastname}</Text>
                <Text style={{ textAlign: 'left' }}>{shippingAddress.email}</Text>
                <Text style={{ textAlign: 'left' }}>{shippingAddress.block_number}, {shippingAddress.house_building_number}, {this.getFieldLabel('address_types', shippingAddress.address_types)}, {this.getFieldLabel('area', shippingAddress.area)}</Text>
                <Text style={{ textAlign: 'left' }}>{shippingAddress.telephone}</Text>
                <Icon
                    style={{ fontSize: 18, color: 'black', position: 'absolute', right: 23, top: '50%' }}
                    name={this.state.expanded ? "ios-arrow-up" : "ios-arrow-down"} />
            </TouchableOpacity>
        );
    }

    renderContentAddress = () => {
        const { selectedTab, expanded, selectedStore, form, selectedPickup, showInfoPickup } = this.state
        if (selectedTab === 0) {
            return (
                <>
                    {this.renderAddress()}
                    {expanded && this.renderAddressBook()}
                </>
            )
        } else {
            return (
                <>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', paddingBottom: 9.5 }}>{Identify.__('Store')}</Text>
                    <View style={styles.line} />
                    {selectedStore ?
                        <>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', paddingBottom: 12 }}>{Identify.__(selectedStore.name)}</Text>
                            <Text style={{ paddingBottom: 6 }}>{Identify.__(selectedStore.street)}</Text>
                            <Text style={{ paddingBottom: 20 }}>{Identify.__(selectedStore.telephone)}</Text>
                            <TouchableOpacity style={[styles.btnSelectBtn, { width: '52%', marginBottom: 15 }]} onPress={() => this.handleModal('open')}>
                                <Text style={{ fontWeight: '500' }}>{Identify.__('Choose another store')}</Text>
                            </TouchableOpacity>
                            <View style={styles.line} />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 6 }}>{Identify.__('Choose someone to pick up the order')}</Text>
                            {this.renderPickupRadioGroup()}
                            {selectedPickup === 1 ?
                                (showInfoPickup ?
                                    <>
                                        <View style={styles.pickupContainer}>
                                            <Text style={{ paddingBottom: 6 }}>{Identify.__(form.name)}</Text>
                                            <Text>{Identify.__(form.phone)}</Text>
                                        </View>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }} onPress={() => this.setState({ showInfoPickup: false })}>
                                            <Text style={{ color: '#E4531A', paddingRight: 4, fontWeight: '500' }}>
                                                {Identify.__('EDIT')}
                                            </Text>
                                            <Image source={require('../../../customer/components/myaccount/icon-edit.png')} style={{ width: 20, height: 21 }} />
                                        </TouchableOpacity>
                                    </> :
                                    <>
                                        {this.renderFormPickup('Name', form.name, 'name', require)}
                                        {this.renderFormPickup('Mobile Number', form.phone, 'phone', require)}
                                        {this.renderFormPickup('Email', form.email, 'email')}
                                        <Button full style={styles.btnSave} onPress={this.savePickup}>
                                            <Text style={{ fontSize: 16, fontFamily: material.fontBold, color: '#fff' }}>{Identify.__('Save')}</Text>
                                        </Button>
                                    </>
                                )
                                : null
                            }
                        </>
                        :
                        <TouchableOpacity style={styles.btnSelectBtn} onPress={() => this.handleModal('open')}>
                            <Text style={{ fontWeight: '500' }}>{Identify.__('Select Store')}</Text>
                        </TouchableOpacity>}
                </>
            )
        }
    }

    renderPickupRadioGroup() {
        let items = []
        let dataSource = [
            { label: 'Self Pick-up' },
            { label: 'Other' }
        ]
        for (let index in dataSource) {
            let item = dataSource[index];
            items.push(
                <RadioButton
                    key={Identify.makeid()}
                    value={index}
                    color='#E4531A'
                >
                    <Text style={styles.txt16Bold}>{item.label}</Text>
                </RadioButton>
            );
        }

        return (
            <RadioGroup
                color='#E4531A'
                ref={(radio) => this.Radio = radio}
                style={{ flexDirection: 'row', marginBottom: this.state.selectedPickup === 1 ? 20 : 0 }}
                selectedIndex={this.state.selectedPickup}
                onSelect={(index, value) => this.onSelect(index, value)}
            >
                {items}
            </RadioGroup>
        );
    }

    renderFormPickup = (title, value, name, require = false) => {
        return (
            <View style={{ marginBottom: 18 }}>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <Text>{Identify.__(title)}</Text>
                    {require ? <Text style={{ color: '#D51C17', marginLeft: 2 }}>*</Text> : null}
                </View>
                <TextInput
                    style={[styles.input, { borderColor: this.state.form.err && !value && require ? '#D51C17' : '#C5CBD5' }]}
                    value={value}
                    onChangeText={(text) => this.handleChangeTxt(name, text)}
                />
            </View>
        )
    }

    render() {
        const { selectedTab, visible } = this.state
        let list = this.props.list ? this.props.list : this.props.parent.list;
        const { enableCC } = this.props.parent

        if (this.checkVirtual()) {
            return null;
        }
        return (
            <>
                <View style={{ marginHorizontal: 12, elevation: 10, zIndex: 9999 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 16 }}>
                        <Text style={{ fontSize: 18, color: 'white', backgroundColor: 'black', width: 32, height: 32, textAlign: 'center', fontFamily: material.fontBold, paddingTop: 6, borderRadius: 16 }}>{Identify.__('1')}</Text>
                        <Text style={{ fontFamily: material.fontBold, flex: 1, textAlign: 'left', fontSize: 18, marginLeft: 20 }}>{Identify.__("Delivery Address")}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            onPress={() => this.handleTabs(0)}
                            style={[styles.tab, { backgroundColor: selectedTab === 0 ? '#fff' : '#FAFAFA', borderBottomColor: selectedTab === 0 ? '#fff' : '#D8D8D8' }]}
                        >
                            <View style={[styles.checkbox, { borderColor: selectedTab === 0 ? '#E4531A' : '#BABABA' }]}>
                                {selectedTab === 0 ? <View style={styles.dot} /> : null}
                            </View>
                            <Text style={{ fontSize: 18, fontFamily: material.fontBold, marginTop: 12 }}>{Identify.__('Home Delivery')}</Text>
                        </TouchableOpacity>
                        <View style={{ width: '1%', borderBottomWidth: 1, borderBottomColor: '#D8D8D8' }} />
                        {enableCC ?
                            <TouchableOpacity
                                onPress={() => this.handleTabs(1)}
                                style={[styles.tab, { backgroundColor: selectedTab === 1 ? '#fff' : '#FAFAFA', borderBottomColor: selectedTab === 1 ? '#fff' : '#D8D8D8' }]}
                            >
                                <View style={[styles.checkbox, { borderColor: selectedTab === 1 ? '#E4531A' : '#BABABA' }]}>
                                    {selectedTab === 1 ? <View style={styles.dot} /> : null}
                                </View>
                                <Text style={{ fontSize: 18, fontFamily: material.fontBold, marginTop: 12 }}>{Identify.__('Click & Collect')}</Text>
                            </TouchableOpacity> :
                            <View style={styles.noneTab}></View>
                        }
                    </View>
                    <View style={[styles.content, { borderTopRightRadius: enableCC ? 0 : 8 }]}>
                        {this.renderContentAddress()}
                    </View>
                </View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showPopup}
                    onRequestClose={() => {
                        console.log('Modal has been closed.');
                    }}>
                    <View style={{ flex: 1, paddingVertical: 50, paddingHorizontal: 20, backgroundColor: 'rgba(0,0,0,0.3)' }}>
                        <View style={{
                            flex: 1,
                            backgroundColor: 'white',
                            borderRadius: 8,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.20,
                            shadowRadius: 1.41,
                            elevation: 2,
                            padding: 20
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ fontSize: 20, fontFamily: material.fontBold }}>{Identify.__('New Delivery Address')}</Text>
                                <Icon name="md-close" style={{ fontSize: 22 }} onPress={() => this.setState({ showPopup: false })} />
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                                <View style={{ flex: 1 }}>
                                    <AddressFrom
                                        key="address_form"
                                        onRef={ref => (this.addressForm = ref)}
                                        mode="add_new_address_detail"
                                        parent={this} />
                                    <View style={{ marginTop: 30, flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            style={{ flex: 1, height: 50, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}
                                            onPress={() => this.setState({ showPopup: false })}>
                                            <Text
                                                style={{ fontSize: 15, fontFamily: material.fontBold }}
                                                numberOfLines={1}
                                                ellipsizeMode='tail'>
                                                {Identify.__('Cancel')}
                                            </Text>
                                        </TouchableOpacity>
                                        <ButtonAddAddress parent={this} onRef={ref => (this.buttonSave = ref)} />
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <ModalStore
                    visible={visible}
                    closeModal={() => this.handleModal('close')}
                    screen='checkout'
                    list={list}
                    handlePickStore={this.setSelectedStore}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addressBook: state.redux_data.address_book_data,
        orderData: state.redux_data.order_review_data,
    };
}

//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressCheckout);
