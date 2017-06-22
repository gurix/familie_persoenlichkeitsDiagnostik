app.directive('sessionBipolarSlider', function() {
  return {
    restrict: 'E',
    scope: {
      max: '=?',
      min: '=?',
      recoded: '=?',
      value: '=',
      textleft: '=',
      textright: '='
    },
    
    templateUrl: 'sessions/bipolar_slider_directive.html',
    controller: ['$scope', function sessionBipolarSliderController($scope) {
      
      // Assign initial values as options
      $scope.options = {
        start: $scope.value,
        range: { min: $scope.min || -50 , max: $scope.max || 50}
      };
      
      // Event handler has to update the value to simulate two way binding
      $scope.eventHandlers = {
        set: function(values, handle, unencoded) {
          $scope.value = values[0];
        }
      };
    }],
  };
});
