app.controller('IdentificationCheckEmailController', function($scope, $state, $http, appConfig) {
  
  /**
  * Check whther an email belongs to an existing user or has to be registred
  */
  $scope.checkEmail = function() {
    $http.get(appConfig.backend_server+ '/api/v1/email_exists?email=' + $scope.user.email).then(function successCallback(response) {
      if (response.data.email_exists === true) {
        $state.go( 'identification.signin' );  
      }else{
        $state.go( 'identification.register' );
      }
    }, function errorCallback(response) {
      $scope.errors = response.data.errors;
      $state.go( 'identification.email' );
    });
  };
});
