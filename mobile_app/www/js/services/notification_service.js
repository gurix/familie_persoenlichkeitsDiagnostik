app.service('notificationService', function($rootScope, $localForage, $ionicPlatform, $translate, $cordovaLocalNotification) {
  
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
      
      // Add the new randomly generated time to the dates when no conflict is present
      if(conflict === false) dates.push(randTime);
      i++;
    }
    return(dates.sort());
  };
    
  // Bind amount of notifications per day and expiration date globally
  $localForage.bind($rootScope, { key: 'notifications', defaultValue: { per_day: 0 , expiration: new Date()} });
  
  this.notifications_enabled = function() {
    return($rootScope.notifications && $rootScope.notifications.per_day > 0 && $rootScope.notifications.expiration >= today());
  };
  
  this.generateNotifications = function() {
    // Clear future notifications first
    if (window.cordova) {
      $cordovaLocalNotification.cancelAll();
    }
    console.log('Cancel all notifications');
    
    if (this.notifications_enabled()) {
      var dates = [];
      
      // Calculate randomized timestamps for each day until the given date
      start = today();
      end = new Date($rootScope.notifications.expiration);
      end.setHours(23,59,59,0);
      while(start < end){
         dates = dates.concat(randomize_per_day(start));
         var newDate = start.setDate(start.getDate() + 1);
         start = new Date(newDate);
      }

      $translate('notifications.title').then(function (title) {
        var i = 1;
        // Add notification for each date
        dates.forEach(function(date) {
          if (window.cordova) {
            $cordovaLocalNotification.schedule({
               id: i,
               title: 'Erziehungskompetenz und elterlichen Grundbedürfnisse',
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
    }
  };

  this.testNotification = function() {
    var _5_sec_from_now = new Date(new Date().getTime() + 5 * 1000);
    if (window.cordova) {
      $cordovaLocalNotification.schedule({
        id: 666,
        title: 'Erziehungskompetenz und elterlichen Grundbedürfnisse',
        text: "Diese Mitteilung erscheint als Test nach 5 Sekunden.",

        at: _5_sec_from_now
      });

      console.log('Test notification at', _5_sec_from_now);
    } else {
      console.log('Add virtually notification at' , new Date(_5_sec_from_now));
    }   
  };
});
