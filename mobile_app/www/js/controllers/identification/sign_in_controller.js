app.controller('IdentificationSignInController', function($scope, $state, $http, appConfig, $ionicPopup, $translate) {
  
  /**
  * Signs the user in
  */
  $scope.signin = function() {
    $http.post(appConfig.backend_server+ '/api/v1/sign_in', {
      user: $scope.user
    }).then(function successCallback(response) {
      $scope.user.id = response.data._id.$oid;
      for (var key in response.data) {
        if (response.data.hasOwnProperty(key)) {
          $scope.user[key] = response.data[key];
        }  
      }
      
      console.log("Signin succeed");
      $state.go( 'overview' );
    }, function errorCallback(response) {
      var alertPopup = $ionicPopup.alert({
         title: response.data.error
      });
    });
  };
  
  $scope.sendpassword = function() {
    $http.post(appConfig.backend_server+ '/api/v1/passwords', {
      user: $scope.user
    }).then(function successCallback(response) {
      $translate('user.password_sent').then(function (title) {
        var alertPopup = $ionicPopup.alert({
           title: title
        });
      });
    }, function errorCallback(response) {
      console.log(response);
    });
  };
});
