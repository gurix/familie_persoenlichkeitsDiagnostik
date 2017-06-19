app.controller('SessionsImageCapturingController', function($scope, $cordovaCamera, $ionicPlatform) {
  $scope.supportsCamera = window.cordova; // Normal browser does not have the cordova object atm
  
  // Trigger a normal upload and save it as base64String if the cordovaCamera is not supported
  $scope.uploadFile = function(event){
    var f = event.target.files[0]; // FileList object
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        var binaryData = e.target.result;
        //Converting Binary Data to base 64
        var base64String = window.btoa(binaryData);
        //showing file converted to base64
        $scope.session.image  = "data:" + theFile.type + ";base64," + base64String;
      };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsBinaryString(f);
  };
  
  /**
  * Adds a picture via cordovaCamera
  */
  $scope.addPicture = function() {
    $ionicPlatform.ready(function() {
      var options = {
        quality: 70,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 600,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };
      
      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.session.image = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        console.log(err);
      });
    });
  };
  
  /**
  * Removes a picture from the session
  */
  $scope.removePicture = function() {
    $scope.session.image = null;
  };
  
});
