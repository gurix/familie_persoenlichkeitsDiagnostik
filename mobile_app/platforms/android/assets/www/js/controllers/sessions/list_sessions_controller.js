app.controller('SessionsListSessionsController', function($scope, userService, $state) {
  
  $scope.showDelete = false; // Toggles the delete button for the list
  $scope.my_displayed_sessions = [];

  $scope.my_sessions = userService.sessions().sort(function(a, b){
   var dateA=new Date(a.started_at);
   var dateB=new Date(b.started_at);
   return dateB-dateA;
  });
  
  /**
  * Loads more session when the bottom of scroll area is reached
  */
  $scope.load_more = function() {
    if ($scope.my_displayed_sessions.length < $scope.my_sessions.length) {
      var amount = 5;
      var start = $scope.my_displayed_sessions.length;
      var end = ($scope.my_displayed_sessions.length + amount);
      if (end >= $scope.my_sessions.length) {
        end = $scope.my_sessions.length;
      }
      
      for (i = start; i < end; i++) {
        $scope.my_displayed_sessions.push($scope.my_sessions[i]);
      }
    }
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };
  
  /**
  * Deletes a session from the list
  */
  $scope.delete = function(session) {
    $scope.my_sessions.splice($scope.my_sessions.indexOf(session), 1);
    $scope.my_displayed_sessions.splice($scope.my_displayed_sessions.indexOf(session), 1);
    session.deleted_at = session.updated_at = Date();
  };

  /**
  * Calculates the size of an object and returns it's formated byte size
  */
  $scope.memorySizeOf = function(obj) {
    var bytes = 0;

    function sizeOf(obj) {
      if(obj !== null && obj !== undefined) {
          switch(typeof obj) {
          case 'number':
              bytes += 8;
              break;
          case 'string':
              bytes += obj.length * 2;
              break;
          case 'boolean':
              bytes += 4;
              break;
          case 'object':
              var objClass = Object.prototype.toString.call(obj).slice(8, -1);
              if(objClass === 'Object' || objClass === 'Array') {
                  for(var key in obj) {
                      if(!obj.hasOwnProperty(key)) continue;
                      sizeOf(obj[key]);
                  }
              } else bytes += obj.toString().length * 2;
              break;
          }
      }
      return bytes;
    }
    
    // Formats the bytes for better readability
    formatByteSize = function(bytes) {
        if(bytes < 1024) return bytes + " bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
        else return(bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
  };
  
  /**
  * View session details
  */
  $scope.viewSession = function (session) {
    $state.go( 'sessions.show', {local_id: session.local_id} );
  };
  
  $scope.load_more();
});
