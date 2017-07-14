app.directive('sessionChart', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      session: '=',
      dimensions: '=',
      labels: '=',
      chartid: '='
    },
    templateUrl: 'sessions/chart_directive.html',
    link: function(scope, element, attrs) {
      scope.$watch('session', function(session) {
        if(session) {
          var i = 0;
          var series = scope.dimensions.map(function(dimension) {
            var dimension_regex = new RegExp('^' + dimension);
            
            // filter all items for a specific dimension
            var items = session.answers.filter(function(answer) {
              return answer.key.match(dimension_regex);
            });
            
            // Generate the sum of all items within this dimension
            var sum = 0;
            items.forEach(function(item) {
              sum = sum + Number(item.recoded_value);
            });
            
            // Calculate the mean
            avarage = Number(sum / items.length);
            
            var result = {
              className: "col" + i + " " + dimension,
              value: avarage
            };
            
            i++;
            
            return(result);
          });
          $timeout(function(){
            var chart = new Chartist.Bar('#' + scope.chartid +'_' + session.local_id, {
              labels: scope.labels,
              series: series
            }, { 
              high: 50,
              low: -50,
              axisY: {
                onlyInteger: true,
                scaleMinSpace: 10
              }
            });
          });
        }
      });
    }
  };
});
