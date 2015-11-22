import Ember from 'ember';

/*
 * The url is suggested to be passed as:
 * - a key-value pair in the object settings.
 * - a key-value pair in the locales file
 * - a raw url
 */

export default Ember.Component.extend({
  tagName: 'a',
  i18n: Ember.inject.service(),
  click: function() {
    var param_href = this.get('href');
    var href;
    if(this.get(param_href)) {
      href = this.get(param_href)
    }
    else if(this.get('i18n').t(param_href)) {
      href = this.get('i18n').t(param_href);
    }
    else {
      href = param_href;
    }
    require('nw.gui').Shell.openExternal(href);
  }
});
