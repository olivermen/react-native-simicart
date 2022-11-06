module.exports = {
  // Core
  get HeaderApp() {
    return require('./header').default;
  },
  get BodyApp() {
    return require('./body').default;
  },
  get FooterApp() {
    return require('./footer').default;
  },
  get NetworkApp() {
    return require('./nstt').default;
  },
}
