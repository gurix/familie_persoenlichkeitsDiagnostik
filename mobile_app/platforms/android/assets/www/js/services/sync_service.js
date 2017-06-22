app.service('syncService', function($http, appConfig, userService, $rootScope, onlineStatus) {
  var remote_sessions = []; // Stores session_id, local_id and updated_at of all sessions available remotely
  var sessions_to_download = []; // Stores a list of sessions not downloaded yet
  var sessions_to_update_localy = []; // Stores a list of sessions where the remote version is newer
  var sessions_to_update_remotely = []; // Stores a list of sessions where the local version is newer
  var sessions_to_create_remotely = []; // Sessions only available locally and needed to push to the server
  var sync_error = false;
  
  var temporary_sessions = []; // Cache for temporary sessions
  
  $rootScope.pending_syncs = 0; // Indicates the amount of pending syncs done in a cycle
  $rootScope.finished_syncs = 0; // Indicates a amount of finished syncs.
  $rootScope.cancel_sync = false; // Switch to request to cancel the sync.

  function error_callback(response) {
    sync_error = true;
    console.log(response);
  }

  /**
  * Finish the sync process after cancelation was triggered
  */
  function finnishing() {
    $rootScope.pending_syncs = 0;
    $rootScope.finished_syncs = 0; 
    $rootScope.cancel_sync = false;
  }
  
  function local_session_by_id(id) {
    return(userService.sessions_including_deleted().find(function(session){
      return session.id == id;
    }));
  }
  
  function delete_session(local_session) {
    // Remove session from local storage
    $rootScope.sessions.splice($rootScope.sessions.indexOf(local_session), 1);
    // Remove session from remote sessions because we don't need to process them later
    to_delete = remote_sessions.find(function(session) { return session.local_id == local_session.local_id; });
    remote_sessions.splice(remote_sessions.indexOf(to_delete),1);
  }
  
  /**
  * Push an array of sessions which not exists remotely to the server 
  */
  function create_sessions_remotely(sessions_to_create) {
    if($rootScope.cancel_sync) {
      finnishing();
    } else {  
      if(sessions_to_create.length > 0){
        local_session = sessions_to_create.pop();
        $http.post(appConfig.backend_server+ '/api/v1/sessions?' + userService.backend_authentication(),{
          session: local_session
        }).then(function successCallback(response) {
          if(local_session.deleted_at) {
            delete_session(local_session); // Delete non snyced sessions after upload
          } else {
            local_session.id = response.data._id.$oid;
            local_session.updated_at = response.data.updated_at;
          }
          console.log('Remote session ' + local_session.local_id + ' created');
          $rootScope.finished_syncs++;
          create_sessions_remotely(sessions_to_create);
        }, error_callback);
      } else {
        process_remote_sessions();
      }
    }
  } 
  
  /**
  * Updates an array of remotely session ids which are newer locally
  */
  function update_sessions_remotely(ids) {
    if($rootScope.cancel_sync) {
      finnishing();
    } else {  
      if(ids.length > 0){
        local_session = local_session_by_id(ids.pop());
        $http.put(appConfig.backend_server+ '/api/v1/sessions/' + local_session.id + '?' + userService.backend_authentication(),{
          session: local_session
        }).then(function successCallback(response) {
          if(local_session.deleted_at) {
            delete_session(local_session); // Delete snyced sessions after upload
          } else {
            local_session.updated_at = response.data.updated_at;
          }
          console.log('Remote session ' + local_session.local_id + ' updated');
          $rootScope.finished_syncs++;
          update_sessions_remotely(ids);
        }, error_callback);
      } else {
        create_sessions_remotely(sessions_to_create_remotely);
      }
    }
  }
  
  /**
  * Updates an array of locally session ids which are newer remotely
  */
  function update_sessions_localy(ids) {
    if($rootScope.cancel_sync) {
      finnishing();
    } else { 
      if(ids.length > 0){
        local_session = userService.sessions_including_deleted().find(function(session){
          return session.id == ids.pop();
        });
        
        $http.get(appConfig.backend_server+ '/api/v1/sessions/' + local_session.id + '?' + userService.backend_authentication())
        .then(function successCallback(response) {
          for (var key in response.data) {
            if (response.data.hasOwnProperty(key)) {
              local_session[key] = response.data[key];
            }  
          }
          
          // Add user_id to the session
          local_session.user_id = userService.user_id();
          console.log('Local session ' + local_session.local_id + ' updated');
          $rootScope.finished_syncs++;
          update_sessions_localy(ids);
        }, error_callback);
      } else {
        update_sessions_remotely(sessions_to_update_remotely);
      }
    }
  }
  
  /**
  * Process local sessions, update or push them to the server if necessary
  */
  function process_local_sessions() {
    console.log('Process local sessions');
    sessions_to_update_localy = [];
    sessions_to_update_remotely = [];
    sessions_to_create_remotely = [];
    
    userService.sessions_including_deleted().forEach(function(local_session){
      // Find the corresponding remote session
      remote_session = remote_sessions.find(function(remote_session){
        return local_session.local_id == remote_session.local_id;
      });
      
      if (remote_session) {
        remote_updated_at = new Date(remote_session.updated_at);
        local_updated_at = new Date(local_session.updated_at);
        
        // Download the remote session if it's newer than the local one
        if (remote_updated_at > local_updated_at) {
          $rootScope.pending_syncs++;
          sessions_to_update_localy.push(local_session.id);
        }
        // Upload the local session if it's newer then the remote one
        if (remote_updated_at < local_updated_at) {
          $rootScope.pending_syncs++;
          sessions_to_update_remotely.push(local_session.id);
          
        }    
      } else {
        // Upload all sessions not beeing on the server according the list of remote_sessions
        $rootScope.pending_syncs++;
        sessions_to_create_remotely.push(local_session);
      }
    });
    
    update_sessions_localy(sessions_to_update_localy);
  }
  
  /**
  * Save temporary downloaded sessions
  */
  function save_temporary_sessions() {
    console.log('Append ' + temporary_sessions.length + ' temporary sessions to my sessions');
    $rootScope.sessions = $rootScope.sessions.concat(temporary_sessions);
    temporary_sessions = [];
  }
  
  /**
  * Download a session based on an array of sessions
  */
  function download_sessions(ids) {
    if($rootScope.cancel_sync) {
      save_temporary_sessions();
      finnishing();
    } else {  
      // Download the other ids
      if(ids.length > 0){
        $http.get(appConfig.backend_server+ '/api/v1/sessions/' + ids.pop() + '?' + userService.backend_authentication()).then(function(response) {
          var local_session = response.data;
          local_session.id = response.data._id.$oid;
          local_session.user_id = userService.user_id();
          temporary_sessions.push(local_session);
          console.log('Session ' + local_session.local_id + ' downloaded');
          $rootScope.finished_syncs++;
          if ($rootScope.finished_syncs % 20 === 0) save_temporary_sessions();
          
          download_sessions(ids);
        }, error_callback);
      } else {
        save_temporary_sessions();
        finnishing();
        console.log('Synchronisation sucessfulley finished');
      }
    }
  }
  
  /**
  * Process all remote sessions and download them if necessary
  */
  process_remote_sessions = function() {
    console.log('Process remote session.');
    temporary_sessions = [];
    sessions_to_download = [];
    remote_sessions.forEach(function(remote_session){
      
      // Find the corresponding local session
      local_session = $rootScope.sessions.find(function(local_session){
        return local_session.local_id == remote_session.local_id;
      });
      
      // Download the remote session if the local one does not exist
      if (!local_session) {
        $rootScope.pending_syncs++;
        sessions_to_download.push(remote_session._id.$oid);
      }
    });
    
    download_sessions(sessions_to_download);  
  };
  
  /**
  * Downloads a list of all sessions available remotely with their update time
  */
  list_remote_sessions = function() {
    console.log('Request list of all available session stored remotely');
    remote_sessions = [];
    // Get a list of all remote sessions and process them
    $http.get(appConfig.backend_server+ '/api/v1/sessions?' + userService.backend_authentication()).then(function(response) {
      remote_sessions = response.data;
      console.log('Found ' + remote_sessions.length + ' remote sessions.');
      
      if($rootScope.cancel_sync) {
        finnishing();
      } else {
        process_local_sessions();
      }
    }, error_callback);
  };
  
  /**
  * Process remote user
  */
  process_remote_user = function() {
    console.log('Process remote user');
    $rootScope.pending_syncs++;
    // Get remote user data and process them
    $http.get(appConfig.backend_server+ '/api/v1/user?' + userService.backend_authentication()).then(function(response) {
      console.log('Get data for remote user');
      remote_user = response.data;
      
      remote_updated_at = new Date(remote_user.updated_at);
      local_updated_at = new Date($rootScope.user.updated_at);
      
      // Upload the local user if it's newer then the remote one
      if (remote_updated_at < local_updated_at) {
        console.log('Update remote user');
        $http.put(appConfig.backend_server + '/api/v1/user?' + userService.backend_authentication(),{
          user: $rootScope.user
        });
      } else {
        console.log('Update local user');
      
        // Overwrite the local user if it is older then the remote one
        $rootScope.user.email = remote_user.email;
        $rootScope.user.first_name = remote_user.first_name;
        $rootScope.user.last_name = remote_user.last_name;
        $rootScope.user.gender = remote_user.gender;
        $rootScope.user.birth_date = remote_user.birth_date;
        $rootScope.user.updated_at = remote_user.updated_at;
      }
      $rootScope.finished_syncs++;
      
      if($rootScope.cancel_sync) {
        finnishing();
      } else {
        list_remote_sessions();
      }
    }, error_callback);
  };
  
  /**
  * Initialize the syncing process
  */
  this.sync = function() {
    if (onlineStatus.onLine) {
      if ($rootScope.pending_syncs === 0) {
        console.log('Starting synchronisation');
        $rootScope.pending_syncs = 0;
        $rootScope.finished_syncs = 0;
        
        process_remote_user();
      } else {
        if (sync_error === true) {
          finnishing();
        } else {
          $rootScope.cancel_sync = true;
          console.log('Cancelation of synchronisation requested');  
        }
      }  
    }
  };
});
