import React from 'react';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Content, Container } from 'native-base';
import NewConnection from '@base/network/NewConnection';
import StarRating from 'react-native-star-rating';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';

export default class MyReviews extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            showLoading: 'full',
            data: null,
            showBtnLoadMore: 0,
            currentPage: 1
        }
    }

    componentDidMount() {
        this.getMyReviews(1);
    }

    getMyReviews = (num) => {
        new NewConnection()
            .init('simiconnector/rest/V2/myreviews', 'myreviews', this)
            .addGetData({
                page: num,
                limit: 10
            })
            .connect();
    }

    setData(data) {
        this.setState({
            data: this.state.currentPage === 1 ? data.myreviews : [...this.state.data, ...data.myreviews],
            showLoading: 'none',
            showBtnLoadMore: data.myreviews.length
        });
    }

    loadMore = () => {
        this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }), () => {
            this.getMyReviews(this.state.currentPage)
        });
    }

    convertDate = (data) => {
        let date = new Date(data.slice(0, 10));
        return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
    }

    navigateDetail = (item) => {
        NavigationManager.openPage(this.props.navigation, 'ReviewDetails', {
            productId: item.product_id,
            // objData: item
        });
    }

    renderItem = ({ item }) => (
        <View style={styles.box}>
            <Text style={styles.name}>{item.name}</Text>
            <StarRating
                maxStars={5}
                rating={parseInt(item.rating_votes[0].value)}
                starSize={14}
                containerStyle={{ width: 103, marginBottom: 8 }}
                fullStarColor='#ffcc00'
                emptyStarColor='#ffcc00'
            />
            <Text style={{ color: '#747474', marginBottom: 10 }}>{this.convertDate(item.review_created_at)}</Text>
            <Text numberOfLines={2}>{item.detail}</Text>
            <TouchableOpacity style={styles.btnViewMore} onPress={() => this.navigateDetail(item)}>
                <Text>{Identify.__('View more')}</Text>
            </TouchableOpacity>
        </View>
    )

    renderListReviews = () => {
        const { data, showBtnLoadMore } = this.state
        if (data.length) {
            return (
                <View style={{ paddingBottom: 100 }}>
                    <FlatList
                        data={data}
                        keyExtractor={item => item.review_id}
                        renderItem={this.renderItem}
                    />
                    {showBtnLoadMore === 10 ?
                        <TouchableOpacity style={styles.btnLoadMore} onPress={this.loadMore}>
                            <Text style={styles.loadMore}>{Identify.__('Load More')}</Text>
                        </TouchableOpacity>
                        : null}
                </View>
            )
        }
        return (
            <View style={styles.btnEmpty}>
                <Text style={{ fontSize: 16 }}>{Identify.__('No reviews found')}</Text>
            </View>
        )
    }

    renderPhoneLayout() {
        if (!this.state.data) {
            return null;
        }
        return (
            <Container style={styles.page}>
                <Content showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>{Identify.__('My Product Reviews')}</Text>
                    {this.renderListReviews()}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 12
    },
    btnEmpty: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderRadius: 5,
        borderColor: '#C5CBD5',
        borderWidth: 1,
        height: 50,
        width: '100%'
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        paddingTop: 30,
        paddingBottom: 25
    },
    box: {
        paddingTop: 16,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D8D8D8',
        marginBottom: 15
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        paddingBottom: 8
    },
    btnViewMore: {
        width: '100%',
        height: 35,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#282828',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    loadMore: {
        fontSize: 16,
        fontWeight: '500',
        color: '#F96C35'
    },
    btnLoadMore: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F96C35',
        marginTop: 5
    }
})