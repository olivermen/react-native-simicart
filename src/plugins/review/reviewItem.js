import React from 'react';
import SimiComponent from "../../core/base/components/SimiComponent";
import { Text, View } from 'native-base';
import StarRating from 'react-native-star-rating';

class ReviewItem extends SimiComponent {
    constructor(props) {
        super(props)
        this.dataReview = this.props.item;
    }
    render() {
        return (
            <View style={{ marginEnd: 12, width: '90%' }}>
                <StarRating
                    maxStars={5}
                    rating={this.dataReview.rate_points}
                    starSize={12}
                    containerStyle={{ width: 60 }}
                    fullStarColor='#ffcc00'
                    emptyStarColor='#ffcc00'
                />
                <Text style={{ marginTop: 12, textAlign: 'left' }}>{this.dataReview.title}</Text>
                <Text numberOfLines={this.props.fromDetail ? 2 : undefined} style={{ fontSize: 12, color: '#828282', marginTop: 12, textAlign: 'left' }}>{this.props.item.detail}</Text>
                <Text style={{ fontSize: 12, color: '#828282', marginTop: 12, textAlign: 'left' }}>{this.dataReview.created_at} by {this.dataReview.nickname}</Text>
            </View>
        )
    }
}
export default ReviewItem;