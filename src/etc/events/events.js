export default {
	simi_appwishlist_40: require('../../etc/events/plugins/simi_appwishlist_40/events').default,
	simi_simicustompayment_40: require('./plugins/simi_simicustompayment_40/events').default,
	customize: require('./customize/events').default,
	simi_simiproductreview_40: require('../../etc/events/plugins/simi_simiproductreview_40/events').default,
	simi_firebase_analytics_40: require('./plugins/simi_firebase_analytics_40/events').default,
}