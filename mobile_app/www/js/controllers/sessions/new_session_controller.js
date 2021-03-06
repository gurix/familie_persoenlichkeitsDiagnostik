app.controller('SessionsNewSessionController', function($scope, $ionicPlatform, $ionicPopup, $translate, userService, $cordovaGeolocation, $state, syncService, $ionicScrollDelegate, notificationService) {
  $scope.step = 0; // Counting steps within the wizzard
  
  /**
  * Filter only custom fields available with full functionality
  */
  $scope.available_custom_fields = $scope.custom_fields.filter(function(field) {
    return(field && field.key && field.title && field.lower_value && field.upper_value);
  });
  
  /**
  * Increase the step within the wizzard when clicking on "Next"
  */
  $scope.stepUp = function() {
    $scope.step++;
    $ionicScrollDelegate.scrollTop();
  };
  
  /**
  * Determaninate when the next button is shown
  */
  $scope.showNext = function() {
    var not_last_step = $scope.step < $scope.steps.length - 1;
    var not_situation_step = $scope.steps[$scope.step].template != 'situation';
    var situation_set_on_situation_step = $scope.session.situation && $scope.steps[$scope.step].template == 'situation';
    
    return(not_last_step && (not_situation_step || situation_set_on_situation_step));
  };
  
  /**
  * Decrease the step within the wizzard when clicking on "Previous"
  */
  $scope.stepBack = function() {
    $scope.step--;
    $ionicScrollDelegate.scrollTop();
  };
  
  $scope.get_answer_for = function(key) {
    return($scope.session.answers.find(function(a) { return(a.key == key); }));
  };
  
  /**
  * Displays a popup that prompts for cancelation of the current input.
  * Clicking Ok, exits input and displays the overview again.
  */
  $scope.cancelNewSession = function() {
    $translate(['sessions.cancel_new_sesion.title', 'shared.ok', 'shared.cancel']).then(function (translations) {
      $ionicPopup.confirm({
        title: translations["sessions.cancel_new_sesion.title"],
        cancelText: translations['shared.cancel'],
        okText: translations['shared.ok']
      }).then(function(res) {
       if(res) { $state.go( 'overview' ); }
      });
    });
  };
  
  /**
  * Finally saves the session
  */
  $scope.save = function(session) {
    // Recode answers if necessary
    session.answers.forEach(function(answer) {
      if (answer.recoded === 1){
        answer.recoded_value = answer.value * (-1);
      } else {
        answer.recoded_value = answer.value;
      }
    });
    // Publish temporary session
    $scope.sessions.push(session);

    // Enque next x notifications
    notificationService.enqueue_notifications()

    // Try to sync after adding session
    syncService.sync();
    $state.go( 'overview' );
  };
  
  // Initialize new session
  $scope.session = {
    started_at: Date(),
    local_id: makeid(),
    user_id: userService.user_id(),
    answers: [],
    version: 0
  };
  
  // Try to get a the exact position where the image was taken
  if (window.cordova) { // Ugly nasty hack otherwise we cannot test 
    $ionicPlatform.ready(function() {
      $cordovaGeolocation.getCurrentPosition({}).then(function (position) {
        $scope.session.gps_position  = { lat: position.coords.latitude, long: position.coords.longitude };
      });
    });
  }
  
  explicit_mrs_per_page = 5;
  
  // Initiate questionar
  $scope.parenting_competences_questionnaire = new Questionnaires.GermanParentingCompetences();
  $scope.parenting_basic_needs_questionnaire = new Questionnaires.GermanParentingBasicNeeds();

  // Assign questionnaire data 
  $scope.parenting_competences = $scope.parenting_competences_questionnaire.items;
  $scope.parenting_basic_needs = $scope.parenting_basic_needs_questionnaire.items;
  
  // Shuffle items
  $scope.parenting_competences = shuffle($scope.parenting_competences);
  $scope.parenting_basic_needs = shuffle($scope.parenting_basic_needs);
  
  // For each new sesion we recode some items randomly to be sure
  // that the valence changes in each session. 
  // The displayed recoding will be stored in ansewer[key].recoded.
  // The value does NOT to be recoded later
  $scope.steps = [];
  
  var counter = 0;
  for (var parenting_competences_counter = 0; parenting_competences_counter < $scope.parenting_competences.length; parenting_competences_counter++) { 
    // Set default values
    $scope.session.answers[counter] = {
      recoded: $scope.parenting_competences[parenting_competences_counter].recoded,
      key: $scope.parenting_competences[parenting_competences_counter].key,
      position: parenting_competences_counter,
      value: 0, 
      recoded_value: 0
    };
    counter++;
  }
  
  $scope.steps.push({
    template: 'sliderlist',
    title: $scope.parenting_competences_questionnaire.title,
    items: $scope.parenting_competences,
    scale: $scope.parenting_competences_questionnaire.scale
  });
  
  // Use a temporary item list hence we don't append all at once
  var tmp_items = [];
  for (var parenting_basic_needs_counter = 0; parenting_basic_needs_counter < $scope.parenting_basic_needs.length; parenting_basic_needs_counter++) { 
    // Set default values
    $scope.session.answers[counter] = {
      recoded: 0,
      key: $scope.parenting_basic_needs[parenting_basic_needs_counter].key,
      position: parenting_basic_needs_counter,
      value: 0, 
      recoded_value: 0 
    };
    counter++;
  }

  $scope.steps.push({
    template: 'sliderlist',
    title: $scope.parenting_basic_needs_questionnaire.title,
    items: $scope.parenting_basic_needs,
    scale: $scope.parenting_basic_needs_questionnaire.scale
    
  });
  
  for (var custom_fields_counter = 0; custom_fields_counter < $scope.available_custom_fields.length; custom_fields_counter++) {
    var custom_field = $scope.available_custom_fields[custom_fields_counter];
    // Set default values
    $scope.session.answers[counter] = {
      recoded: (Math.floor(Math.random() * 9) % 2),
      key: custom_field.key,
      position: counter,
      value: 0, 
      recoded_value: 0 ,
      meta: custom_field
    };
    
    $scope.steps.push({
      template: 'sliderlist',
      title: $scope.available_custom_fields[custom_fields_counter].title,
      items:[$scope.available_custom_fields[custom_fields_counter]] 
    });
    counter++;
  }
  
  $scope.steps.push({
    template: 'situation'
  });
  
  $scope.steps.push({
    template: 'situation_description'
  });
  
  $scope.steps.push({
    template: 'photo'
  });
});
