
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
      	templateUrl: '/Register/register.template.html'
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
               return $http.get('/Users/' + login.getUser().id + '/Matches')
               .then(function(response) {
                  return response.data;
               });
            }]
         }
      });
}]);
