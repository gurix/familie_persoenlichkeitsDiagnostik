app.controller('IdentificationRegistrationController', function($scope, $state, $http, appConfig) {
  
  /**
  * Register a new user at the backend server
  */
  $scope.register = function(){
    $http.post(appConfig.backend_server+ '/api/v1/sign_up', {
      user: $scope.user
    }).then(function successCallback(response) {
      $scope.user.id = response.data._id.$oid;
      $scope.user.authentication_token = response.data.authentication_token;
      $scope.user.updated_at = response.data.updated_at;
      console.log("Registraion succeed");
      $state.go( 'overview' );
    }, function errorCallback(response) {
      console.log("Registraion failed");
      $scope.errors = response.data.errors;
      $state.go( 'identification.email' );
    });
  };
});
