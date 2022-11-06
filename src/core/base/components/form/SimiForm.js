import React from 'react';
import { Form, Toast } from 'native-base';
import Identify from "@helper/Identify";
import material from "@theme/variables/material";

export default class SimiForm extends React.Component {

    constructor(props) {
        super(props);
        this.validateStatus = {};
        this.listRefs = {};
        this.formSize = 0;
        this.address_option = Identify.getMerchantConfig().storeview.customer.address_option;
    }
    componentWillMount() {
        if (JSON.stringify(this.props.parent.state) !== JSON.stringify(this.props.initData)) {
            this.props.parent.setState({ ...this.props.parent.state, ...this.props.initData })
        }
    }
    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }
    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined)
        }
    }

    updateFormData(key, value, validated) {
        this.props.parent.state[key] = value
        this.validateStatus[key] = validated
        this.checkButtonStatus();
    }

    checkButtonStatus() {
        let buttonStatus = true;
        if (Object.keys(this.validateStatus).length < this.formSize) {
            buttonStatus = false;
        } else {
            for (let key in this.validateStatus) {
                let status = this.validateStatus[key];
                if (status === false) {
                    buttonStatus = false;
                    break;
                }
            }
        }
        this.props.parent.updateButtonStatus(buttonStatus);
    }

    initFields() {
        let newFields = [];
        let fields = this.props.fields;
        this.formSize = fields.length;
        for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            if (Object.keys(this.validateStatus).length < this.formSize) {
                let validated = false;
                if (!field.props.required || (field.props.required && field.props.inputValue)) {
                    validated = true;
                }
                this.validateStatus[field.props.inputKey] = validated;
            }
            newFields.push(React.cloneElement(field, { parent: this }));
        }
        return newFields;
    }

    render() {
        this.validateStatus = {};
        return (
            <Form>
                {this.initFields()}
            </Form>
        );
    }

    getFormData() {
        return this.props.parent.state;
    }

    setFormData(data) {
        this.props.parent.state = data;
    }
}