app = angular.module('ionicApp', ['ionic', 'pascalprecht.translate', 'ngCordova', 'LocalForageModule', 'ya.nouislider'])

.constant("appConfig", {
  "backend_server": "http://familie.persoenlichkeitsdiagnostik.ch"
  // "backend_server": "http://localhost:3000"
})

// Directive to validate to compare two fields i.o password and password_confirmation
.directive('sameAs', function () {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        var modelToMatch = attrs.sameAs;      

        scope.$watch(attrs.sameAs, function() {
          ctrl.$validate();          
        });

        ctrl.$validators.match = function(modelValue, viewValue) {
          return viewValue === scope.$eval(modelToMatch);
        };
      }
   };
})

.directive('validateEmail', function() {
  var EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      // only apply the validator if ngModel is present and Angular has added the email validator
      if (ctrl && ctrl.$validators.email) {

        // this will overwrite the default Angular email validator
        ctrl.$validators.email = function(modelValue) {
          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  };
})
 // see http://stackoverflow.com/a/19647381/437892
 // Needed for file upload in browser
.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
})

.run(function($rootScope, $ionicPlatform, $localForage, $state, syncService, notificationService) {
  $rootScope.redirect_to_new_session = false;
  
  $rootScope.sessions = [];
  
  /**
  * Cast string value to a real date object
  */
  $rootScope.toDate = function(value) {
    return(new Date(value));
  };
  
  
  $ionicPlatform.registerBackButtonAction(function (event) {
    if ($state.$current.name=="overview"){
      // H/W BACK button is disabled for these states and exits the app
      navigator.app.exitApp();
    } else {
      // For all other states, the H/W BACK button is enabled
      navigator.app.backHistory();
    }
  }, 100);
  
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    // Initialize app and bind globally
    function init() {
      $localForage.bind($rootScope, { key: 'sessions', defaultValue: []}).then(function(sessions){
        $rootScope.$broadcast('sessions_changed');
        
        $localForage.bind($rootScope, { key: 'custom_fields', defaultValue: []}).then(function(){
        
          $localForage.bind($rootScope, { key: 'user', defaultValue: {}}).then(function(data) {
            if ($rootScope.redirect_to_new_session) {
              $state.go( 'sessions.new' );
            } else {
              if(data && data.id && data.authentication_token) {
                syncService.sync();
                $state.go( 'overview' );
              } else {
                $state.go( 'identification.terms_and_conditions' );
              }
            }
          });
        });
      });
    }
    
    // If there is a click on a notification reinit the whole app and redirect to new session page
    $rootScope.$on('$cordovaLocalNotification:click',function (event, notification, state) {
      $rootScope.redirect_to_new_session = true;
      // Enque next x notifications
      notificationService.enqueue_notifications()
      init();
    });
    
    // Initize app on start
    init();
  });
});
