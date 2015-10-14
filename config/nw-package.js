module.exports = {
  appName: 'ICaaS',
  platforms: ['linux64'],
  version: 'v0.12.0',
  "icon": "/dist/assets/images/logo.png",
  buildType: function() {
    return this.appVersion;
  }
};