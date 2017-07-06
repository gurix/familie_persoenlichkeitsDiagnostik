app.controller('SessionsDetailsController', function($scope, $stateParams, $translate, userService) {
  
  /**
  * Filter only custom fields available with full functionality
  */
  $scope.custom_field_dimensions = $scope.custom_fields.map(function(field) {
    if(field && field.key && field.title && field.lower_value && field.upper_value) {
      return field.key;
    }
  });
  
  $scope.competences_dimensions = ['parenting_competences_self_efficacy', 'parenting_competences_satisfaction'];
  $translate(['questionary.parenting_competences.self_efficacy', 'questionary.parenting_competences.satisfaction'])
  .then(function (translations) {
    $scope.competences_dimension_labels = [];
    angular.forEach(translations, function(element) {
      $scope.competences_dimension_labels.push(element);
    });
  });

  $scope.basic_needs_dimensions = ['parenting_basic_needs_bonding', 'parenting_basic_needs_self_esteem', 'parenting_basic_needs_control', 'parenting_basic_needs_autonomy'];
  $translate(['questionary.parenting_basic_needs.bonding', 'questionary.parenting_basic_needs.self_esteem', 'questionary.parenting_basic_needs.control', 'questionary.parenting_basic_needs.autonomy'])
  .then(function (translations) {
    $scope.basic_needs_dimension_labels = [];
    angular.forEach(translations, function(element) {
      $scope.basic_needs_dimension_labels.push(element);
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
