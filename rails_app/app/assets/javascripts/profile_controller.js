app.controller('ProfileController', ['$scope', '$localForage', '$http', 'questionaryService', function($scope, $localForage, $http, questionaryService) {
  
  $scope.sessions = [];
  $scope.custom_field_dimensions = [];
  $scope.data_loaded = false;
  $scope.display = {};
  
  function error_callback(response) {
    console.log(response);
  }
  
  $scope.initialize = function(view_token) {
    $http.get(view_token + '/sessions').then(function(response) {
      $scope.sessions = response.data;
      console.log('Found ' + $scope.sessions.length + ' remote sessions.');
      $scope.data_loaded = true;
      
      // Extract custom fields
      $scope.sessions.forEach(function(session) {
        session.answers.forEach(function(answer) {
          if (answer.meta && answer.meta.key && $scope.custom_field_dimensions.indexOf(answer.meta.key) < 0) {
            $scope.custom_field_dimensions.push(answer.meta.key);
          }
        });
      });
      
      // Generating a new chart
      $scope.chart = new Chartist.Bar('#mainchart', $scope.chart_data());
    }, error_callback);
  };
  
  $scope.dispalyed_dimensions = function() {
    var dimensions = [];
    if ($scope.display) {      
      Object.keys($scope.display).forEach(function (key) {
        if ($scope.display[key] === true) dimensions.push(key);
      });
    }
    return(dimensions);
  };
  
  // Returns data formated to use it in the chartist chart
  $scope.chart_data = function () {
    return {
      labels: questionaryService.fix_categories(),
      series: $scope.series
    };
  };
  
  // Options passed to diplay the chart
  $scope.chart_options = function () {
    return {
      showArea: true,
      showLine: true,
      showPoint: false,
      axisY: {
        showLabel: true,
        onlyInteger: true
      }
    };
  };
  
  // Reaggregate data and update chart afterwards.
  $scope.re_aggregate = function () {
    // Just use requested dimensions
    questionaryService.dimensions = $scope.dispalyed_dimensions();
    questionaryService.sessions = $scope.sessions; 
    // Aggregate the whole shit
    $scope.data = questionaryService.aggregeate();
    
    // Empty the series to reaggregate it
    $scope.series = [];
    $scope.tmp_sessions = [];
    
    var i=0;
    // Aggregate sessions for each visible dimension
    questionaryService.dimensions.forEach(function(dimension) {
      // Calculate the serie for the dimension
      var serie = questionaryService.fix_categories().map(function(category) {
        if ($scope.data[dimension] && $scope.data[dimension][category]) {
          value = $scope.data[dimension][category].length;
          // Push session into a temporary array to display
          $scope.data[dimension][category].forEach(function(session) {
            if ($scope.tmp_sessions.indexOf(session) < 0) {
              $scope.tmp_sessions.push(session);
            }
          });
        } else {
          value = null;
        }
        return value;
      });
      
      // // Push aggregated serie to the list of series
      var klass = dimension;
      if ($scope.custom_field_dimensions.indexOf(dimension) >= 0) {
        klass = "col" + $scope.custom_field_dimensions.indexOf(dimension);
      }
      
      $scope.series.push({
        className: klass,
        data: serie
      });
      
    });
    
    // Finally update the chart
    $scope.chart.update($scope.chart_data(), $scope.chart_options());
    
    $scope.display_sessions = [];
    $scope.tmp_sessions = $scope.tmp_sessions.sort(function(a, b){
     var dateA=new Date(a.started_at);
     var dateB=new Date(b.started_at);
     return dateB-dateA;
    });
  };
}]);
