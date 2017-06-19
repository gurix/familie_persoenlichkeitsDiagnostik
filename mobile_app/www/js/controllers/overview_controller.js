app.controller('OverviewController', function($scope, $state, $ionicPopup, $translate, syncService, userService, onlineStatus) {
  $scope.onlineStatus = onlineStatus; // disable some content as synchronisation when the device is offline
  
  $scope.userService = userService;
  
  // An alert dialog
  $scope.show_not_implemented_alert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Not implemented',
      template: 'This feature is not implemented at the moment. Keep calm and carry on.'
    });
  };
  
  $scope.sync = function() {
    syncService.sync();
  };
  
  $scope.is_syncing = function() {
    return($scope.pending_syncs > 0);
  };
  
  /**
  * Ask a user to sign out and signs out if requested
  */
  $scope.sign_out = function(){
    $translate(['overview.sign_out_confirmation.title', 'overview.sign_out_confirmation.text', 'shared.ok', 'shared.cancel']).then(function (translations) {
      $ionicPopup.confirm({
        title: translations["overview.sign_out_confirmation.title"],
        template: translations["overview.sign_out_confirmation.text"],
        cancelText: translations['shared.cancel'],
        okText: translations['shared.ok']
      }).then(function(res) {
       if(res) { userService.sign_out(); }
      });
    });
  };
});
