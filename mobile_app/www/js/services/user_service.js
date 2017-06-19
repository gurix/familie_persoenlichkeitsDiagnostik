app.service('userService', function($rootScope, $http, $window, appConfig, $state, $filter) {
  var self = this;
  
  /**
  * Id of the current user
  */
  this.user_id = function () {
    return $rootScope.user.id;
  };

  this.backend_authentication = function () {
    return('user_email=' + $rootScope.user.email + '&user_token=' + $rootScope.user.authentication_token);
  };
  
  /**
  * Signs out the user and redirect to the entry state
  */
  this.sign_out = function () {
    for (var key in $rootScope.user) {
      if ($rootScope.user.hasOwnProperty(key)) { 
        delete $rootScope.user[key];
      }
    }
    $state.go( 'identification.email' );
  };
  
  /**
  * Sessions belonging the user
  */
  this.sessions_including_deleted = function() {
    return $rootScope.sessions.filter(function(session) {
        return session.user_id == self.user_id();
      });
  };
  
  /**
  * Undeleted sessions belonging the user
  */
  this.sessions = function() {
    return this.sessions_including_deleted().filter(function(session){
      return(!session.delete_at);
    });
  };
});
