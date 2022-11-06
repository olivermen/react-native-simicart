import React from 'react';
import SimiPageComponent from "../../core/base/components/SimiPageComponent";
import {Text, Content, Container} from 'native-base'
import ReviewItem from './reviewItem';

class ReviewDetail extends SimiPageComponent{
    constructor(props){
        super(props)
        this.isBack = true;
        this.dataDetail = this.props.navigation.getParam('itemData');
        this.title = this.dataDetail.title
    }
    createLayout(){
        return(
            <Container>
                <Content style={{padding: 12}}>
                    <ReviewItem item={this.dataDetail}/>
                </Content>
            </Container>
        )
    }
}
export default ReviewDetail