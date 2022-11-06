export default {
    init_page: [
        {
            active: true,
            content: require('../../../../plugins/firebase').default,
            position: 2000
        }
    ],
    actions: [
      {
          active: true,
          content: require('../../../../plugins/firebase/action.js').default,
          position: 2000
      }
    ],
}
