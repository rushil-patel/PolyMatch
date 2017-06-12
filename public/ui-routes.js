
app.config(['$stateProvider', '$urlRouterProvider',
 function($stateProvider, $router) {

      //redirect to home if path is not matched
      $router.otherwise("/");

      $stateProvider
      .state('home',  {
         url: '/',
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
            }]
         }
      })
      .state('matches', {
         url: '/matches',
         templateUrl: 'Matches/matches.template.html',
         controller: 'matchesController',
         resolve: {
            matches: ['$q', '$http', 'login',
             function($q, $http, login) {
               console.log('in function');
               return $http.get('/Users/' + login.getUser().id +
                  '/Matches?saved=0&&archived=0')
               .then(function(response) {
                  console.log('getting new matches');
                  return response.data;
               });
            }]
         }
      })
      .state('savedMatches', {
         url: '/matches',
         templateUrl: 'Matches/matches.template.html',
         controller: 'matchesController',
         resolve: {
            matches: ['$q', '$http', 'login',
             function($q, $http, login) {
               console.log('in function');
               return $http.get('/Users/' + login.getUser().id +
                  '/Matches?saved=1')
               .then(function(response) {
                  console.log('getting new matches');
                  return response.data;
               });
            }]
         }
      })
      .state('archivedMatches', {
         url: '/matches',
         templateUrl: 'Matches/matches.template.html',
         controller: 'matchesController',
         resolve: {
            matches: ['$q', '$http', 'login',
             function($q, $http, login) {
               return $http.get('/Users/' + login.getUser().id +
                  '/Matches?archived=1')
               .then(function(response) {
                  return response.data;
               });
            }]
         }
      });
}]);
