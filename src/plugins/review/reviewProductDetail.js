import React from 'react';
import { FlatList, TouchableOpacity, Image } from 'react-native';
import { View, Text, Icon, Spinner } from 'native-base';
import { connect } from 'react-redux';
import StarRating from 'react-native-star-rating';
import Identify from "@helper/Identify";
import material from '@theme/variables/material';
import NewConnection from '@base/network/NewConnection'
import SimiComponent from "@base/components/SimiComponent";
import AddReview from './addreview/addReview';

class Review extends SimiComponent {
    constructor(props) {
        super(props);
        this.product = this.props.product;
        this.limit = 6;
        this.offset = 0;
        this.state = {
            data: null,
            starCount: this.product.app_reviews ? this.product.app_reviews.rate : 0,
            extend: false,
            showAddReview: false,
            showLoading: false
        };
    }

    requestGetReview() {
        new NewConnection()
            .init('simiconnector/rest/v2/reviews?filter[product_id]=' + this.props.product.entity_id, 'get_reviews', this)
            .addGetData({
                limit: this.limit,
                offset: this.offset
            })
            .connect();
    }

    setData(data) {
        this.setState({ data: data, showLoading: false });
    }

    renderSomeReviewItem(item) {
        const splits = item.created_at.split(' ');
        return (
            <TouchableOpacity
                style={{ width: '100%', paddingBottom: 15, marginBottom: 15, borderBottomWidth: 1, borderColor: '#D8D8D8' }}
            >
                <Text style={{ fontSize: 16, fontFamily: material.fontBold }}>{item.title}</Text>
                <Text style={{ marginTop: 10 }}>{item.detail}</Text>
                <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#747474', maxWidth: '25%' }} numberOfLines={1} ellipsizeMode="tail">{splits[0]}</Text>
                    <View style={{ width: 1, height: 13, backgroundColor: '#747474' }} />
                    <Text style={{ color: '#747474', maxWidth: '25%' }} numberOfLines={1} ellipsizeMode="tail">{item.nickname}</Text>
                    <View style={{ width: 1, height: 13, backgroundColor: '#747474' }} />
                    <StarRating
                        maxStars={5}
                        rating={item.rate_points}
                        starSize={14}
                        emptyStar={require('./icon/icon-Star.png')}
                        fullStar={require('./icon/icon-star-active.png')}
                        starStyle={{ marginRight: 5 }}
                        style={{ maxWidth: '25%' }}
                    />
                </View>
            </TouchableOpacity>
        )
    }
    renderSomeReview() {
        if (this.state.data && this.state.data.reviews.length > 0) {
            let numberToShow = 0;
            if (this.state.data.reviews.length >= this.limit && this.offset == 0) {
                numberToShow = this.limit
            } else {
                numberToShow = this.state.data.reviews.length;
            }
            return (
                <View style={{ marginTop: 24, borderTopWidth: 1, borderColor: '#D8D8D8', paddingTop: 10 }}>
                    <Text style={{ marginBottom: 30 }}>{Identify.__('Showing')} <Text style={{ fontFamily: material.fontBold }}>{numberToShow}</Text> {Identify.__('of')} <Text style={{ fontFamily: material.fontBold }}>{this.state.data.reviews.length}</Text> {Identify.__(this.state.data.reviews.length > 1 ? 'reviews' : 'review')}</Text>
                    <FlatList
                        data={this.state.data.reviews.slice(0, numberToShow)}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.review_id}
                        renderItem={({ item }) =>
                            this.renderSomeReviewItem(item)
                        }
                    />
                    {numberToShow < this.state.data.reviews.length && <TouchableOpacity
                        style={{ marginTop: 30, borderWidth: 1, borderRadius: 10, paddingHorizontal: 50, paddingVertical: 15, alignSelf: 'center', borderColor: this.state.showAddReview ? '#E4531A' : 'black' }}
                        onPress={() => {
                            this.limit = this.state.data.reviews.length;
                            this.setState({ showLoading: true })
                            this.requestGetReview();
                        }}>
                        {this.state.showLoading ? <Spinner color='black' style={{ height: 20 }} /> : <Text style={{ fontSize: 15, fontFamily: material.fontBold, color: this.state.showAddReview ? '#E4531A' : 'black' }}>{Identify.__('Show All')} ({this.state.data.reviews.length})</Text>}
                    </TouchableOpacity>}
                </View>
            )
        }
    }

    renderReviewSummary = () => {
        const numOfReviews = this.state.data ? this.state.data.total : 0;
        const ratingSummary = Object.keys(this.state.data.count).map((key, index) => {
            const ratingItem = this.state.data.count[key];
            const ratingPercent = (ratingItem / this.state.data.total) * 100;
            return (
                <View key={key} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                    <Image source={require('./icon/icon-star-active.png')} style={{ width: 18, height: 18 }} />
                    <Text style={{ marginLeft: 5, paddingTop: 4 }}>{index + 1}</Text>
                    <View style={{ marginLeft: 15, marginRight: 30, flexGrow: 1, height: 10, backgroundColor: '#D8D8D8', borderRadius: 5 }}>
                        {ratingItem > 0 && <View style={{ backgroundColor: '#39A935', height: 10, width: ratingPercent + '%', borderRadius: ratingPercent == 100 ? 5 : 0, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} />}
                    </View>
                    <Text style={{ paddingTop: 4 }}>{ratingItem}</Text>
                </View>
            );
        })
        return (
            <>
                <View style={{ backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#D8D8D8', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 30, marginTop: 15 }}>
                    <View style={{ paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#D8D8D8', alignItems: 'center' }}>
                        <Text style={{ fontSize: 32, fontFamily: material.fontBold }}>{parseInt(this.product.app_reviews.rate * 10) / 10}</Text>
                        <StarRating
                            style={{ marginTop: 10 }}
                            maxStars={5}
                            rating={this.product.app_reviews.rate}
                            starSize={25}
                            emptyStar={require('./icon/icon-Star.png')}
                            fullStar={require('./icon/icon-star-active.png')}
                            starStyle={{ marginRight: 9 }}
                            halfStarColor={'#FFC107'}
                        />
                        <Text style={{ color: numOfReviews == 0 ? '#B5B5B5' : '#096BB3', marginTop: 15 }}>{numOfReviews == 0 ? Identify.__('No reviews') : (numOfReviews + ' ' + Identify.__('reviews'))}</Text>
                    </View>
                    <View style={{ flexDirection: 'column-reverse', paddingTop: 12 }}>
                        {ratingSummary}
                    </View>
                </View>
                <TouchableOpacity
                    style={{ marginTop: 20, borderWidth: 1, borderRadius: 10, paddingHorizontal: 50, paddingVertical: 15, alignSelf: 'center', borderColor: this.state.showAddReview ? '#E4531A' : 'black' }}
                    onPress={() => this.setState({ showAddReview: !this.state.showAddReview })}>
                    <Text style={{ fontSize: 15, fontFamily: material.fontBold, color: this.state.showAddReview ? '#E4531A' : 'black' }}>{Identify.__('Write a review')}</Text>
                </TouchableOpacity>
            </>
        );
    }

    renderPhoneLayout() {
        if (this.props.parent.state.reRender && !this.state.data) {
            this.requestGetReview();
        }
        if (this.product.hasOwnProperty('app_reviews') && (this.product.app_reviews.length > 0 || !Identify.isEmpty(this.product.app_reviews))) {
            return (
                <View style={{ paddingHorizontal: 12 }}>
                    <TouchableOpacity
                        style={{ padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 5, borderColor: '#979797', marginTop: 15 }}
                        onPress={() => this.setState({ extend: !this.state.extend })}
                    >
                        {this.state.data && this.state.data.total > 0 ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <StarRating
                                maxStars={5}
                                rating={this.product.app_reviews.rate}
                                starSize={17}
                                emptyStar={require('./icon/icon-Star.png')}
                                fullStar={require('./icon/icon-star-active.png')}
                                starStyle={{ marginRight: 5 }}
                                halfStarColor={'#FFC107'}
                            />
                            <Text style={{ marginLeft: 15, fontFamily: material.fontBold, paddingTop: 3 }}>{parseInt(this.product.app_reviews.rate * 10) / 10}/{Identify.__('5')}</Text>
                            <Text style={{ color: '#096BB3', marginLeft: 10, paddingTop: 3 }}>({this.state.data ? this.state.data.total : 0})</Text>
                        </View> : <Text style={{ fontSize: 16, fontFamily: material.fontBold }}>{Identify.__('No Reviews')}</Text>}
                        <Icon style={{ fontSize: 20 }} name={this.state.extend ? "ios-arrow-up" : "ios-arrow-down"} />
                    </TouchableOpacity>
                    {this.state.extend && this.renderReviewSummary()}
                    {this.state.extend && this.state.showAddReview &&
                        <AddReview
                            productId={this.props.product.entity_id}
                            rateForm={this.props.product.app_reviews.form_add_reviews[0]}
                            showLoading={(loading) => this.props.parent.showLoading(loading)}
                            closeForm={() => this.setState({ showAddReview: false })}
                        />}
                    {this.state.extend && this.renderSomeReview()}
                </View>
            )
        }
    }
}
const mapStateToProps = (state) => {
    return {
        customer_data: state.redux_data.customer_data,
    };
}

export default connect(mapStateToProps)(Review);