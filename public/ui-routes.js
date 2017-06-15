
app.config(['$stateProvider', '$urlRouterProvider',
 function($stateProvider, $router) {

      //redirect to home if path is not matched
      $router.otherwise("/");

      $stateProvider
      .state('home',  {
         url: '/',
         // template: "<div><img src='Images/campus.jpeg' style='width:100%; height:100%;'></div>"
      })
      .state('user', {
         url: '/profile',
         templateUrl: '/Preferences/profile.template.html',
         controller: 'profileController',
         resolve: {
            user: ['$http', 'login',
             function($http, login) {
                return login.getUser()
                 .then(function(user) {
                    return $http.get('/Users/' + user.id)
                     .then(function(response) {
                       return response.data;
                    });
                 });
             }],
            preferences: ['$http', 'login',
             function($http, login) {
                return login.getUser()
                 .then(function(user) {
                    return $http.get('/Users/' + user.id + '/Prefs')
                     .then(function(response) {
                       return response.data;
                    });
                 });
             }],
             hobbies: ['$http', 'login',
              function($http, login) {
                return login.getUser()
                 .then(function(user) {
                    return $http.get('/Users/' + user.id + '/Hobbies')
                     .then(function(response) {
                      return response.data;
                     });
                 });
              }]
         }
      })
      .state('profile', {
         url: '/profile/:usrId',
         templateUrl: '/Preferences/profile.template.html',
         controller: 'profileController',
         resolve: {
            user: ['$http', '$stateParams', 'login',
             function($http, $stateParams, login) {
               console.log($stateParams.usrId);
               return $http.get('/Users/' + $stateParams.usrId).then(function(response) {
                  return response.data;
               });
             }],
            preferences: ['$http', '$stateParams', 'login',
             function($http, $stateParams, login) {
               return $http.get('/Users/' + $stateParams.usrId + '/Prefs').then(function(response) {
                  return response.data;
               });
             }],
            hobbies: ['$http', '$stateParams', 'login',
              function($http, $stateParams, login) {
                return $http.get('/Users/' + $stateParams.usrId + '/Hobbies').then(function(response) {
                  return response.data;
                });
            }]
         }
      })
      .state('register', {
      	url: '/register',
      	templateUrl: '/Register/register.template.html',
         controller: 'registerController'
      })
      .state('login', {
         url: '/login',
         templateUrl: 'Login/login.template.html',
         controller: 'loginController'
      })
      .state('preferences', {
         url: '/preferences',
         templateUrl: 'Preferences/preferences.template.html',
         controller: 'preferencesController',
         resolve: {
            dormList: ['$q', '$http', 'api', function($q, $http, api) {
               return api.getDorms();
            }],
            majorList: ['$q', '$http', 'api', function($q, $http, api) {
               return api.getMajors();
            }],
            hobbyList: ['$q', '$http', 'api', function($q, $http, api) {
               return api.getHobbies();
            }],
            preferences: ['$http', 'login',
               function($http, login) {
                  return login.getUser()
                   .then(function(user) {
                      return $http.get('/Users/' + user.id + '/Prefs')
                       .then(function(response) {
                         return response.data;
                      });
                   });
            }],
            userHobbies: ['$http', 'login',
               function($http, login) {
                  return login.getUser()
                   .then(function(user) {
                      return $http.get('/Users/' + user.id + '/Hobbies')
                       .then(function(response) {
                         return response.data;
                      });
                   });
            }]
         }
      })
      .state('matches', {
         url: '/matches',
         templateUrl: 'Matches/matches.template.html',
         controller: 'matchesController',
         data: {
            title: 'New Matches!',
            extraQuery: 'saved=0&&archived=0'
         },
         resolve: {
            matches: ['$http', 'login',
            function($http, login) {
               return login.getUser()
                .then(function(user) {
                   return $http.get('/Users/' + user.id + '/Matches?saved=0&&archived=0')
                    .then(function(response) {
                      return response.data;
                   });
                });
            }],
            dormList: ['$q', '$http', 'api', function($q, $http, api) {
               return api.getDorms();
            }],
            majorList: ['$q', '$http', 'api', function($q, $http, api) {
               return api.getMajors();
            }]
         }
      })
      .state('savedMatches', {
         url: '/matches',
         templateUrl: 'Matches/matches.template.html',
         controller: 'matchesController',
         data: {
            title: 'Saved Matches!',
            extraQuery: 'saved=1'
         },
         resolve: {
            matches: ['$http', 'login',
            function($http, login) {
              return login.getUser()
               .then(function(user) {
                  return $http.get('/Users/' + user.id + '/Matches?saved=1')
                   .then(function(response) {
                     return response.data;
                  });
               });
            }],
            dormList: ['$q', '$http', 'api', function($q, $http, api) {
               return api.getDorms();
            }],
            majorList: ['$q', '$http', 'api', function($q, $http, api) {
               return api.getMajors();
            }]
         }
      })
      .state('archivedMatches', {
         url: '/matches',
         templateUrl: 'Matches/matches.template.html',
         controller: 'matchesController',
         data: {
            title: 'Archived Matches!',
            extraQuery: 'archived=1'
         },
         resolve: {
            matches: ['$http', 'login',
            function($http, login) {
             return login.getUser()
              .then(function(user) {
                 return $http.get('/Users/' + user.id + '/Matches?archived=1')
                  .then(function(response) {
                    return response.data;
                 });
              });
            }],
            dormList: ['$q', '$http', 'api', function($q, $http, api) {
               return api.getDorms();
            }],
            majorList: ['$q', '$http', 'api', function($q, $http, api) {
               return api.getMajors();
            }]
         }
      });
}]);
