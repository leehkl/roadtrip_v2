/*
 * Inspiration for camera functionality:
 * https://learn.ionicframework.com/formulas/cordova-camera
 */
angular.module('starter.controllers', ['starter.services','ionic', 'ngResource', 'ngStorage', 'ngCordova'])

.config(function($compileProvider){
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|blob|cdvfile):|data:image\//);
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
.controller('AccountCtrl', function($scope, $localStorage, $ionicHistory, $state, UserService) {
  //FOR TESTING PURPOSES ONLY
//  $localStorage.currentUser = 5634472569470976;
  //END TESTING STRING
  
  
  var currentUser = $localStorage.currentUser;
  console.log("currentuser " + currentUser);
  
  if(currentUser === undefined || currentUser === null){
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
    alert("You must log in first");
    $state.go('tab.main');
  }
  //get profile info
  $scope.profileInfo = UserService.get({id:currentUser}, function(){
    //create copy for comparison later
    originalProfile = angular.copy($scope.profileInfo);
  });

  //update profile info
  $scope.editProfile = function(){
    //clear out result string displayed on screen
    $scope.result = null;
    $scope.badResult = null;

    console.log("originalProfile " + originalProfile.username);
    
    //check if email is different function
    var checkEmail = function(){
      if($scope.profileInfo.email != originalProfile.email){
        $scope.existing = UserService.get({email: $scope.profileInfo.email},
            function(){
              if($scope.existing.keys.length != 0){
                $scope.badResult = "Email is already in use.";
              }else{
                updateUser();
              }
           });
      }else{
        updateUser();
      }
    };

    //update function
    var updateUser = function(){
      $scope.updatedUser = UserService.update({id: currentUser, username: $scope.profileInfo.username, name: $scope.profileInfo.name, city: $scope.profileInfo.city, email: $scope.profileInfo.email},{}, 
          function(){
            //create copy for comparison later
            originalProfile = angular.copy($scope.updatedUser);
            $scope.result = "Changes saved!";
          })  
    };

    //check username if changed
    if($scope.profileInfo.username != originalProfile.username){
      $scope.existing = UserService.get({username:$scope.profileInfo.username},
        function(){
          //get user-specific information
          if($scope.existing.keys.length != 0){
           console.log("existing is "+ $scope.existing.keys.length);
           $scope.badResult = "Dang! Username already exists.";
          }else{
            checkEmail();
          }
        });
    }else{
      checkEmail();
    } 


  //log out a user
  $scope.logOut = function(){
    //reset local params
    $localStorage.$reset();
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
    $state.go('tab.main');
  };
  
    
  };
})

//add a trip for a user
.controller('TripCtrl', function($scope, $localStorage, $state, TripService) {

  //set current account 
  var currentUser = $localStorage.currentUser;
  
  //get trips
  $scope.trips = TripService.query({uid:currentUser});
 
  //add trip info
  $scope.addTrip = function(){
    console.log("name" + $scope.name);
    var tripKey = TripService.save({uid:currentUser, "name": $scope.name, "source":$scope.source, "destination": $scope.destination, "miles":$scope.miles, "time": $scope.time, "mode": $scope.mode}, {}
      , function(){
        $state.go('tab.trips');
    })
  };
  
  //delete trip
  $scope.deleteTrip = function(tripKey){
    console.log("trip key delete is "+ tripKey);
    TripService.delete({uid: currentUser, tid: tripKey},
        function(){
          $state.go($state.current, {}, {reload: true});
        }
        );
  };
})

//edit a trip for a user
.controller('EditTripCtrl', function($scope, $stateParams, $localStorage, $state, TripService, DayService, PhotoService) {

  //set global vars
  var currentUser = $localStorage.currentUser;
  $localStorage.currentTrip = $stateParams.tripkey;
  var tripKey = $localStorage.currentTrip;
  
  //flag for no-show delete state
  $scope.data = {
    showDelete:false
  }
  //FOR TESTING PURPOSES ONLY
// var tripKey = 5707702298738688;
  //$localStorage.currentTrip = tripKey;
  //END testing string

  //get trips
  $scope.trips = TripService.query({uid:currentUser});

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
.controller('EditDayCtrl', function($scope, $localStorage, $stateParams, DayService, PhotoService) {

  //set global vars
  var currentUser = $localStorage.currentUser;
  var tripKey = $localStorage.currentTrip;
  var dayKey = $stateParams.daykey;
  $localStorage.currentDay = dayKey;

  //FOR TESTING PURPOSES ONLY
//var dayKey = 5649050225344512;
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
  $scope.photos = PhotoService.query({uid:currentUser, tid:tripKey, did:dayKey});

})

.controller('AddPhotoCtrl', function($scope, $localStorage, $cordovaFileTransfer, $cordovaCamera, $cordovaFile, $http, Camera, Blobstore, PhotoService) {

  //set global vars
  var currentUser = $localStorage.currentUser;
  var tripKey = $localStorage.currentTrip;
  var dayKey = $localStorage.currentDay;

  //FOR TESTING PURPOSES ONLY
  //end testing string

  //open camera
  $scope.takePhoto = function(){
    Camera.getPicture({
      quality:75,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum:true 
    }).then(function(imageURI){
      $scope.lastPhoto = imageURI;
      console.log("success takephoto " + imageURI);
    }, function(err){
      console.err(err);
    });
  };

  $scope.uploadFile = function(files){
    image = new FormData();
    image.append("file", files[0]);
  };

  $scope.uploadPhoto = function(){
    Camera.getPicture({
      quality:75,
      targetWidth: 320,
      targetHeight: 320,
      sourceType: 0 //from photo library
    }).then(function(imageURI){
      $scope.lastPhoto = imageURI;
      console.log("success uploadphoto " + imageURI);
    }, function(err){
      console.err(err);
    });
  };

  $scope.submitPhoto = function(){
    //get blobstore url
      $scope.blobURL = Blobstore.get(function(){
      console.log("$scope.blobURL.url " + $scope.blobURL.url);
      console.log("$scope.lastPhoto " +$scope.lastPhoto);
      var options = new FileUploadOptions();
      options.chunkedMode=false;
      var ft = new FileTransfer();
      ft.upload($scope.lastPhoto, encodeURI($scope.blobURL.url), onUploadSuccess, onUploadFail, options);
    });
      var onUploadSuccess = function(r){
        var photoKey = angular.fromJson(r.response);
        photoKey = photoKey.key;
        console.log("sucess! Code =  "+ r.responseCode);
        console.log("Response =  "+ r.response);
        console.log("Sent=  "+ r.bytesSent);
        console.log("key " +photoKey);
        var photoResult = PhotoService.save({uid: currentUser, tid: tripKey, did:dayKey, pid: photoKey }, {}, function(result){
        }); 
        
      };

      var onUploadFail = function(error){
        console.log("failed " +error.code);
        console.log("upload error source " +error.source);
        console.log("upload error target " +error.target);
      };

      };
})

//add a day for a user/trip
.controller('AddDayCtrl', function($scope, $localStorage, DayService) {

});
