export default {
    container : {
    },
    content : {
      default_title: {
          active: true,
          sort_order: 1000,
          content: require('../../../core/screens/checkout/components/thankyou/thanktitle').default
      },
      default_body: {
          active: true,
          sort_order: 2000,
          content: require('../../../core/screens/checkout/components/thankyou/thankbody').default
      },
      default_order: {
          active: true,
          sort_order: 3000,
          content: require('../../../core/screens/checkout/components/thankyou/thankorder').default
      },
      default_button: {
          active: true,
          sort_order: 4000,
          content: require('../../../core/screens/checkout/components/thankyou/button').default
      },
    }
}
