angular.module('starter.services', ['ngResource'])

/*
 * API call handlers
 */
.factory('UserService', function($resource){
  return $resource('https://road-1207.appspot.com/users/:id',{id:'@id'},{'query': {method:'GET', isArray:false}});
}); 
