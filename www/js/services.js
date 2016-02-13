angular.module('starter.services', ['ngResource'])

/*
 * API call handlers
 */

//USERS
.factory('UserService', function($resource){
  return $resource('https://road-1207.appspot.com/users/:id',{id:'@id'},{'query': {method:'GET', isArray:false}});
}) 

//TRIPS
.factory('TripService', function($resource){
  return $resource('https://road-1207.appspot.com/users/:uid/trips/:tid'
    ,{uid:'@uid',tid:'@tid'}
    ,{update:{method:'PUT', isArray:false}});
}) 

//DAYS
.factory('DayService', function($resource){
  return $resource('https://road-1207.appspot.com/users/:uid/trips/:tid/days/:did'
    ,{uid:'@uid',tid:'@tid', did:'@did'}
    ,{update:{method:'PUT', isArray:false}});
})

//get blobstoreURL
.factory('Blobstore', function($resource){
  return $resource('https://road-1207.appspot.com/get_upload_url');
})

//PHOTOS
.factory('PhotoService', function($resource){
  return $resource('https://road-1207.appspot.com/users/:uid/trips/:tid/days/:did/photos/:pid'
    ,{uid:'@uid',tid:'@tid', did:'@did', pid:'@pid'}
    ,{update:{method:'PUT', isArray:false}});
})


//camera
.factory('Camera', ['$q', function($q){
  return {
    getPicture: function(options){
      var q = $q.defer();

      navigator.camera.getPicture(function(result){
        q.resolve(result);
      }, function(err){
        q.reject(err);
      }, options);
      return q.promise;
    }
  }
}]);
