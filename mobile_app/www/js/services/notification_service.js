app.service('notificationService', function($rootScope, $localForage, $ionicPlatform, $translate, $cordovaLocalNotification, $filter) {
  
  /**
  * For iOS 8 only, it is a requirement to request for notification permissions first.
  * https://devdactic.com/local-notifications-ionic/
  */
  $ionicPlatform.ready(function() {
    try {
      if(device.platform === "iOS") {
          window.plugin.notification.local.registerPermission();
      }
    } catch(err) {
      console.log('device informations not accessible');
    }
  });
  
  // Set a minimum of time between two notifications
  var minimal_space_between = 10 * (60*1000);

  // We only enqueue a certain amount of notifications if the user ignores notifications the app will stopp send new notifications until new actions done
  var amount_of_notifications_to_enqueue = 30
  
  // Returns the Date object at the very beginning of the day
  today = function() {
    var today = new Date();
    today.setHours(0,0,0,0);
    return(new Date(today));
  };
  
  // Defines the time when the first notification of the day can occur at a certain date
  startTime = function(date) {
    var start = new Date(date);
    return(start.setHours(7,0,0,0));
  };
  
  // Defines the time when the last notification of the day can occur at a certain date
  endTime = function(date) {
    var end = new Date(date);
    return(end.setHours(21,0,0,0));
  };
  
  /**
  * Generates an array of timestamps within a certain time span of that day
  * It calculates randomly timestamps with a certain space between and stopps after
  * some trials if no solution was found.
  */
  randomize_per_day = function(date) {
    // Ensure we throw notifications only on daylight
    var min = startTime(date);
    var max = endTime(date);
    
    // stopp after x loops if we don't find a solution
    var max_loops = 1000;
    var i  = 0;
    
    var dates = [];
    
    while(dates.length < $rootScope.notifications.per_day ) {
      if(i > max_loops) {
        break; // Can't find a proper solution
      }
      
      // Randomize a time between this two dates
      var randTime = Math.floor(Math.random() * (max - min + 1)) + min;  
      
      // Indicates wether a conflict with another date in the array happens
      var conflict = false;
      
      // Don't accept dates in the past
      if(randTime < new Date()) {
        conflict = true;
      }
      
      // Check all dates already added
      dates.forEach(function(entry) {
        if (entry < (randTime + minimal_space_between) && entry > (randTime - minimal_space_between)){
          conflict = true; // There is already a date 
        }
      });

      // Check whether the time slot is available, expect on weekends
      if (date.getDay() > 0 && date.getDay() < 6) {
        var randDate = new Date(randTime)
        
        if($rootScope.notifications.availibility.block_1 == false && randDate.getHours() >= 7 && randDate.getHours() <= 9) { conflict = true }
        if($rootScope.notifications.availibility.block_2 == false && randDate.getHours() >= 9 && randDate.getHours() <= 11) { conflict = true }
        if($rootScope.notifications.availibility.block_3  == false && randDate.getHours() >= 11 && randDate.getHours() <= 13) { conflict = true }
        if($rootScope.notifications.availibility.block_4  == false && randDate.getHours() >= 13 && randDate.getHours() <= 15) { conflict = true }
        if($rootScope.notifications.availibility.block_5  == false && randDate.getHours() >= 15 && randDate.getHours() <= 17) { conflict = true }
        if($rootScope.notifications.availibility.block_6  == false && randDate.getHours() >= 17 && randDate.getHours() <= 19) { conflict = true }
        if($rootScope.notifications.availibility.block_7  == false && randDate.getHours() >= 19 && randDate.getHours() <= 21) { conflict = true }
      } 
      
      // Add the new randomly generated time to the dates when no conflict is present
      if(conflict === false) dates.push(randTime);
      i++;
    }
    return(dates.sort());
  };
    
  // Bind amount of notifications per day and expiration date globally
  $localForage.bind($rootScope, { key: 'notifications', defaultValue: { 
    per_day: 0 , 
    expiration: new Date(), 
    availibility: {
      block_1: true,
      block_2: true,
      block_3: true,
      block_4: true,
      block_5: true,
      block_6: true,
      block_7: true
    }} 
  });
  
  this.notifications_enabled = function() {
    return($rootScope.notifications && $rootScope.notifications.per_day > 0 && $rootScope.notifications.expiration >= today());
  };
  
  this.generateNotifications = function() {
    
    // Clear future notifications first
    if (window.cordova) {
      $cordovaLocalNotification.cancelAll();
    }

    if (this.notifications_enabled()) {
      // We store all notification times in the app cache
      $rootScope.notifications.dates = [];
      
      // Calculate randomized timestamps for each day until the given date
      start = today();
      end = new Date($rootScope.notifications.expiration);
      end.setHours(23,59,59,0);
      while(start < end){
        $rootScope.notifications.dates = $rootScope.notifications.dates.concat(randomize_per_day(start));
        start = new Date(start.setDate(start.getDate() + 1));
      }

      // Enque the first x notifications
      // console.log($rootScope.notifications.dates.map(function(x) { return(new Date(x)) }))
      this.enqueue_notifications();
    }
  };

  // Enqueues a certain amount of notifications. This happens when we first generate all notifications or the user opens a notification.
  this.enqueue_notifications = function () {
    // Clear future notifications first
    if (window.cordova) {
      $cordovaLocalNotification.cancelAll();
    }

    $translate('notifications.title').then(function (title) {
      var i = 1;
      var future_dates = $rootScope.notifications.dates.filter(function(date) { return date > new Date() });
      
      // Add notification for each date
      future_dates.sort().slice(0, amount_of_notifications_to_enqueue) .forEach(function(date) {
        if (window.cordova) {
          $cordovaLocalNotification.schedule({
             id: i,
             title: 'Eltern im Fokus',
             text: title,
             at: new Date(date)
           });
           console.log('Add notification at', new Date(date), i);
        } else {
          console.log('Add virtually notification at' , new Date(date), i);
        }
        i++;
      });  
    });
  };

  this.testNotification = function() {
    var _5_sec_from_now = new Date(new Date().getTime() + 5 * 1000);
    if (window.cordova) {
      $cordovaLocalNotification.schedule({
        id: 666,
        title: 'Eltern im Fokus',
        text: "Diese Mitteilung erscheint als Test nach 5 Sekunden.",

        at: _5_sec_from_now
      });

      console.log('Test notification at', _5_sec_from_now);
    } else {
      console.log('Add virtually notification at' , new Date(_5_sec_from_now));
    }   
  };
});
