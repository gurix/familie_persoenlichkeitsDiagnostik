app.controller('SessionsProfileController', function($scope, userService, $filter, $localForage, questionaryService, $state) {
  $scope.data = {};
  $scope.series = [];
  $scope.display_sessions = [];
  $scope.tmp_sessions = [];
  $scope.limit = {low: -50, high: 50};
  $scope.display = {};
  
  /**
  * Filter only custom fields available with full functionality
  */
  $scope.custom_field_dimensions = $scope.custom_fields.map(function(field) {
    if(field && field.key && field.title && field.lower_value && field.upper_value) {
      return field.key;
    }
  }).filter(Boolean);
  
  $scope.limit_slider_options = {
    step: 10,
    connect: true,
    behaviour: 'tap-drag',
    pips: { mode: 'steps', density: 2 },
    start: [$scope.limit.low, $scope.limit.high],
    range: {min: -50, max: 50}
  };
  
  $scope.limit_slider_event = {
    set: function(values) {
      $scope.limit.low = values[0];
      $scope.limit.high = values[1];
      $scope.re_aggregate(); 
    }
  };
  
  /**
  * Array of dimension selected as visible
  */
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
  
  // Generating a new chart
  $scope.chart = new Chartist.Bar('#mainchart', $scope.chart_data());
  
  // Reaggregate data and update chart afterwards.
  $scope.re_aggregate = function () {
    // Just use requested dimensions
    questionaryService.dimensions = $scope.dispalyed_dimensions();
    // Adjust minimal and maximal value to be displayed
    questionaryService.minimal_value = parseInt($scope.limit.low);
    questionaryService.maximal_value = parseInt($scope.limit.high);
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
      
      // Push aggregated serie to the list of series
      var klass = dimension;
      if ($scope.custom_field_dimensions.indexOf(dimension) >= 0){
        klass = "col" + i;
        i++;
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
    
    $scope.load_more();
  };
  
  $scope.load_more = function() {
    if ($scope.display_sessions.length < $scope.tmp_sessions.length) {
      var amount = 5;
      var start = $scope.display_sessions.length;
      var end = ($scope.display_sessions.length + amount);
      if (end >= $scope.tmp_sessions.length) {
        end = $scope.tmp_sessions.length;
      }

      for (i = start; i < end; i++) {
        $scope.display_sessions.push($scope.tmp_sessions[i]);
      }
    }
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };
  
  /**
  * View session details
  */
  $scope.viewSession = function (session) {
    $state.go( 'sessions.show', {local_id: session.local_id} );
  };
});
