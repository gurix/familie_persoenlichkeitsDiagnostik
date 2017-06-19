app.config(function($stateProvider, $urlRouterProvider, $translateProvider, $ionicConfigProvider) {
  // Security related things according http://angular-translate.github.io/docs/#/guide/19_security
  $translateProvider.useSanitizeValueStrategy('escape');
  // Async loading according http://angular-translate.github.io/docs/#/guide/12_asynchronous-loading
  $translateProvider.useStaticFilesLoader({
    prefix: 'locale-',
    suffix: '.json'
  });
  // atm we only use German
  $translateProvider.preferredLanguage("de");
  $translateProvider.fallbackLanguage("de");
  
  $stateProvider.state('identification', {
    url: '/identification',
    templateUrl: 'identification.html',
    controller: 'IdentificationController'
  })
  .state('identification.terms_and_conditions', {
    url: '/terms_and_conditions',
    templateUrl: 'identification/terms_and_conditions.html',
  })
  .state('identification.email', {
    url: '/email',
    templateUrl: 'identification/email.html',
  })
  .state('identification.register', {
    url: '/register',
    templateUrl: 'identification/registration.html',
  })
  .state('identification.signin', {
    url: '/signin',
    templateUrl: 'identification/signin.html',
  })
  .state('user', {
    url: '/user',
    template: '<ion-nav-view/>'
  })
  .state('user.edit_personal_data', {
    url: '/edit_personal_data',
    templateUrl: 'user/edit_personal_data.html',
  })
  .state('overview', {
    url: '/overview',
    templateUrl: 'overview.html',
    controller: 'OverviewController'
  })
  .state('sessions', {
    url: '/sessions',
    template: '<ion-nav-view/>'
  })
  .state('sessions.list', {
    url: '/list',
    templateUrl: 'sessions/list.html',
  })
  .state('sessions.new', {
    url: '/new',
    templateUrl: 'sessions/new.html'
  })
  .state('sessions.profile', {
    url: '/profile',
    templateUrl: 'sessions/profile.html'
  })
  .state('sessions.show', {
    url: '/show?local_id',
    templateUrl: 'sessions/show.html'
  })
  .state('custom_fields', {
    url: '/custom_fields',
    templateUrl: 'custom_fields.html'
  })
  .state('notifications', {
    url: '/notifications',
    templateUrl: 'notifications.html'
  });
  
  $urlRouterProvider.otherwise('/');
});
