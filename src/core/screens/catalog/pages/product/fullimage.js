import React from 'react';
import { Container, View , Toast } from 'native-base';
import { Dimensions , FlatList , TouchableOpacity , Image } from 'react-native';
import SimiPageComponent from '../../../../base/components/SimiPageComponent';
import variable from '@theme/variables/material';
import ImageViewer from 'react-native-image-zoom-viewer';
import Identify from "../../../../helper/Identify";
import IndicatorFullImage from "./indicator";
import material from "../../../../../../native-base-theme/variables/material";
class FullImage extends SimiPageComponent {
    constructor(props) {
        super(props);
        let listImages = this.props.navigation.getParam('images');
        let images = [];
        for (let i in listImages) {
            let image = listImages[i];
            images.push(
                {
                    url: image.url
                }
            );
        }
        this.state = {
            ...this.state,
            index : parseInt(this.props.navigation.getParam('index')) - 1
        };
        this.images = images;
    }
    componentDidMount(){
        setTimeout(() => {
            this.forceUpdate()
        }, 400);
        Toast.show({
            text: Identify.__('Pinch to zoom in and out'),
            duration: 3000,
            textStyle: {fontFamily: material.fontFamily},
            buttonText: Identify.__('OK'),
            buttonTextStyle: {color: Identify.theme.button_background, fontFamily: material.fontBold}
        })
    }

    createImages() {
        return (
            <ImageViewer
                ref={ref => this.imageSlider = ref}
                onChange={(currentIndex) => {
                    this.state.index = currentIndex;
                    this.indicatorRef.setState({
                        index: currentIndex
                    })
                }}
                renderIndicator={() => null}
                backgroundColor={'transparent'}
                index={this.state.index}
                imageUrls={this.images}/>
        );
    }
    renderIndicator(){
        return <IndicatorFullImage ref={ref => this.indicatorRef = ref} images={this.images} parent={this}/>
    }
    renderPhoneLayout() {
        return (
            <Container style={{backgroundColor: variable.appBackground, flex: 1}}>
                {this.createImages()}
                <View
                    style={{
                        width: Dimensions.get('window').width,
                        backgroundColor: '#eeeeee',
                        marginRight: 10,
                        paddingBottom: 10,
                        paddingTop: 10
                    }}
                >
                    {this.renderIndicator()}
                </View>
            </Container>
        );
    }

}

export default FullImage;
