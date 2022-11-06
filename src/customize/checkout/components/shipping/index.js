import React from 'react'
import { View, Text } from 'react-native'
import { RadioButton, RadioGroup } from 'react-native-flexi-radio-button';
import Identify from '@helper/Identify';
import ModalStore from '../../../customer/components/store/modalstore'
import { styles } from './styles'

export default class ShippingMethod extends React.Component {
    constructor(props) {
        super(props);
        this.list = this.props.list ? this.props.list : this.props.parent.list;
        this.state = {
            selected: this.props.parent.state.selectedShippingMethod,
            visibleModal: false,
            storeSelected: this.props.parent.selectedStore
        }
    }

    setShippingMethod = (item) => {
        this.setState({ storeSelected: item, visibleModal: false });
        this.props.parent.addSelectedStore(item)
    }

    onSelect(value) {
        this.setState({ selected: value }, () => {
            this.props.parent.handleShippingMethod(value)
            if (this.state.selected === 1) {
                this.setState({ visibleModal: true })
            } else {
                this.setState({ storeSelected: null });
                this.props.parent.addSelectedStore(null)
                this.props.parent.hideValidate()
            }
        });
    }

    hideModal = () => {
        this.setState({ visibleModal: false, selected: 0 })
    }

    renderRadioGroup() {
        let items = []
        let dataSource = []

        if (this.props.parent.enableCC) {
            dataSource = [
                { label: Identify.__('Home Delivery') },
                { label: Identify.__('Click & Collect') }
            ]
        } else {
            dataSource = [
                { label: Identify.__('Home Delivery') }
            ]
        }

        for (let index in dataSource) {
            let item = dataSource[index];
            items.push(
                <RadioButton
                    key={Identify.makeid()}
                    value={index}
                    color='#E4531A'
                >
                    <Text>{item.label}</Text>
                </RadioButton>
            );
        }

        return (
            <RadioGroup
                color='#E4531A'
                ref={(radio) => this.Radio = radio}
                style={{
                    paddingTop: 5,
                    position: 'relative',
                    left: 2
                }}
                selectedIndex={this.state.selected}
                onSelect={(index, value) => this.onSelect(index, value)}
            >
                {items}
            </RadioGroup>
        );
    }

    render() {
        const { selected, storeSelected, visibleModal } = this.state
        return (
            <>
                <View style={styles.container}>
                    <Text style={styles.title}>{Identify.__('Shipping Method')}</Text>
                    {this.renderRadioGroup()}
                    {storeSelected && this.props.parent.enableCC ? <Text style={styles.name}>{storeSelected.name}</Text> : null}
                </View>
                {selected === 1 ?
                    <ModalStore
                        visible={visibleModal}
                        closeModal={this.hideModal}
                        screen='cart'
                        list={this.list}
                        handlePickStore={this.setShippingMethod}
                    />
                    : null}
            </>
        );
    }
}