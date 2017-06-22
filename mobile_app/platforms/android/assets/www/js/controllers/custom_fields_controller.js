app.controller('CustomFieldsController', function($scope, $localForage, $state) {
  
  $scope.field_numbers = [0,1,2]; // Atm we just provide three custom fields, we can extend that later
  
  $scope.is_active = function(index) {
    if ($scope.custom_fields) {
      var field = $scope.custom_fields[index];
      return(field && field.key && field.title && field.lower_value && field.upper_value);
    }
  };
  
  $scope.is_name_unique = function(name) {
    var occurence = 0;
    if ($scope.custom_fields) {
      $scope.custom_fields.forEach(function(custom_field){
        if (custom_field.key && name == custom_field.key) occurence++;
      });
    }
    return(occurence < 2);
  };
});
