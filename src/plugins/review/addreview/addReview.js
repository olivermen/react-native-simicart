import React from 'react';
import SimiPageComponent from "@base/components/SimiPageComponent";
import { Text, Content, Container, View, Input, Button, Textarea, Toast, Icon } from 'native-base';
import { StyleSheet } from 'react-native';
import Identify from "@helper/Identify";
import NewConnection from '@base/network/NewConnection'
import NavigationManager from "@helper/NavigationManager";
import { review_product } from "../../constants";
import StarContainer from './component/StarsContainer';
import material from '@theme/variables/material';

const styles = StyleSheet.create({
    oneRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '80%',
        marginTop: 10
    },
    itemFlex: {
        paddingTop: 5
    },
    input: {
        borderColor: '#D8D8D8',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 6,
        marginBottom: 18,
        backgroundColor: '#FAFAFA',
        paddingLeft: 16
    }
})
class addReview extends React.Component {
    constructor(props) {
        super(props);
        this.isBack = true;
        this.title = Identify.__('Add Review')
        this.productId = this.props.productId;
        this.rateForm = this.props.rateForm;
        this.state = {
            ...this.state,
            ratings: {},
            nickName: '',
            title: '',
            detail: ''
        }
    }

    setData(data, requestID) {
        this.props.showLoading('none');
        if (data.errors) {
            let errors = data.errors;
            let text = "";
            for (let i in errors) {
                let error = errors[i];
                text += error.message + ' ';
            }
            if (text !== "") {
                Toast.show({ text: text, textStyle: { fontFamily: material.fontFamily }, duration: 3000, type: "warning" });
            }
        } else {
            Toast.show({ text: data.message, textStyle: { fontFamily: material.fontFamily }, duration: 3000 });
            this.props.closeForm()
            // NavigationManager.backToPreviousPage(this.props.navigation)
        }
    }

    renderRateSection() {
        let rateSection = this.rateForm.rates.map((item, index) => {
            return (
                <View key={index} style={styles.oneRow}>
                    <Text style={styles.itemFlex}>{Identify.__(item.rate_code)}</Text>
                    <StarContainer data={item.rate_options} parent={this} />
                </View>
            )
        })
        return (
            <View>
                {rateSection}
            </View>
        )
    }

    handleTextChange(text, key) {
        this.state[key] = text;
    }

    handleSubmitReview = () => {
        const nickname = this.state.nickName;
        const title = this.state.title;
        const detail = this.state.detail;
        if (nickname === "" || title === "" || detail === "") {
            Toast.show({ text: Identify.__('Please fill in all required fields'), textStyle: { fontFamily: material.fontFamily }, duration: 3000 });
        } else {
            let params = {
                product_id: this.productId,
                ratings: this.state.ratings,
                nickname,
                title,
                detail
            };
            this.props.showLoading('dialog');
            new NewConnection()
                .init(review_product, 'submit_review', this, 'POST')
                .addBodyData(params)
                .connect();
        }
    };
    renderInputLayout(tit, placeholder, key, textArea = false) {
        let textAreaInput = <Textarea
            style={{ ...styles.input, fontFamily: material.fontFamily, paddingTop: 16 }}
            rowSpan={5}
            onChangeText={(txt) => { this.handleTextChange(txt, key) }}
        />
        let normalInput = <Input
            style={{ ...styles.input, fontFamily: material.fontFamily, height: 50 }}
            placeholder={placeholder}
            onChangeText={(txt) => { this.handleTextChange(txt, key) }}
        />
        return (
            <View>
                <Text>{tit} <Text style={{ color: '#ED1C24' }}>*</Text></Text>
                {textArea ? textAreaInput : normalInput}
            </View>
        )
    }
    renderInputFrom() {
        return (
            <View style={{ marginTop: 20 }}>
                {this.renderInputLayout(Identify.__('Nickname'), Identify.__('Nickname'), 'nickName')}
                {this.renderInputLayout(Identify.__('Title'), '', 'title')}
                {this.renderInputLayout(Identify.__('Detail'), '', 'detail', true)}
                <Button style={{ justifyContent: 'center', marginTop: 12, height: 54, borderRadius: 8, alignSelf: 'center', minWidth: 125 }} onPress={() => this.handleSubmitReview()}>
                    <Text style={{ fontFamily: material.fontBold, fontSize: 16 }}>{Identify.__('SUBMIT')}</Text>
                </Button>
            </View>
        )
    }

    render() {
        return (
            <View style={{ marginTop: 30 }}>
                <Text style={{ marginBottom: 8, fontSize: 20, fontFamily: material.fontBold }}>{Identify.__('Your rating')}</Text>
                <View style={{ width: '100%', height: 1, marginBottom: 10 }} />
                {this.renderRateSection()}
                {this.renderInputFrom()}
            </View>
        )
    }
}
export default addReview;