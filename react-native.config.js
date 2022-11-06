module.exports = {
    project: {
        ios: {},
        android: {},
    },
    assets: [
        "./media/Images/",
        "./assets/fonts/"
    ],
    dependencies: {
	    "react-native-gesture-handler": {
	      platforms: {
	        android: null,
	        ios: null
	      }
	    }
	  }
};