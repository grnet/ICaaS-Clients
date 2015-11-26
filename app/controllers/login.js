import Ember from 'ember';
import {raw as ajax} from 'ic-ajax';

export default Ember.Controller.extend({
  error: false,
  errorMsg: null,
  isLoggedIn: false,

  /*
  * If the user clicks the checkbox that is bound with the stayLoggedIn
  * prop the localStorage prop gets updated
  */

  trackLoginPref: function() {
    if(this.get('stayLoggedIn')) {
      localStorage.stayLoggedIn = this.get('stayLoggedIn');
    } else {
      localStorage.stayLoggedIn = '';
    }
  }.observes('stayLoggedIn').on('init'),

  actions: {
    'tryLogin': function(){
      var token = this.get('token');
      if (!token || !token.trim())  {
        this.set('error', true);
        this.set('errorMsg', 'This field cannot be empty');
        return;
      }
      this.send('resolveUser', token);
    },

    'success': function(){
      this.set('error', false);
      this.set('errorMsg', null);
      var c = this.get('cookie');
      c.setCookie('token', this.get('settings.tokenInfo.token.id'));
      c.setCookie('uuid', this.get('settings.tokenInfo.user.id'));
      c.setCookie('username', this.get('settings.tokenInfo.user.name'));
      if (localStorage.stayLoggedIn) {
        localStorage.token = this.get('settings.tokenInfo.token.id');
        localStorage.uuid = this.get('settings.tokenInfo.user.id');
        localStorage.username = this.get('settings.tokenInfo.user.name');
      }
      else {
        localStorage.token = '';
        localStorage.uuid = '';
        localStorage.username = '';
      }
      this.set('token', '')
      this.set('isLoggedIn', 'true')
      this.transitionToRoute('application');
    },
    
    'resolveUser': function(token) {
      var self = this;
      return ajax({
        url: self.get('settings.auth_url')+'/tokens/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        type: 'json',
        data: JSON.stringify({auth:{token:{id: token}}})
      }).then(function(data) {
        self.get('settings').set('tokenInfo', data.response.access);
        self.get('settings').set('token', data.response.access.token.id);
        self.get('settings').set('uuid', data.response.access.user.id);
        self.get('settings').set('username', data.response.access.user.name);
        self.send('success');
      }, function(err){
        self.set('error', true);
        self.set('errorMsg', err.errorThrown);
      });
    },

    'hideErrors': function(){
      this.set('error', false);
    }

  }

});
