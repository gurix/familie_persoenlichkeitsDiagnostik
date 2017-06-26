app.controller('SessionsDetailsController', function($scope, $stateParams, $translate, userService) {
  
  /**
  * Filter only custom fields available with full functionality
  */
  $scope.custom_field_dimensions = $scope.custom_fields.map(function(field) {
    if(field && field.key && field.title && field.lower_value && field.upper_value) {
      return field.key;
    }
  });
  
  $scope.dimensions = ['parenting_basic_needs', 'parenting_skills'];
  $translate(['questionary.parenting_basic_needs', 'questionary.parenting_skills'])
  .then(function (translations) {
    $scope.dimension_labels = [];
    angular.forEach(translations, function(element) {
      $scope.dimension_labels.push(element);
    });
  });
  
  function initialize() {
    $scope.session = userService.sessions().find(function(session) {
      return(session.local_id === $stateParams.local_id);
    });
  }
  
  $scope.$on('sessions_changed', function() {
    initialize();
  });
  
  initialize();
});
