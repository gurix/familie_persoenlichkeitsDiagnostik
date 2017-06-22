app.controller('NotificationsController', function($scope, notificationService) {
  
  $scope.notifications_enabled = function() {
    return notificationService.notifications_enabled();
  };
  
  // Reset an recalculate notifications
  $scope.generateNotifications = function() {
    notificationService.generateNotifications();
  };
  
  $scope.test_notification = function() {
    notificationService.testNotification();
  };
});
