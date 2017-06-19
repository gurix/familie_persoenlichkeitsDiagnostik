app.controller('IdentificationEditPersonalDataController', function($scope, $state) {
  
  /**
  * Creating a temporary user as we don't alter the original user directly 
  */
  $scope.tmp_user = { first_name: $scope.user.first_name, 
    last_name: $scope.user.last_name, 
    gender: $scope.user.gender,
    // We need a date object as model here otherwise the date input fails
    birth_date: new Date($scope.user.birth_date)
  };
  
  /**
  * Update the original user with the temporary when the form is valid
  */
  $scope.update = function() {
    $scope.user.first_name = $scope.tmp_user.first_name;
    $scope.user.last_name = $scope.tmp_user.last_name;
    $scope.user.gender = $scope.tmp_user.gender;
    // We have to store the date as string, otherwise the dateinput returns an empty object
    $scope.user.birth_date = $scope.tmp_user.birth_date.toString();
    $scope.user.updated_at = Date();
    $state.go( 'overview' );
  };
});
