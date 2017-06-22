app.controller('SessionsDetailsController', function($scope, $stateParams, $translate, userService) {
  
  /**
  * Filter only custom fields available with full functionality
  */
  $scope.custom_field_dimensions = $scope.custom_fields.map(function(field) {
    if(field && field.key && field.title && field.lower_value && field.upper_value) {
      return field.key;
    }
  });
  
  $scope.mrs20_dimensions = ['mrs20_n', 'mrs20_e', 'mrs20_v', 'mrs20_g', 'mrs20_k'];
  $translate(['questionary.mrs20.neuroticism', 'questionary.mrs20.extraversion', 'questionary.mrs20.agreeableness', 'questionary.mrs20.conscience', 'questionary.mrs20.openness'])
  .then(function (translations) {
    $scope.mrs20_dimension_labels = [];
    angular.forEach(translations, function(element) {
      $scope.mrs20_dimension_labels.push(element);
    });
  });
  
  $scope.panava_dimensions = ['panava_pa', 'panava_na', 'panava_va'];
  $translate(['questionary.panava.positive_affect', 'questionary.panava.negative_affect', 'questionary.panava.valence'])
  .then(function (translations) {
    $scope.panava_dimension_labels = [];
    angular.forEach(translations, function(element) {
      $scope.panava_dimension_labels.push(element);
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
