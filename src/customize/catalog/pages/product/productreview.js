import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { Container, Content, View } from "native-base";
import { connect } from 'react-redux';
import StarRating from 'react-native-star-rating';
import Identify from '@helper/Identify';
import { products } from '@helper/constants';
import variable from '@theme/variables/material';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import SimiPageComponent from '@base/components/SimiPageComponent';

class ReviewDetails extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.product = null;
        this.productId = -1;
        this.myReviews = []
    }

    componentDidMount() {
        super.componentDidMount();
        if (!this.product) {
            new NewConnection()
                .init(products + '/' + this.productId, 'get_product_data', this)
                .connect();
        }
        this.getMyReviews()
    }

    getMyReviews = () => {
        new NewConnection()
            .init('simiconnector/rest/V2/myreviews', 'get_my_reviews', this)
            .addGetData({
                page: 1,
                limit: 10,
                product_id: this.productId
            })
            .connect();
    }

    componentWillMount() {
        if (!this.checkExistData()) {
            this.showLoading('full');
        }
    }

    setData(data, requestID) {
        if (requestID === 'get_product_data') {
            this.product = data.product;
        } else if (requestID === 'get_my_reviews') {
            this.myReviews = data.myreviews
        }
        this.showLoading('none');
    }

    checkExistData() {
        this.productId = this.props.navigation.getParam("productId");
        let data = this.props.data;
        if (data && data.hasOwnProperty(this.productId)) {
            this.product = data[this.productId];
            return true;
        }
        return false;
    }

    convertDate = (data, type) => {
        let date = new Date(data.slice(0, 10));
        if (type === 'nor') {
            return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
        } else if (type === 'month') {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return monthNames[parseInt(date.getMonth())] + " " + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear()
        }
    }

    backToPreviousPage = () => {
        NavigationManager.backToPreviousPage(this.props.navigation);
    }

    renderImages() {
        let images = [];
        let data = JSON.parse(JSON.stringify(this.product.images));
        for (let i in data) {
            let image = data[i];
            image['simi_index'] = i;
            images.push(
                <View key={image.position} style={{ flex: 1 }}>
                    <Image
                        resizeMode='contain'
                        source={{ uri: image.url }}
                        style={styles.image}
                    />
                </View>
            );
            i++;
        }
        return images;
    }

    renderMyReviews = ({ item }) => (
        <View style={styles.review}>
            <View style={styles.flex}>
                <Text>{Identify.__('Your Rating:')}</Text>
                <StarRating
                    maxStars={5}
                    rating={parseInt(item.rating_votes[0].value)}
                    starSize={14}
                    containerStyle={{ width: 103, marginLeft: 5 }}
                    fullStarColor='#ffcc00'
                    emptyStarColor='#ffcc00'
                />
            </View>
            <Text>{Identify.__(`Your Review (submitted on ${this.convertDate(item.review_created_at, 'month')})`)}</Text>
            <Text style={styles.titleReview}>{Identify.__(item.title)}</Text>
            <Text>{Identify.__(item.detail)}</Text>
        </View>
    )

    renderContent = () => (
        <View style={{ paddingHorizontal: 12, paddingBottom: 100 }}>
            <View style={styles.header}>
                <Text style={styles.title}>{Identify.__('Review Details')}</Text>
                <TouchableOpacity onPress={this.backToPreviousPage}>
                    <Text style={styles.back}>{Identify.__('BACK')}</Text>
                </TouchableOpacity>
            </View>
            {this.renderImages()}
            <Text style={{ paddingTop: 20, paddingBottom: 13 }}>
                {Identify.__(`Submitted on ${this.convertDate(this.myReviews[0].review_created_at, 'nor')}`)}
            </Text>
            <Text style={styles.title}>{Identify.__(this.product.name)}</Text>
            <View style={styles.rateContainer}>
                <StarRating
                    maxStars={5}
                    rating={this.product.app_reviews.rate}
                    starSize={18}
                    containerStyle={{ width: 125 }}
                    fullStarColor='#ffcc00'
                    emptyStarColor='#ffcc00'
                />
                <Text style={{ color: '#096BB3', paddingLeft: 18 }}>{this.product.app_reviews.reviews_count} {this.product.app_reviews.reviews_count > 1 ? 'reviews' : 'review'}</Text>
            </View>
            <View style={styles.line} />
            <FlatList
                data={this.myReviews}
                keyExtractor={item => item.review_id}
                renderItem={this.renderMyReviews}
            />
        </View>
    )

    renderPhoneLayout() {
        if (this.product && this.myReviews.length) {
            return (
                <Container style={{ backgroundColor: variable.appBackground }}>
                    <Content showsVerticalScrollIndicator={false}>
                        {this.renderContent()}
                    </Content>
                </Container>
            )
        }
        return null;
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.product_details_data };
}

export default connect(mapStateToProps, null)(ReviewDetails);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 30,
        paddingBottom: 20
    },
    title: {
        fontSize: 20,
        fontWeight: '500'
    },
    back: {
        color: '#096BB3',
        textDecorationLine: 'underline'
    },
    image: {
        height: 295,
        width: 295,
        borderWidth: 1,
        borderColor: '#D8D8D8',
        alignSelf: 'center'
    },
    rateContainer: {
        height: 40,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D8D8D8',
        width: '70%',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 30
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#D8D8D8'
    },
    review: {
        paddingVertical: 16,
        borderBottomColor: '#D8D8D8',
        borderBottomWidth: 1
    },
    flex: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10
    },
    titleReview: {
        fontWeight: '500',
        fontSize: 16,
        paddingBottom: 10,
        paddingTop: 15
    }
})