module.exports = {
  appName: 'icaas',
  platforms: ['linux64', 'win64', 'osx64'],
  version: 'v0.12.0',
  buildType: function() {
    return this.appVersion;
  }
};