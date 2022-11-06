import React from 'react';
import SimiPageComponent from "../../core/base/components/SimiPageComponent";
import {Text, Container, Content, View, Icon, Button} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';
import Identify from "../../core/helper/Identify";
import StarRating from 'react-native-star-rating';
import ReviewItem from './reviewItem';
import NavigationManager from '../../core/helper/NavigationManager';
import material from '../../../native-base-theme/variables/material';

class ReviewPage extends SimiPageComponent{
    constructor(props){
        super(props);
        this.title = Identify.__('Review');
        this.productName = this.props.navigation.getParam('productName');
        this.reviewPageData = this.props.navigation.getParam('reviewPageData');
        this.ratePoint = this.props.navigation.getParam('ratePoint');
        this.productId = this.props.navigation.getParam('productId');
        this.rateForm = this.props.navigation.getParam('rateForm');
        this.isLogin = this.props.navigation.getParam('isLogin');
    }

    renderRateCount(){
        let rateCount = [];
        for( let i = 1; i <= 5; i++){
            let item = i  + '_star';
            let rateItem =
                <View
                    key={i}
                    style={{flex: 1, flexDirection: 'row', paddingTop: 12, marginStart: 12, marginEnd: 12}}
                >
                    <StarRating
                        maxStars={5}
                        rating={i}
                        starSize={12}
                        containerStyle={{marginTop: 5, marginEnd: 70}}
                        fullStarColor='#ffcc00'
                        emptyStarColor='#ffcc00'
                    />
                    <Text style={{flexGrow: 1}}>({this.reviewPageData.count[item]})</Text>
                </View>
            rateCount.push(rateItem)
        }
        return (
            <View
                style={{paddingBottom: 12, borderBottomWidth: 0.3, borderBottomColor: '#c9c9c9'}}
            >
                {rateCount}
            </View>
        );
    }
    itemOnPress(item){
        NavigationManager.openPage(this.props.navigation, 'ReviewDetail', {
            itemData : item
        })
    }
    renderListReviewItem(item){
        return (
            <TouchableOpacity
                style={{width: '100%', marginBottom: 15}}
                onPress={() => {this.itemOnPress(item)}}
            >
                <View icon
                      style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                      }}
                >
                    <ReviewItem item={item} navigation={this.props.navigation} />
                    <Icon name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"}/>
                </View>
            </TouchableOpacity>
        )
    }
    renderListReview(){
        return(
            <View
                style={{padding: 12, marginBottom: 50}}
            >
                <FlatList
                    data={this.reviewPageData.reviews}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.review_id}
                    renderItem={({ item }) =>
                        this.renderListReviewItem(item)
                    }
                />
            </View>
        )
    }
    renderProductName(){
        return (
            <View
                style={{padding: 12, borderBottomWidth: 0.3, borderBottomColor: '#c9c9c9'}}
            >
                <Text style={{ fontSize: 20, fontFamily: material.fontBold }}>{Identify.__(this.productName)}</Text>
            </View>
        )
    }
    renderCustomerRate(){
        return (
            <View
                style={{flex: 1, flexDirection: 'row', padding: 12}}
            >
                <Text style={{fontSize: 18, flexGrow: 1}}>{Identify.__('Customer Reviews')}</Text>
                <StarRating
                    maxStars={5}
                    rating={this.ratePoint}
                    starSize={12}
                    containerStyle={{marginTop: 5, marginStart: 10}}
                    fullStarColor='#ffcc00'
                    emptyStarColor='#ffcc00'
                />
            </View>
        )
    }
    renderActionButton(){
        return (
            <Button
                style={{position: 'absolute', zIndex: 999, bottom: 0, width: '100%', justifyContent: 'center'}}
                title={Identify.__('ADD YOUR REVIEW')}
                onPress={() => NavigationManager.openPage(this.props.navigation, 'AddReview', {
                    productId: this.productId,
                    rateForm : this.rateForm
                })}
                disabled={this.isLogin}
            >
                <Text>{this.isLogin? Identify.__('ONLY USER CAN ADD REVIEW') : Identify.__('Add Review')}</Text>
            </Button>
        )
    }
    createLayout(){
        return(
            <Container>
                <Content>
                    {this.renderProductName()}
                    {this.renderCustomerRate()}
                    {this.renderRateCount()}
                    {this.renderListReview()}
                </Content>
                {this.renderActionButton()}
            </Container>
        )
    }
}
export default ReviewPage;