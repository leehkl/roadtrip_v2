/*
 * Inspiration for camera functionality:
 * https://learn.ionicframework.com/formulas/cordova-camera
 */
angular.module('starter.controllers', ['starter.services','ionic', 'ngResource', 'ngStorage', 'ngCordova'])

.config(function($compileProvider){
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.controller('MainCtrl', function($scope) {})

/*
 * API handlers
 * code inspired by: devdactic.com/improving-rest-withngresource/
 * AND learn.ionicframework.com/formulas/backend-data/
 */

//USERS
//Add new user
.controller('NewUser', function($scope, $localStorage, UserService) {
  $scope.newUser = function(){
    UserService.save({username:$scope.username, password:$scope.password, name:$scope.name, city:$scope.city, email:$scope.email},{});
    }; 
})

//Get all users/search for users
.controller('GetUsers', function($scope, $localStorage, UserService){

  //LOGIN PAGE
  $scope.login = function(){
    //search for user by username
    $scope.users = UserService.get({username:$scope.username},
      function(){
        //get user-specific information
        var currentUser = $scope.users.keys[0];
        $scope.user = UserService.get({id:currentUser},
          function(){
            if($scope.user.password == $scope.password){
              $localStorage.currentUser = currentUser;
//              $scope.test = "Success!";
              $scope.test = $localStorage.currentUser;
            }else{
              //clear text and display error
              $scope.username = null;
              $scope.password = null;
              $scope.test = "Username or password is incorrect."
            }
          });
    });
  };
})

//get account/trip information for user
.controller('AccountCtrl', function($scope, $localStorage, UserService, TripService) {
  //FOR TESTING PURPOSES ONLY
  $localStorage.currentUser = 5634472569470976;
  //END TESTING STRING

  var currentUser = $localStorage.currentUser;

  //get profile info
  $scope.profileInfo = UserService.get({id:currentUser});
  //get trips
  $scope.trips = TripService.query({uid:currentUser});
  })

//edit a trip for a user
.controller('EditTripCtrl', function($scope, $stateParams, $localStorage, TripService, DayService, PhotoService) {

  //set global vars
  var currentUser = $localStorage.currentUser;
  $localStorage.currentTrip = $stateParams.tripkey;
  var tripKey = $localStorage.currentTrip;
  
  //FOR TESTING PURPOSES ONLY
  var tripKey = 5707702298738688;
  $localStorage.currentTrip = tripKey;
  //END testing string

  //get trip
  $scope.trip = TripService.get({uid:currentUser, tid: tripKey},
    function(){
      //update trip info
      $scope.editTrip = function(){
//        $scope.trip.$update({uid:currentUser, tid: tripKey},{});
        TripService.update({uid:currentUser, tid:tripKey,"name": $scope.trip.name, "source":$scope.trip.source, "destination": $scope.trip.destination, "miles":$scope.trip.miles, "time": $scope.trip.time, "mode": $scope.trip.mode}, {}, function(){
          $scope.result = "Changes Saved!";
        })
      };
    
  });

  //get days
  $scope.days = DayService.query({uid:currentUser, tid:tripKey});

  })

//edit a day for a user/trip
.controller('EditDayCtrl', function($scope, $localStorage, $stateParams, $cordovaFileTransfer, $cordovaCamera, $cordovaFile, $http, DayService, Camera, Blobstore, PhotoService) {

  //set global vars
  var currentUser = $localStorage.currentUser;
  var tripKey = $localStorage.currentTrip;
  var dayKey = $stateParams.daykey;

  //FOR TESTING PURPOSES ONLY
  var dayKey = 5649050225344512;
  //end testing string

  //get day 
  $scope.day = DayService.get({uid:currentUser, tid: tripKey, did:dayKey},
    function(){
      //update trip info
      $scope.editDay = function(){
        DayService.update({uid:currentUser, tid:tripKey, did:dayKey, "name": $scope.day.name, "source":$scope.day.source, "destination": $scope.day.destination, "miles":$scope.day.miles, "time": $scope.day.time}, {}
          , function(){
          $scope.result = "Changes saved!";
          })
        };

  });

  //get photos
  $scope.photos = PhotoService.query({uid:currentUser, tid:tripKey, did:dayKey}
      , function(){

      });


  //open camera
  $scope.addPhoto = function(){
    Camera.getPicture({
      quality:75,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum:true 
//        destinationType: 0
    }).then(function(imageURI){
      $scope.lastPhoto = imageURI;
      console.log(imageURI);
    }, function(err){
      console.err(err);
    });
  };

  $scope.uploadFile = function(files){
    image = new FormData();
    image.append("file", files[0]);
  }

  $scope.submitPhoto = function(){
    //get blobstore url
//      var url = encodeURI(Blobstore.get());
   var url = "http://road-1207.appspot.com/_ah/upload/AMmfu6aG3emnDJ4ZWcFSD_ZDmdiY2wNM1nU2htjOxIxt4EUU0cJGtxt0dLCqsouTWrViHSCmSexd8ZcPf9g1sCtUOoX4xhPoF0Xpd2FLKXo9-elg2okFT3VY-cLxsedbb-BLXBNuU2Lx/ALBNUaYAAAAAVr72jK0E7SIg5JBbLRm8nychlCQBvmbR/"; 
    console.log("url " + url);
    console.log("$scope.lastPhoto " +$scope.lastPhoto);
    //console.log(image);
    var options = new FileUploadOptions();
//      options.filekey="post";
    options.chunkedMode=false;
    var ft = new FileTransfer();
    var key = ft.upload($scope.lastPhoto, encodeURI(url), onUploadSuccess, onUploadFail, options);
    console.log("key is " +key);
  }
    var onUploadSuccess = function(r){
      console.log("sucess! Code =  "+ r.responseCode);
      console.log("Response =  "+ r.response);
      console.log("Sent=  "+ r.bytesSent);
      var photoKey = r.response;
      console.log("key " +photoKey);
      var photoResult = PhotoService.save({uid: currentUser, tid: tripKey, did:dayKey, pid: photoKey }, {}, function(result){
        console.log(JSON.stringify(result.response));
      }); 
      
    };

    var onUploadFail = function(error){
      console.log("failed " +error.code);
      console.log("upload error source " +error.source);
      console.log("upload error target " +error.target);
    };
})

//add a day for a user/trip
.controller('AddDayCtrl', function($scope, $localStorage, DayService) {

});
