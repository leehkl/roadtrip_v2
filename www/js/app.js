// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.config(function($compileProvider){
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  })

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    cache: false,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.main', {
    url: '/main',
    cache: false,
    views: {
      'tab-main': {
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl'
      }
    }
  })

  .state('tab.login', {
    url: '/login',
    cache: false,
    views: {
      'tab-main': {
        templateUrl: 'templates/login.html',
      }
    }
  })
  
  .state('tab.signup', {
    url: '/signup',
    cache: false,
    views: {
      'tab-main': {
        templateUrl: 'templates/signup.html',
      }
    }
  })

  .state('tab.camera', {
      url: '/camera',
      cache: false,
      views: {
        'tab-camera': {
          templateUrl: 'templates/camera.html',
//          controller: 'ChatsCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    cache: false,
    views: {
      'tab-account': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.editTrip', {
    url: '/account/:tripkey',
    cache: false,
    views: {
      'tab-account': {
        templateUrl: 'templates/editTrip.html',
        controller: 'EditTripCtrl'
      }
    }
  })
  
  .state('tab.editDay', {
    url: '/editDay/:daykey',
    cache: false,
    views: {
      'tab-account': {
        templateUrl: 'templates/editDay.html',
        controller: 'EditDayCtrl'
      }
    }
  })
  
  .state('tab.addTrip', {
    url: '/addTrip',
    cache: false,
    views: {
      'tab-account': {
        templateUrl: 'templates/addTrip.html',
        controller: 'AddTripCtrl'
      }
    }
  })
  
  .state('tab.addDay', {
    url: '/addDay',
    cache: false,
    views: {
      'tab-account': {
        templateUrl: 'templates/addDay.html',
        controller: 'AddDayCtrl'
      }
    }
  })

  .state('tab.addPhoto', {
    url: '/addPhoto',
    cache: false,
    views: {
      'tab-account': {
        templateUrl: 'templates/addPhoto.html',
        controller: 'AddPhotoCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/main');

});
