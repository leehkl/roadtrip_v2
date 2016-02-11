angular.module('starter.controllers', ['starter.services','ionic', 'ngResource'])

.controller('MainCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})


/*
 * API handlers
 * code inspired by: devdactic.com/improving-rest-withngresource/
 * AND learn.ionicframework.com/formulas/backend-data/
 */

//Add new user
.controller('NewUser', function($scope, UserService) {
  $scope.newUser = function(){
    UserService.save({username:$scope.username, password:$scope.password, name:$scope.name, city:$scope.city, email:$scope.email},{});
    }; 
})

//Get all users/search for users
.controller('GetUsers', function($scope, UserService){

  //LOGIN PAGE
  $scope.login = function(){
    //search for user by username
    $scope.users = UserService.get({username:$scope.username},
      function(){
        //get user-specific information
        $scope.currentUser = $scope.users.keys[0];
        $scope.user = UserService.get({id:$scope.users.keys[0]},
          function(){
            if($scope.user.password == $scope.password){
              $scope.test = "Success!";
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

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
