import React from 'react';
import { Container, View, Text, Content } from 'native-base';
import SimiPageComponent from '@base/components/SimiPageComponent';
import material from '@theme/variables/material';
import HTML from 'react-native-render-html';
import Identify from '@helper/Identify';

class TechSpecs extends SimiPageComponent {
    constructor(props) {
        super(props);
    }
    renderContent(data, style) {
        let styleContent = style;
        if (data.includes('<')) {
            delete styleContent['textAlign']
            return <HTML containerStyle={styleContent} tagsStyles={{ p: { textAlign: 'left' }, span: { textAlign: 'left' } }} html={data} baseFontStyle={{ fontFamily: material.fontFamily }} />
        } else {
            return <Text style={styleContent}>{Identify.__(data)}</Text>
        }
    }
    createContent() {
        let rows = [];
        let additional = this.props.navigation.getParam('additional');
        let shouldHightlight = true;
        for (let key in additional) {
            let item = additional[key];
            rows.push(
                <View key={key} style={{ backgroundColor: (shouldHightlight) ? '#EDEDED' : 'white', flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10 }}>
                    {this.renderContent(item.label, { flex: 2, fontWeight: 'bold', textAlign: 'left' })}
                    {this.renderContent(item.value, { flex: 3, marginLeft: 5, textAlign: 'left' })}
                </View>
            );
            shouldHightlight = !shouldHightlight;
        }
        return (rows);
    }

    renderPhoneLayout() {
        return (
            <Container style={{ backgroundColor: material.appBackground }}>
                <Content>
                    {this.createContent()}
                </Content>
            </Container>
        );
    }

}

export default TechSpecs;
