import React from 'react';
import OptionAbstract from '../OptionAbstract';
import Identify from '../../../../../../helper/Identify';
import { CheckBox, ListItem, Body, View, Text } from 'native-base';
import Radio from '../base/radio';
import Checkbox from '../base/checkbox';
import Select from '../base/select';
import MultiCheckbox from '../base/multicheckbox';
import material from '../../../../../../../../native-base-theme/variables/material';

class DownloadableAbstract extends OptionAbstract {

    constructor(props){
        super(props);
        this.options = [];
    }

    renderOptions =()=>{
        let objOptions = [];
        if (this.data.download_options) {
            let attributes = this.data.download_options;
            let labelRequired = "";
            let type = 'multi';
            for (let i in attributes) {
                let attribute = attributes[i];
                if (attribute.isRequired == 1) {
                    labelRequired = this.renderLabelRequired(1);
                    this.required.push(0)
                }

                let showType = 2;
                if (attribute.type === "multiple"
                    || attribute.type === "checkbox") {
                    showType = 1;
                }

                let element = this.renderAttribute(attribute.type, showType, attribute, i, labelRequired);
                objOptions.push(element);
            }
        }
        return (
            <View style={{marginTop: 10}}>
                {objOptions}
            </View>
        );
    };

    renderAttribute = (type, showType, attribute, id, labelRequried)=>{
        return (
            <View key={Identify.makeid()}>
                <Text style={{fontFamily: material.fontBold, marginLeft: 10}}>{attribute.title} {labelRequried}</Text>
                {this.renderContentAttribute(attribute, type, showType, id)}
            </View>
        )
    };

    renderMultiCheckbox =(ObjOptions, type = 'multi', id = '0')=>{
        let options = ObjOptions.value;
        let objs = [];
        for (let i in options) {
            let item = options[i];
            let price = item.price  ? item.price
                : item.price_including_tax ? item.price_including_tax.price : 0;
            let label  = this.renderLabelOption(item.title,price);
            let element = (<Checkbox key={item.id} id={item.id} label={label} value={item.id} parent={this}/>)

            objs.push(element);
        }
        return objs;
    };

    renderContentAttribute = (ObjOptions, type = 'single', showType, id = '0') => {
        let key = id;
        if(type === 'select'){
            return <Select data={ObjOptions} id={key} parent={this} onRef={ref => (this.options[id] = ref)}/>
        }
        if(type === 'single' || type ==='radio'){
            return <Radio data={ObjOptions} id={key} parent={this} onRef={ref => (this.options[id] = ref)}/>
        }
        if(type === 'multi' || type === 'checkbox'){
            return <MultiCheckbox values={ObjOptions.value} parent={this} showType={showType} onRef={ref => (this.options[id] = ref)}/>
        }
    }

    updatePrices = (originalPrices = null) => {
        if(originalPrices == null) {
            if(this.customOption) {
                this.customOption.updatePrices();
                return;
            } else {
                originalPrices = JSON.parse(JSON.stringify(this.props.prices));
            }
        }

        let selectedValues = '';
        let optionContent = this.options['0'];
        let values = optionContent.getValues();
        if(values != '') {
            selectedValues = values;
        }

        let exclTax = 0;
        let inclTax = 0;
        let showBothTax = false;

        let downloadableOptions = this.data.download_options;
        for(let i in downloadableOptions) {
            let option = downloadableOptions[i];
            let values = option.value;
            for (let j in values) {
                let value = values[j];
                if(selectedValues.includes(',')) {
                    if (selectedValues.includes(value.id)) {
                        if (value.price_excluding_tax) {
                            exclTax += parseFloat(value.price_excluding_tax.price);
                            inclTax += parseFloat(value.price_including_tax.price);
                            showBothTax = true;
                        } else {
                            exclTax += value.price;
                        }
                    }
                } else {
                    if (value.id == selectedValues) {
                        if (value.price_excluding_tax) {
                            exclTax += parseFloat(value.price_excluding_tax.price);
                            inclTax += parseFloat(value.price_including_tax.price);
                            showBothTax = true;
                        } else {
                            exclTax += parseFloat(value.price);
                        }
                    }
                }
            }
        }

        if(showBothTax === true){
            originalPrices.price_excluding_tax.price += exclTax;
            originalPrices.price_including_tax.price += inclTax;
        }else {
            originalPrices.regural_price += exclTax;
            originalPrices.price += exclTax;
        }

        this.parentObj.updatePrices(originalPrices);
    }

    dispatchMergePrice(originalPrices) {
        this.updatePrices(originalPrices);
    }

    getParams = ()=>{
        let downloadableParams = [];
        let selected = {};
        let optionContent = this.options['0'];
        let values = optionContent.getValues();
        if(values != '') {
            downloadableParams = values.split(',');
            selected['0'] = values;
        }

        if(!this.checkOptionRequired(selected)){
            return false;
        }

        let params = {
          links: downloadableParams
        };

        if(this.customOption) {
          let customParams = this.customOption.getParams();
          if(customParams != false) {
            params['options'] = customParams['options'];
          } else {
            return false;
          }
        }

        return params;
    }

}
export default DownloadableAbstract;
